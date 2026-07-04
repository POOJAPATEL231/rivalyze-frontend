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

export interface RunEvent {
    id: string;
    timestamp: number;
    agent: LaneId;
    text: string;
}

export interface Telemetry {
    elapsedSeconds: number;
    llmCalls: number;
    searches: number;
    signals: number;
}

export type RunEffect = "doneN" | "doneP" | "doneR" | "low" | "startSyn" | "finish";

export interface RunScriptEntry {
    /** Absolute ms from run start — all entries are scheduled from mount, not chained. */
    delayMs: number;
    agent: LaneId;
    text: string;
    effects?: RunEffect[];
    /** Absolute telemetry snapshot at this checkpoint, not a delta. */
    telemetry?: Partial<Telemetry>;
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

/** Minimal placeholder — Phase 4/5 extend this once the dashboard and
 * recommendations data shape is defined. */
export interface Report {
    generatedAt: string;
}
