export interface QAEntry {
    pattern: RegExp;
    answer: string;
    evidenceIds?: string[];
}

/** Keyword-matched Q&A for the Workspace chat — regex in, canned answer out.
 * No LLM here; this is the hackathon's stand-in for real grounded chat. */
export const QA_ENTRIES: QAEntry[] = [
    {
        pattern: /northwind.*(price|pricing|bundl)/i,
        answer: "Northwind bundled its forecasting module into the Enterprise tier at no extra cost — previously a $400/mo add-on.",
        evidenceIds: ["ev-threat-northwind"],
    },
    {
        pattern: /pulsemetrics.*(churn|pricing|smb)/i,
        answer: "PulseMetrics' pricing overhaul is driving SMB churn, opening a migration window for their smaller accounts.",
        evidenceIds: ["ev-opportunity-pulsemetrics"],
    },
    {
        pattern: /vantage.*(support|reliab|alert|complain)/i,
        answer: "Vantage AI's support quality has declined since its layoffs — alert latency is the most-cited complaint.",
        evidenceIds: ["ev-vantage-support-slide"],
    },
    {
        pattern: /beacon.*(apac|expansion|region)/i,
        answer: "Beacon Insights is quietly staffing up for an APAC market entry within the next two quarters.",
        evidenceIds: ["ev-beacon-apac"],
    },
    {
        pattern: /(threat|risk).*(level|biggest)/i,
        answer: "Current threat level is Elevated, driven mainly by Northwind's enterprise bundling move.",
    },
];
