import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { MOCK_REPORT } from "@/data/report";
import { extractApiErrorMessage } from "@/lib/apiError";
import { confirmRun, getRunStatus, mapApiCompetitor } from "@/services/analyze";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    resetRun,
    setCompetitors,
    setLaneStatus,
    setReport,
    setRunEvents,
    setRunId,
    setRunStatus,
    unlockStep,
    updateTelemetry,
} from "@/store/slices/analysisSlice";
import type { RunEvent, RunStatus, Telemetry } from "@/types/analysis";
import type { ApiCompetitor, ApiRunEvent, ApiRunStatus } from "@/types/api";

export type AnalysisPhase =
    | "discovering"
    | "awaiting_confirmation"
    | "confirming"
    | "analyzing"
    | "done"
    | "failed";

const POLL_INTERVAL_MS = 2000;
/** ~50s soft timeout for discovery, matching the old useDiscoveryJob's cap. */
const MAX_DISCOVERY_POLLS = 25;
/** ~3min soft timeout for analysis, matching the old useLiveRun's cap. */
const MAX_ANALYSIS_POLLS = 90;

/** lane_stats is an open Record<string, number> whose provider keys
 * (groq/gemini/cerebras/openrouter/...) vary run to run, but these three are
 * fixed backend field names — verified against a real completed run.
 * llm_calls is already the backend's own sum across every provider used, so
 * there's no need to total the per-provider counts ourselves. Note the
 * snake_case: it doesn't match Telemetry's own field names, unlike `searches`. */
const LANE_STATS_KEY: Record<keyof Pick<Telemetry, "llmCalls" | "searches" | "signals">, string> = {
    llmCalls: "llm_calls",
    searches: "searches",
    signals: "signals_found",
};

function mapTelemetry(laneStats: Record<string, number>): Partial<Telemetry> {
    const update: Partial<Telemetry> = {};
    for (const [telemetryKey, laneStatsKey] of Object.entries(LANE_STATS_KEY) as [
        keyof Telemetry,
        string,
    ][]) {
        const value = laneStats[laneStatsKey];
        if (typeof value === "number") update[telemetryKey] = value;
    }
    return update;
}

function mapEvent(event: ApiRunEvent, index: number): RunEvent {
    return {
        id: `${event.agent}-${event.t}-${index}`,
        timestamp: event.t,
        agent: event.agent,
        text: event.msg,
    };
}

/** Derives the phase a manual (StepBar/Back-button) revisit should render
 * without touching the network — the only signals available are whatever's
 * already sitting in the store from the original automatic run. */
function deriveStoredPhase(runStatus: RunStatus, hasCompetitors: boolean): AnalysisPhase {
    if (runStatus === "done") return "done";
    if (runStatus === "running") return "analyzing";
    if (hasCompetitors) return "awaiting_confirmation";
    return "discovering";
}

/** Drives the whole running_discovery -> completed lifecycle from one
 * continuous poll loop against GET /runs/{job_id}. Discovery-phase and
 * analysis-phase events share one growing array on the backend, so a
 * single running ledger falls out naturally with no reset at the confirm
 * boundary — only the poll target (discovery vs analysis) changes.
 *
 * When `manual` is set (a StepBar/Back-button revisit to an already-unlocked
 * step, not the app routing you here fresh), skips resetting/polling
 * entirely and just reflects whatever's already in the store. */
