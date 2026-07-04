import type { Report } from "@/types/analysis";

/** Static portion of the mock report — generatedAt is stamped in at dispatch
 * time by useRunSimulation so it reflects when the demo run actually finished. */
export const MOCK_REPORT: Omit<Report, "generatedAt"> = {
    threatLevel: "elevated",
    topThreat: {
        text: "Northwind bundled its forecasting module into Enterprise at no extra cost, undercutting deals in flight.",
        evidenceId: "ev-threat-northwind",
    },
    biggestOpportunity: {
        text: "PulseMetrics' pricing overhaul is driving SMB churn — a live migration window.",
        evidenceId: "ev-opportunity-pulsemetrics",
    },
    recommendedAction: {
        text: "Ship a lightweight forecasting add-on within 30 days to neutralize Northwind's bundle before renewal season.",
        evidenceId: "ev-threat-northwind",
    },
    headToHead: {
        price: {
            you: { text: "$49/mo — flat per-seat" },
            rivals: {
                northwind: {
                    text: "$79/mo — now bundles forecasting",
                    badge: "new",
                    evidenceId: "ev-threat-northwind",
                },
                vantage: { text: "$59/mo" },
                pulsemetrics: {
                    text: "$39/mo — recently repriced",
                    badge: "new",
                    evidenceId: "ev-opportunity-pulsemetrics",
                },
                beacon: { text: "$65/mo" },
            },
        },
        aiPositioning: {
            you: {
                text: "Evidence-linked recommendations with confidence scoring",
            },
            rivals: {
                northwind: { text: "Enterprise-first predictive analytics" },
                vantage: { text: "Real-time alerting for competitive signals" },
                pulsemetrics: { text: "Sentiment tracking, not full competitive intel" },
                beacon: { text: "Static competitive reporting, no live monitoring" },
            },
        },
        recentMove: {
            you: { text: "Shipped a live evidence drawer for every claim" },
            rivals: {
                northwind: {
                    text: "Bundled forecasting into the Enterprise tier",
                    badge: "new",
                    evidenceId: "ev-threat-northwind",
                },
                vantage: { text: "Restructured support post-layoffs" },
                pulsemetrics: {
                    text: "Pricing overhaul triggered SMB churn",
                    evidenceId: "ev-opportunity-pulsemetrics",
                },
                beacon: {
                    text: "Hired its first APAC country manager",
                    badge: "new",
                    evidenceId: "ev-beacon-apac",
                },
            },
        },
        topComplaint: {
            you: { text: "Still building out historical trend depth" },
            rivals: {
                northwind: { text: "Price relative to smaller teams' budgets" },
                vantage: {
                    text: "Alert latency since the support cuts",
                    badge: "high-risk",
                    evidenceId: "ev-vantage-support-slide",
                },
                pulsemetrics: {
                    text: "Surprise billing changes",
                    badge: "high-risk",
                    evidenceId: "ev-opportunity-pulsemetrics",
                },
                beacon: { text: "No real-time signal detection" },
            },
        },
    },
    swot: {
        strengths: [
            "Fastest signal-to-report time in the category",
            "Every claim is evidence-linked, not just dashboarded",
            "Five specialist agents cover news, product, reviews, and strategy in parallel",
        ],
        weaknesses: [
            "Smaller install base than Northwind",
            "No enterprise SOC 2 certification yet",
            "Limited historical trend depth — under 6 months of data",
        ],
        opportunities: [
            "PulseMetrics' SMB churn is an open migration window",
            "Vantage's support-quality slide weakens their retention story",
            "Beacon has no real-time monitoring, only static reports",
        ],
        threats: [
            "Northwind's enterprise bundling could compress deal cycles",
            "A well-funded entrant could out-spend on data acquisition",
            "Buyers may default to incumbent BI tools instead of a dedicated CI product",
        ],
    },
    sentiment: [
        {
            competitorId: "northwind",
            score: 0.58,
            label: "Mixed — deep, but pricey",
        },
        {
            competitorId: "vantage",
            score: 0.44,
            label: "Negative — support complaints rising",
        },
        {
            competitorId: "pulsemetrics",
            score: 0.51,
            label: "Mixed — liked, until the repricing",
        },
        {
            competitorId: "beacon",
            score: 0.69,
            label: "Positive — reliable, if unexciting",
        },
    ],
    opportunities: [
        {
            lead: "Undercut the bundle",
            claim: "Turn Northwind's forecasting bundle into a talking point — match it with a lighter add-on, not a blanket price cut.",
            evidenceId: "ev-threat-northwind",
        },
        {
            lead: "Target churning SMBs",
            claim: "PulseMetrics' pricing overhaul has SMB accounts actively shopping — a timed migration offer converts well right now.",
            evidenceId: "ev-opportunity-pulsemetrics",
        },
        {
            lead: "Win on reliability",
            claim: "Vantage's post-layoff support decline is showing up in alert latency complaints — lead with responsiveness in competitive deals.",
            evidenceId: "ev-vantage-support-slide",
        },
        {
            lead: "Move first in APAC",
            claim: "Beacon is only just staffing up for APAC — there's a window to establish the category there before they land.",
            evidenceId: "ev-beacon-apac",
        },
    ],
    sourceCategories: ["Product pages", "Reviews", "Filings", "Forums", "Signal feeds"],
};
