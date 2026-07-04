import type { Recommendation } from "@/types/recommendation";

export const recommendations: Recommendation[] = [
    {
        id: "rec-pricing-northwind",
        title: "Counter Northwind's enterprise bundle with a forecasting add-on",
        description:
            "Northwind is winning enterprise deals by bundling forecasting at no extra cost. Matching this closes the gap without a blanket price cut.",
        type: "pricing",
        relatedTo: "northwind",
        confidence: 84,
        sources: ["Pricing page diff", "Sales call notes", "G2 reviews"],
    },
    {
        id: "rec-expansion-pulsemetrics",
        title: "Target PulseMetrics' churning SMB accounts",
        description:
            "Their recent pricing overhaul is driving churn in the SMB tier. A migration offer timed now has a high conversion window.",
        type: "expansion",
        relatedTo: "pulsemetrics",
        confidence: 77,
        sources: ["G2 reviews", "Churn signal tracker"],
    },
    {
        id: "rec-product-vantage",
        title: "Fast-follow on real-time alerting before Vantage recovers",
        description:
            "Vantage's support-quality slide post-layoffs has opened a window on their core alerting feature. Ship a comparable capability within the quarter.",
        type: "product",
        relatedTo: "vantage",
        confidence: 68,
        sources: ["Support forum mining", "Job postings analysis"],
    },
    {
        id: "rec-marketing-beacon",
        title: "Pre-position messaging ahead of Beacon's APAC launch",
        description:
            "Beacon's acquisition pace signals an APAC entry within two quarters. Early localized messaging can anchor the category before they arrive.",
        type: "marketing",
        relatedTo: "beacon",
        confidence: 58,
        sources: ["Funding filings", "LinkedIn hiring trends"],
    },
];
