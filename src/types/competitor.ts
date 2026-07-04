export type ScoreStatus = "threat" | "opportunity" | "watch";

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
}

export interface TrendPoint {
    month: string;
    [seriesKey: string]: string | number;
}

export interface SwotPoint {
    axis: string;
    [seriesKey: string]: string | number;
}
