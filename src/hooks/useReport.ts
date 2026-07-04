import { useEffect, useState } from "react";

import { extractApiErrorMessage } from "@/lib/apiError";
import { getReport } from "@/services/analyze";
import { useAppDispatch } from "@/store/hooks";
import { setApiReport } from "@/store/slices/analysisSlice";
import type { ApiReportResponse } from "@/types/api";

type ReportState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; data: ApiReportResponse };

/** Fetches GET /api/v1/reports/{run_id} once a run has completed. */
/** Also mirrors a successful fetch into the store's `apiReport` field so
 * RecommendationsView can read the same response's `recommendations`
 * after navigating away from Dashboard. */
export function useReport(runId: string | null): ReportState {
    const dispatch = useAppDispatch();
    const [state, setState] = useState<ReportState>({ status: "idle" });

    useEffect(() => {
        if (!runId) {
            setState({ status: "idle" });
            return;
        }

        let cancelled = false;
        setState({ status: "loading" });

        getReport(runId)
            .then((data) => {
                if (cancelled) return;
                setState({ status: "success", data });
                dispatch(setApiReport(data));
            })
            .catch((error: unknown) => {
                if (!cancelled)
                    setState({ status: "error", message: extractApiErrorMessage(error) });
            });

        return () => {
            cancelled = true;
        };
    }, [runId, dispatch]);

    return state;
}