export function useAnalysisRun(jobId: string | null, options?: { manual?: boolean }) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const manual = options?.manual ?? false;
    const storedRunStatus = useAppSelector((state) => state.analysis.runStatus);
    const storedHasCompetitors = useAppSelector((state) => state.analysis.competitors.length > 0);
    const [phase, setPhase] = useState<AnalysisPhase>(() =>
        manual ? deriveStoredPhase(storedRunStatus, storedHasCompetitors) : "discovering",
    );
    const [error, setError] = useState<string | null>(null);
    const cancelledRef = useRef(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const competitorsAppliedRef = useRef(false);

    function finishRun(status: ApiRunStatus) {
        dispatch(setLaneStatus({ lane: "discovery", status: "done" }));
        dispatch(setLaneStatus({ lane: "news", status: "done" }));
        dispatch(setLaneStatus({ lane: "product", status: "done" }));
        dispatch(setLaneStatus({ lane: "reviews", status: "done" }));
        dispatch(setLaneStatus({ lane: "strategist", status: "done" }));
        dispatch(setRunStatus("done"));
        dispatch(setReport({ ...MOCK_REPORT, generatedAt: new Date().toISOString() }));
        dispatch(setRunId(status.run_id));
        setPhase("done");
    }

    function pollDiscovery(id: string, attempt: number) {
        timeoutRef.current = setTimeout(() => {
            if (cancelledRef.current) return;

            getRunStatus(id)
                .then((status) => {
                    if (cancelledRef.current) return;
                    dispatch(setRunEvents(status.events.map(mapEvent)));
                    dispatch(updateTelemetry(mapTelemetry(status.lane_stats)));

                    if (
                        status.status === "awaiting_confirmation" ||
                        status.status === "completed"
                    ) {
                        if (!competitorsAppliedRef.current) {
                            competitorsAppliedRef.current = true;
                            dispatch(
                                setCompetitors(
                                    (status.result?.competitors ?? []).map(mapApiCompetitor),
                                ),
                            );
                        }

                        if (status.status === "completed") {
                            // Already finished before we ever confirmed
                            // anything this session (e.g. a resumed job) —
                            // nothing left to review, so skip the manual
                            // "Open the dashboard" click and go straight there.
                            finishRun(status);
                            dispatch(unlockStep("dashboard"));
                            navigate("/dashboard");
                        } else {
                            dispatch(setLaneStatus({ lane: "discovery", status: "done" }));
                            setPhase("awaiting_confirmation");
                        }
                        return;
                    }

                    if (status.status === "failed") {
                        setPhase("failed");
                        setError(status.error ?? "Discovery failed. Please try again.");
                        return;
                    }

                    if (attempt >= MAX_DISCOVERY_POLLS) {
                        setPhase("failed");
                        setError("This is taking longer than expected. Please try again.");
                        return;
                    }

                    pollDiscovery(id, attempt + 1);
                })
                .catch((err: unknown) => {
                    if (cancelledRef.current) return;

                    if (attempt >= MAX_DISCOVERY_POLLS) {
                        setPhase("failed");
                        setError(extractApiErrorMessage(err));
                        return;
                    }

                    pollDiscovery(id, attempt + 1);
                });
        }, POLL_INTERVAL_MS);
    }

    function pollAnalysis(id: string, attempt: number) {
        timeoutRef.current = setTimeout(() => {
            if (cancelledRef.current) return;

            getRunStatus(id)
                .then((status) => {
                    if (cancelledRef.current) return;
                    dispatch(setRunEvents(status.events.map(mapEvent)));
                    dispatch(updateTelemetry(mapTelemetry(status.lane_stats)));

                    if (status.status === "completed" || status.run_id !== null) {
                        finishRun(status);
                        return;
                    }

                    if (status.status === "failed") {
                        setPhase("failed");
                        setError(status.error ?? "Analysis failed. Please try again.");
                        return;
                    }

                    if (attempt >= MAX_ANALYSIS_POLLS) {
                        setPhase("failed");
                        setError("This is taking longer than expected. Please try again.");
                        return;
                    }

                    pollAnalysis(id, attempt + 1);
                })
                .catch((err: unknown) => {
                    if (cancelledRef.current) return;

                    if (attempt >= MAX_ANALYSIS_POLLS) {
                        setPhase("failed");
                        setError(extractApiErrorMessage(err));
                        return;
                    }

                    pollAnalysis(id, attempt + 1);
                });
        }, POLL_INTERVAL_MS);
    }

    useEffect(() => {
        if (!jobId || manual) return;
        cancelledRef.current = false;
        competitorsAppliedRef.current = false;

        dispatch(resetRun());
        dispatch(setCompetitors([]));
        dispatch(setLaneStatus({ lane: "discovery", status: "running" }));
        pollDiscovery(jobId, 1);

        return () => {
            cancelledRef.current = true;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
        // Runs once per merged-view mount, keyed only on jobId — jobId never
        // changes while this screen stays mounted (a new analysis means a
        // full navigation away and back, i.e. a fresh mount).
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobId, manual]);

    async function confirm(competitors: ApiCompetitor[]) {
        if (!jobId) return;
        setPhase("confirming");
        setError(null);
        try {
            await confirmRun(jobId, competitors);
            dispatch(setRunStatus("running"));
            dispatch(setLaneStatus({ lane: "news", status: "running" }));
            dispatch(setLaneStatus({ lane: "product", status: "running" }));
            dispatch(setLaneStatus({ lane: "reviews", status: "running" }));
            setPhase("analyzing");
            pollAnalysis(jobId, 1);
        } catch (err) {
            setPhase("awaiting_confirmation");
            setError(extractApiErrorMessage(err));
        }
    }

    return { phase, error, confirm };
}
