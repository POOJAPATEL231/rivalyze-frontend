import type { RunScriptEntry } from "@/types/analysis";

export const RUN_SCRIPT: RunScriptEntry[] = [
    {
        delayMs: 0,
        agent: "discovery",
        text: "Competitive set confirmed: Northwind Analytics, Vantage AI, PulseMetrics, Beacon Insights.",
    },
    {
        delayMs: 400,
        agent: "news",
        text: "Scanning press releases and funding filings…",
        telemetry: { searches: 1 },
    },
    {
        delayMs: 500,
        agent: "product",
        text: "Diffing pricing pages and changelogs…",
        telemetry: { searches: 2 },
    },
    {
        delayMs: 600,
        agent: "reviews",
        text: "Pulling reviews from G2, Capterra, and forums…",
        telemetry: { searches: 3, llmCalls: 1 },
    },
    {
        delayMs: 1600,
        agent: "news",
        text: "Found: Northwind bundled a forecasting module into Enterprise at no extra cost.",
        telemetry: { llmCalls: 2, searches: 4, signals: 1 },
    },
    {
        delayMs: 2400,
        agent: "product",
        text: "Vantage AI has shipped no major releases in 90 days — roadmap looks stalled.",
        telemetry: { llmCalls: 3, searches: 5, signals: 2 },
    },
    {
        delayMs: 3200,
        agent: "reviews",
        text: "PulseMetrics' G2 rating dropped 0.6 stars after a pricing overhaul.",
        telemetry: { llmCalls: 4, searches: 6, signals: 3 },
    },
    {
        delayMs: 4000,
        agent: "news",
        text: "Beacon Insights' Series B extension earmarks APAC expansion.",
        telemetry: { llmCalls: 5, searches: 7, signals: 4 },
    },
    {
        delayMs: 4800,
        agent: "reviews",
        text: "Vantage AI support forum: alert-latency complaints up sharply post-layoffs.",
        effects: ["low"],
        telemetry: { llmCalls: 6, searches: 8, signals: 5 },
    },
    {
        delayMs: 5600,
        agent: "product",
        text: "Pricing diff confirmed — Northwind's forecasting module is bundled, not upsold.",
        effects: ["doneP"],
        telemetry: { llmCalls: 7, searches: 9, signals: 6 },
    },
    {
        delayMs: 6400,
        agent: "news",
        text: "No new funding activity detected for PulseMetrics or Vantage this week.",
        effects: ["doneN"],
        telemetry: { llmCalls: 8, searches: 10, signals: 6 },
    },
    {
        delayMs: 7200,
        agent: "reviews",
        text: "Review sweep complete — 4 competitors, 46 reviews sampled.",
        effects: ["doneR"],
        telemetry: { llmCalls: 9, searches: 11, signals: 7 },
    },
    {
        delayMs: 7600,
        agent: "strategist",
        text: "Synthesizing findings across news, product, and review signals…",
        effects: ["startSyn"],
        telemetry: { llmCalls: 10, searches: 11, signals: 7 },
    },
    {
        delayMs: 9200,
        agent: "strategist",
        text: "Cross-checking each claim against its sources before drafting recommendations…",
        telemetry: { llmCalls: 11, searches: 11, signals: 7 },
    },
    {
        delayMs: 10800,
        agent: "strategist",
        text: "Report ready — 4 opportunities and 1 elevated threat identified.",
        effects: ["finish"],
        telemetry: { llmCalls: 12, searches: 11, signals: 7 },
    },
];
