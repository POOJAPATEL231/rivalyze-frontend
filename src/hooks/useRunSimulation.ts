import { useEffect, useRef, useState } from "react";

import { MOCK_REPORT } from "@/data/report";
import { RUN_SCRIPT } from "@/data/runScript";
import { useAppDispatch } from "@/store/hooks";
import {
    appendRunEvent,
    resetRun,
    setLaneStatus,
    setReport,
    setRunStatus,
    updateTelemetry,
} from "@/store/slices/analysisSlice";
import type { RunScriptEntry } from "@/types/analysis";

const TOTAL_SECONDS = Math.ceil((RUN_SCRIPT[RUN_SCRIPT.length - 1]?.delayMs ?? 0) / 1000);

export function useRunSimulation() {
    const dispatch = useAppDispatch();
    const [lowSignalDetected, setLowSignalDetected] = useState(false);
    const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const appliedCountRef = useRef(0);

    function applyEntry(entry: RunScriptEntry) {
        appliedCountRef.current += 1;

        dispatch(
            appendRunEvent({
                id: `${entry.agent}-${entry.delayMs}`,
                timestamp: entry.delayMs,
                agent: entry.agent,
                text: entry.text,
            }),
        );
        if (entry.telemetry) dispatch(updateTelemetry(entry.telemetry));

        for (const effect of entry.effects ?? []) {
            switch (effect) {
                case "doneN":
                    dispatch(setLaneStatus({ lane: "news", status: "done" }));
                    break;
                case "doneP":
                    dispatch(setLaneStatus({ lane: "product", status: "done" }));
                    break;
                case "doneR":
                    dispatch(setLaneStatus({ lane: "reviews", status: "done" }));
                    break;
                case "startSyn":
                    dispatch(setLaneStatus({ lane: "strategist", status: "running" }));
                    break;
                case "low":
                    setLowSignalDetected(true);
                    break;
                case "finish":
                    dispatch(setLaneStatus({ lane: "strategist", status: "done" }));
                    dispatch(setRunStatus("done"));
                    dispatch(setReport({ ...MOCK_REPORT, generatedAt: new Date().toISOString() }));
                    break;
            }
        }
    }

    useEffect(() => {
        // lowSignalDetected's useState(false) already starts fresh each mount —
        // LiveRunView fully unmounts when leaving this step, so no manual reset
        // is needed here (and setState-in-effect is a react-hooks lint error).
        dispatch(resetRun());
        appliedCountRef.current = 0;
        dispatch(setRunStatus("running"));
        dispatch(setLaneStatus({ lane: "news", status: "running" }));
        dispatch(setLaneStatus({ lane: "product", status: "running" }));
        dispatch(setLaneStatus({ lane: "reviews", status: "running" }));

        timeoutsRef.current = RUN_SCRIPT.map((entry) =>
            setTimeout(() => applyEntry(entry), entry.delayMs),
        );

        let seconds = 0;
        intervalRef.current = setInterval(() => {
            seconds += 1;
            dispatch(updateTelemetry({ elapsedSeconds: seconds }));
        }, 1000);

        return () => {
            timeoutsRef.current.forEach(clearTimeout);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
        // Runs once per LiveRunView mount — re-entering the step is what should
        // restart it, not a dependency change mid-run.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function skip() {
        timeoutsRef.current.forEach(clearTimeout);
        if (intervalRef.current) clearInterval(intervalRef.current);

        // Only the entries that haven't fired yet — applying the whole script
        // unconditionally would duplicate ledger lines already appended.
        RUN_SCRIPT.slice(appliedCountRef.current).forEach(applyEntry);
        dispatch(updateTelemetry({ elapsedSeconds: TOTAL_SECONDS }));
    }

    return { skip, lowSignalDetected };
}
