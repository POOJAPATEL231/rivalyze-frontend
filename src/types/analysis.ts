import type { Recommendation } from "@/types/recommendation";

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
    recommendations: Recommendation[];
}
