import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import { extractApiErrorMessage } from "@/lib/apiError";
import { getRunStatus, startAnalysis } from "@/services/analyze";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    discoveryJobFailed,
    discoveryJobPolling,
    discoveryJobSubmitting,
    setCompetitors,
    setStep,
    unlockStep,
} from "@/store/slices/analysisSlice";
import type { ApiAnalyzeRequest, ApiCompetitor } from "@/types/api";
import type { Competitor } from "@/types/competitor";

const POLL_INTERVAL_MS = 2000;
/** ~90s soft timeout so a stuck backend job fails visibly instead of
 * polling forever. */
const MAX_POLLS = 45;

function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

/** Only `name`/`relation`/`rationale` are ever read in the Discovery view —
 * the score fields below belong to the legacy CompetitorCard/dashboard and
 * aren't populated by this API yet, so they default rather than fabricate. */
function mapApiCompetitor(competitor: ApiCompetitor, index: number): Competitor {
    return {
        id: slugify(competitor.name) || `competitor-${index}`,
        name: competitor.name,
        category: "",
        status: "watch",
        threatScore: 0,
        opportunityScore: 0,
        marketShare: 0,
        fundingUsd: 0,
        growthRate: 0,
        summary: "",
        relation: competitor.category,
        rationale: competitor.rationale,
    };
}

export function useDiscoveryJob() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const discoveryJob = useAppSelector((state) => state.analysis.discoveryJob);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cancelledRef = useRef(false);

    useEffect(() => {
        return () => {
            cancelledRef.current = true;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    function poll(jobId: string, attempt: number) {
        timeoutRef.current = setTimeout(() => {
            if (cancelledRef.current) return;

            getRunStatus(jobId)
                .then((status) => {
                    if (cancelledRef.current) return;

                    if (status.status === "awaiting_confirmation") {
                        const competitors = (status.result?.competitors ?? []).map(
                            mapApiCompetitor,
                        );
                        dispatch(setCompetitors(competitors));
                        dispatch(unlockStep("discovery"));
                        navigate("/discovery");
                        return;
                    }

                    // Already confirmed and finished — skip the review/Deploy
                    // step entirely so confirm isn't called on it again.
                    if (status.status === "completed") {
                        dispatch(unlockStep("run"));
                        navigate("/run");
                        return;
                    }

                    if (status.status === "failed") {
                        dispatch(
                            discoveryJobFailed(
                                status.error ?? "Analysis failed. Please try again.",
                            ),
                        );
                        return;
                    }

                    if (attempt >= MAX_POLLS) {
                        dispatch(
                            discoveryJobFailed(
                                "This is taking longer than expected. Please try again.",
                            ),
                        );
                        return;
                    }

                    poll(jobId, attempt + 1);
                })
                .catch((error: unknown) => {
                    if (cancelledRef.current) return;
                    dispatch(discoveryJobFailed(extractApiErrorMessage(error)));
                });
        }, POLL_INTERVAL_MS);
    }

    async function startDiscovery(payload: ApiAnalyzeRequest) {
        cancelledRef.current = false;
        dispatch(discoveryJobSubmitting());
        try {
            const { job_id } = await startAnalysis(payload);
            if (cancelledRef.current) return;
            dispatch(discoveryJobPolling(job_id));
            poll(job_id, 1);
        } catch (error) {
            if (cancelledRef.current) return;
            dispatch(discoveryJobFailed(extractApiErrorMessage(error)));
        }
    }

    return { startDiscovery, status: discoveryJob.status, error: discoveryJob.error };
}
