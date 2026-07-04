import type { LaneId, RunEvent } from "@/types/analysis";

interface LedgerLineProps {
    event: RunEvent;
}

// This panel is always dark regardless of app theme (like a terminal), so
// these pull the .dark-mode chart hex values directly rather than the
// theme-reactive text-success/text-primary/etc utilities, which would
// resolve to light-mode colors and wash out on this fixed dark backdrop.
const AGENT_COLOR: Record<LaneId, string> = {
    discovery: "#b37f1e",
    news: "#189b7d",
    product: "#a077f8",
    reviews: "#ef5366",
    strategist: "#3b8fcb",
};

function formatTimestamp(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function LedgerLine({ event }: LedgerLineProps) {
    return (
        <p className="font-mono text-xs leading-relaxed">
            <span className="text-white/40">{formatTimestamp(event.timestamp)}</span>{" "}
            <span style={{ color: AGENT_COLOR[event.agent] }}>[{event.agent}]</span>{" "}
            <span className="text-white/85">{event.text}</span>
        </p>
    );
}
