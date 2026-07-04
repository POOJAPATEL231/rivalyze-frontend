import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import { extractApiErrorMessage } from "@/lib/apiError";
import { getRunStatus, mapApiCompetitor, startAnalysis } from "@/services/analyze";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    discoveryJobFailed,
    discoveryJobPolling,
    discoveryJobSubmitting,
    resetDiscoveryJob,
    setCompetitors,
    setStep,
    unlockStep,
} from "@/store/slices/analysisSlice";
import type { ApiAnalyzeRequest } from "@/types/api";

const POLL_INTERVAL_MS = 2000;
/** ~90s soft timeout so a stuck backend job fails visibly instead of
 * polling forever. */
const MAX_POLLS = 45;

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

                    if (status.status === "completed") {
                        const competitors = (status.result?.competitors ?? []).map(
                            mapApiCompetitor,
                        );
                        dispatch(setCompetitors(competitors));
                        dispatch(unlockStep("discovery"));
                        navigate("/discovery");
                        dispatch(resetDiscoveryJob());
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
