import type { Competitor, SwotPoint, TrendPoint } from "@/types/competitor";

// Identity color is fixed per entity and reused everywhere (cards, badges,
// charts) so "Northwind" is always the same hue across the dashboard —
// pulled from the validated --chart-1..5 categorical tokens.
export const RIVALYZE_COLOR = "var(--chart-2)";

export const competitors: Competitor[] = [
    {
        id: "northwind",
        name: "Northwind Analytics",
        category: "AI Market Intelligence",
        status: "threat",
        threatScore: 82,
        opportunityScore: 24,
        marketShare: 28,
        fundingUsd: 64,
        growthRate: 12.4,
        summary:
            "Aggressive enterprise push this quarter, undercutting on price while bundling in a new forecasting module.",
        relation: "direct",
        domain: "northwindanalytics.io",
        rationale:
            "Same core product category — AI-driven competitive intelligence — and actively competing for the same enterprise accounts.",
    },
    {
        id: "vantage",
        name: "Vantage AI",
        category: "Signal & Alerting",
        status: "watch",
        threatScore: 54,
        opportunityScore: 41,
        marketShare: 16,
        fundingUsd: 22,
        growthRate: 5.1,
        summary:
            "Stable roadmap, but recent layoffs and a support-quality slide are opening room in mid-market accounts.",
        relation: "direct",
        domain: "vantage.ai",
        rationale:
            "Overlapping use case — real-time signal alerting for competitive moves — and competes for the same mid-market segment.",
    },
    {
        id: "pulsemetrics",
        name: "PulseMetrics",
        category: "Sentiment Tracking",
        status: "opportunity",
        threatScore: 21,
        opportunityScore: 76,
        marketShare: 9,
        fundingUsd: 8,
        growthRate: -3.2,
        summary:
            "Churn is climbing after their pricing overhaul — a clear opening to target their SMB base directly.",
        relation: "indirect",
        domain: "pulsemetrics.io",
        rationale:
            "Focused narrowly on sentiment tracking rather than full competitive intelligence — adjacent, not a head-to-head substitute.",
    },
    {
        id: "beacon",
        name: "Beacon Insights",
        category: "Competitive Reporting",
        status: "watch",
        threatScore: 47,
        opportunityScore: 38,
        marketShare: 11,
        fundingUsd: 15,
        growthRate: 3.8,
        summary:
            "Quietly expanding into APAC. No direct product overlap yet, but their acquisition pace bears watching.",
        relation: "indirect",
        domain: "beaconinsights.co",
        rationale:
            "Static competitive reporting without real-time monitoring — overlaps only on the reporting layer, not live signal detection.",
    },
];

// chart-1 (red/threat), chart-3 (teal/opportunity), chart-4 (blue),
// chart-5 (amber) — chart-2 is reserved for Rivalyze itself.
export const competitorColor: Record<string, string> = {
    northwind: "var(--chart-1)",
    vantage: "var(--chart-5)",
    pulsemetrics: "var(--chart-3)",
    beacon: "var(--chart-4)",
};

export const marketShareData = [
    { name: "Rivalyze", marketShare: 36, fill: RIVALYZE_COLOR },
    ...competitors.map((c) => ({
        name: c.name.split(" ")[0],
        marketShare: c.marketShare,
        fill: competitorColor[c.id],
    })),
];

export const trendData: TrendPoint[] = [
    { month: "Feb", Rivalyze: 18, Northwind: 24, Vantage: 15 },
    { month: "Mar", Rivalyze: 22, Northwind: 26, Vantage: 16 },
    { month: "Apr", Rivalyze: 27, Northwind: 27, Vantage: 17 },
    { month: "May", Rivalyze: 31, Northwind: 29, Vantage: 16 },
    { month: "Jun", Rivalyze: 38, Northwind: 30, Vantage: 15 },
    { month: "Jul", Rivalyze: 44, Northwind: 32, Vantage: 14 },
];

export const swotData: SwotPoint[] = [
    { axis: "Product", Rivalyze: 82, Northwind: 74 },
    { axis: "Pricing", Rivalyze: 70, Northwind: 58 },
    { axis: "Marketing", Rivalyze: 55, Northwind: 81 },
    { axis: "Support", Rivalyze: 88, Northwind: 62 },
    { axis: "Innovation", Rivalyze: 79, Northwind: 66 },
];
