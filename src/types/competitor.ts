export type ScoreStatus = "threat" | "opportunity" | "watch";

/** How this competitor relates to us in the Discovery view — distinct from
 * `category` below, which is a free-text label shown on `CompetitorCard`. */
export type CompetitorRelation = "direct" | "indirect";

export interface Competitor {
    id: string;
    name: string;
    category: string;
    status: ScoreStatus;
    threatScore: number;
    opportunityScore: number;
    marketShare: number;
    fundingUsd: number;
    growthRate: number;
    summary: string;
    relation?: CompetitorRelation;
    rationale?: string;
    domain?: string;
}

export interface TrendPoint {
    month: string;
    [seriesKey: string]: string | number;
}

export interface SwotPoint {
    axis: string;
    [seriesKey: string]: string | number;
}
