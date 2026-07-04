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

export type ThreatLevel = "low" | "moderate" | "elevated" | "critical";

/** A claim made somewhere in the report — evidenceId links it to an
 * EvidenceItem for the drawer; omit it for claims with no single source. */
export interface Claim {
    text: string;
    evidenceId?: string;
}

export interface HeadToHeadCell extends Claim {
    badge?: "new" | "high-risk";
}

export interface HeadToHeadRow {
    you: HeadToHeadCell;
    /** Keyed by Competitor.id. */
    rivals: Record<string, HeadToHeadCell>;
}

export interface Swot {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}

export interface SentimentEntry {
    /** Competitor.id */
    competitorId: string;
    score: number;
    label: string;
}

export interface Opportunity {
    lead: string;
    claim: string;
    evidenceId: string;
}

export interface Report {
    generatedAt: string;
    threatLevel: ThreatLevel;
    topThreat: Claim;
    biggestOpportunity: Claim;
    recommendedAction: Claim;
    headToHead: {
        price: HeadToHeadRow;
        aiPositioning: HeadToHeadRow;
        recentMove: HeadToHeadRow;
        topComplaint: HeadToHeadRow;
    };
    swot: Swot;
    sentiment: SentimentEntry[];
    opportunities: Opportunity[];
    sourceCategories: string[];
}
