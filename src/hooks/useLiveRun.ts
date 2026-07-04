import { useEffect, useRef } from "react";

import { MOCK_REPORT } from "@/data/report";
import { getRunStatus } from "@/services/analyze";
import { useAppDispatch } from "@/store/hooks";
import {
    resetRun,
    setLaneStatus,
    setReport,
    setRunEvents,
    setRunId,
    setRunStatus,
} from "@/store/slices/analysisSlice";
import type { LaneId, RunEvent } from "@/types/analysis";
import type { ApiRunEvent } from "@/types/api";

const POLL_INTERVAL_MS = 2000;

function mapEvent(event: ApiRunEvent, index: number): RunEvent {
    return {
        id: `${event.agent}-${event.t}-${index}`,
        timestamp: event.t,
        agent: event.agent as LaneId,
        text: event.msg,
    };
}

/** Polls the real backend job instead of the scripted mock — used once a job
 * has been confirmed and `running_analysis` is underway. */
export function useLiveRun(jobId: string | null) {
    const dispatch = useAppDispatch();
    const cancelledRef = useRef(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!jobId) return;
        cancelledRef.current = false;

        dispatch(resetRun());
        dispatch(setRunStatus("running"));
        dispatch(setLaneStatus({ lane: "news", status: "running" }));
        dispatch(setLaneStatus({ lane: "product", status: "running" }));
        dispatch(setLaneStatus({ lane: "reviews", status: "running" }));

        function poll() {
            getRunStatus(jobId!)
                .then((status) => {
                    if (cancelledRef.current) return;
                    dispatch(setRunEvents(status.events.map(mapEvent)));

                    if (status.status === "completed") {
                        dispatch(setLaneStatus({ lane: "news", status: "done" }));
                        dispatch(setLaneStatus({ lane: "product", status: "done" }));
                        dispatch(setLaneStatus({ lane: "reviews", status: "done" }));
                        dispatch(setLaneStatus({ lane: "strategist", status: "done" }));
                        dispatch(setRunStatus("done"));
                        // ponytail: Recommendations/Compare still read the mock Report
                        // shape — real data now flows to Dashboard via runId + useReport.
                        dispatch(
                            setReport({ ...MOCK_REPORT, generatedAt: new Date().toISOString() }),
                        );
                        dispatch(setRunId(status.run_id));
                        return;
                    }

                    if (status.status === "failed") return;

                    timeoutRef.current = setTimeout(poll, POLL_INTERVAL_MS);
                })
                .catch(() => {
                    if (cancelledRef.current) return;
                    timeoutRef.current = setTimeout(poll, POLL_INTERVAL_MS);
                });
        }

        poll();

        return () => {
            cancelledRef.current = true;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [jobId, dispatch]);
}
