export type RecommendationType = "pricing" | "product" | "marketing" | "expansion";

export interface Recommendation {
    id: string;
    title: string;
    description: string;
    type: RecommendationType;
    /** Competitor id this recommendation responds to, or "market" if general. */
    relatedTo: string;
    confidence: number;
    sources: string[];
}
