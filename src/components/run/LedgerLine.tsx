import type { RunEvent } from "@/types/analysis";

interface LedgerLineProps {
    event: RunEvent;
}

// This panel is always dark regardless of app theme (like a terminal), so
// these pull the .dark-mode chart hex values directly rather than the
// theme-reactive text-success/text-primary/etc utilities, which would
// resolve to light-mode colors and wash out on this fixed dark backdrop.
// Keyed by the 5 conceptual work-lanes; the real backend also emits
// cross-cutting agent labels (system/search/router/merge) that fall back
// to FALLBACK_COLOR below instead of going uncolored.
const AGENT_COLOR: Record<string, string> = {
    discovery: "#b37f1e",
    news: "#189b7d",
    product: "#a077f8",
    reviews: "#ef5366",
    strategist: "#3b8fcb",
};
const FALLBACK_COLOR = "#8a8f98";

export function LedgerLine({ event }: LedgerLineProps) {
    return (
        <p className="font-mono text-xs leading-relaxed">
            <span className="">{event.timestamp.toFixed(2) + "s "}</span>
            <span style={{ color: AGENT_COLOR[event.agent] ?? FALLBACK_COLOR }}>
                [{event.agent}]
            </span>{" "}
            <span className="">{event.text}</span>
        </p>
    );
}
