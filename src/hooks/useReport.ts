import { useEffect, useState } from "react";

import { extractApiErrorMessage } from "@/lib/apiError";
import { getReport } from "@/services/analyze";
import type { ApiReportResponse } from "@/types/api";

type ReportState =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; data: ApiReportResponse };

/** Fetches GET /api/v1/reports/{run_id} once a run has completed. */
export function useReport(runId: string | null): ReportState {
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
                if (!cancelled) setState({ status: "success", data });
            })
            .catch((error: unknown) => {
                if (!cancelled)
                    setState({ status: "error", message: extractApiErrorMessage(error) });
            });

        return () => {
            cancelled = true;
        };
    }, [runId]);

    return state;
}
