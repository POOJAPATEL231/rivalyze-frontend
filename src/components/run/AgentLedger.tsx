import { useEffect, useRef } from "react";

import { LedgerLine } from "@/components/run/LedgerLine";
import { useAppSelector } from "@/store/hooks";

/** Scrollable event log, auto-scrolling to the newest entry as they arrive. */
export function AgentLedger() {
    const runEvents = useAppSelector((state) => state.analysis.runEvents);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const node = scrollRef.current;
        if (node) node.scrollTop = node.scrollHeight;
    }, [runEvents.length]);

    return (
        <div
            ref={scrollRef}
            className="glass h-[388px] w-full space-y-1.5 overflow-y-auto rounded-xl p-4"
        >
            {runEvents.length === 0 && (
                <p className="font-mono text-xs text-white/40">Waiting for the first signal…</p>
            )}
            {runEvents.map((event) => (
                <LedgerLine key={event.id} event={event} />
            ))}
        </div>
    );
}
