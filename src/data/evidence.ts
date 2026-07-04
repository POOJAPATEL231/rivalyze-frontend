import type { EvidenceItem } from "@/types/analysis";

export const evidence: Record<string, EvidenceItem> = {
    "ev-threat-northwind": {
        id: "ev-threat-northwind",
        claim: "Northwind Analytics is bundling a forecasting module into its enterprise tier at no extra cost, directly undercutting deals we're mid-negotiation on.",
        sources: [
            {
                id: "src-northwind-pricing",
                name: "Northwind pricing page diff",
                type: "Product page",
                date: "2026-06-18",
                snippet:
                    "Forecasting & Scenarios — now included in Enterprise. Previously a $400/mo add-on.",
                url: "northwindanalytics.io/pricing",
                agent: "product",
            },
            {
                id: "src-northwind-sales-notes",
                name: "Sales call notes — Meridian Corp",
                type: "Internal note",
                date: "2026-06-21",
                snippet:
                    "Prospect mentioned the Northwind rep offered the forecasting module 'thrown in' to close this quarter.",
                url: "internal/notes/meridian-corp",
                agent: "strategist",
            },
        ],
        confidenceNote:
            "High confidence — corroborated by a public pricing change and an independent sales conversation within the same week.",
    },
    "ev-opportunity-pulsemetrics": {
        id: "ev-opportunity-pulsemetrics",
        claim: "PulseMetrics' SMB tier is churning faster than usual following a pricing overhaul, opening a migration window.",
        sources: [
            {
                id: "src-pulsemetrics-g2",
                name: "G2 reviews — PulseMetrics",
                type: "Review",
                date: "2026-06-10",
                snippet:
                    "'Doubled our bill overnight with no warning. Looking at alternatives.' — 3 similar reviews in the last 30 days.",
                url: "g2.com/products/pulsemetrics/reviews",
                agent: "reviews",
            },
            {
                id: "src-pulsemetrics-churn",
                name: "Churn signal tracker",
                type: "Signal feed",
                date: "2026-06-24",
                snippet: "SMB-tier cancellation mentions up 3.4x month-over-month.",
                url: "internal/signals/pulsemetrics-churn",
                agent: "strategist",
            },
        ],
        confidenceNote:
            "Medium-high confidence — review sentiment and churn-signal volume agree, but neither confirms actual seat losses yet.",
    },
    "ev-vantage-support-slide": {
        id: "ev-vantage-support-slide",
        claim: "Vantage AI's support quality has declined since its recent layoffs, and its core alerting feature is the most-cited complaint.",
        sources: [
            {
                id: "src-vantage-forum",
                name: "Vantage support forum mining",
                type: "Forum",
                date: "2026-06-05",
                snippet:
                    "'Alert latency went from minutes to hours after the support team shrank.' — recurring theme across 12 threads.",
                url: "community.vantage.ai/support-latency",
                agent: "reviews",
            },
            {
                id: "src-vantage-jobs",
                name: "Job postings analysis",
                type: "Filing",
                date: "2026-05-29",
                snippet:
                    "Vantage AI support engineering headcount down ~30% per public job board history.",
                url: "vantage.ai/careers",
                agent: "news",
            },
        ],
        confidenceNote:
            "Medium confidence — headcount data is public and verifiable, but forum sentiment is self-reported and not independently audited.",
    },
    "ev-beacon-apac": {
        id: "ev-beacon-apac",
        claim: "Beacon Insights is quietly preparing an APAC market entry within the next two quarters.",
        sources: [
            {
                id: "src-beacon-funding",
                name: "Funding filings",
                type: "Filing",
                date: "2026-06-02",
                snippet:
                    "Series B extension earmarks 'international expansion, APAC' as a use-of-funds category.",
                url: "beaconinsights.co/investors",
                agent: "news",
            },
            {
                id: "src-beacon-hiring",
                name: "LinkedIn hiring trends",
                type: "Signal feed",
                date: "2026-06-15",
                snippet:
                    "Two 'APAC Country Manager' roles opened in the last month — the first regional hires outside HQ.",
                url: "linkedin.com/company/beacon-insights/jobs",
                agent: "strategist",
            },
        ],
        confidenceNote:
            "Lower confidence — early-stage signals only, no confirmed launch date or market.",
    },
};
