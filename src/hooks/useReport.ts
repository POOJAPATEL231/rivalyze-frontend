import { useEffect, useState } from "react";

import { extractApiErrorMessage } from "@/lib/apiError";
import { getReport } from "@/services/analyze";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setApiReport } from "@/store/slices/analysisSlice";
import type { ApiReportResponse } from "@/types/api";

type ReportState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; data: ApiReportResponse };

/** Fetches GET /api/v1/reports/{run_id} once a run has completed. Reuses a
 * cached report for this exact runId already sitting in the store instead of
 * refetching — regardless of which screen asked or how the user navigated
 * here, so Dashboard, Recommendations, and Compare all share one fetch per
 * run instead of racing each other or showing a stale "run the agents
 * first" empty state while another screen's fetch is still in flight. */
export function useReport(runId: string | null): ReportState {
    const dispatch = useAppDispatch();
    const cachedReport = useAppSelector((state) => state.analysis.apiReport);
    const cachedRunId = useAppSelector((state) => state.analysis.apiReportRunId);
    const hasCache = runId !== null && runId === cachedRunId && cachedReport !== null;

    const [state, setState] = useState<ReportState>(() => {
        if (!runId) return { status: "idle" };
        if (hasCache) return { status: "success", data: cachedReport };
        return { status: "loading" };
    });

    useEffect(() => {
        if (!runId || hasCache) return;

        let cancelled = false;

        getReport(runId)
            .then((data) => {
                if (cancelled) return;
                setState({ status: "success", data });
                dispatch(setApiReport({ runId, report: data }));
            })
            .catch((error: unknown) => {
                if (!cancelled)
                    setState({ status: "error", message: extractApiErrorMessage(error) });
            });

        return () => {
            cancelled = true;
        };
        // Runs once per mount, keyed on runId — hasCache is only meaningful
        // at the moment this hook first mounts for a given runId.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [runId]);

    return state;
}
