export type AnalysisStep =
    | "brief"
    | "discovery"
    | "run"
    | "dashboard"
    | "recommendations"
    | "compare"
    | "workspace"
    | "history";

export type InputMode = "company" | "idea";

export type RunStatus = "idle" | "running" | "done";

export type LaneId = "discovery" | "news" | "product" | "reviews" | "strategist";

export type LaneStatus = "queued" | "waiting" | "running" | "done";

/** agent is a plain string, not LaneId — the real backend emits several
 * cross-cutting agent labels (system/search/router/merge) alongside the 5
 * lane names, and the raw ledger renders all of them. */
export interface RunEvent {
    id: string;
    timestamp: number;
    agent: string;
    text: string;
}

export interface Telemetry {
    elapsedSeconds: number;
    llmCalls: number;
    searches: number;
    signals: number;
}

export interface Source {
    id: string;
    name: string;
    type: string;
    date: string;
    snippet: string;
    url: string;
    agent: LaneId;
}

export interface EvidenceItem {
    id: string;
    claim: string;
    sources: Source[];
    confidenceNote?: string;
}
