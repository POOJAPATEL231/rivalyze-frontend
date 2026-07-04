import { useState } from "react";
import { Container, GlassCard, Reveal, SectionHeading } from "./primitives";

const CLAIMS = [
    {
        id: "pricing-shift",
        claim: "Notion is under-pricing its AI tier relative to Coda — a wedge opportunity in the SMB segment.",
        agent: "Research Agent",
        sources: [
            {
                name: "Notion Pricing Page",
                url: "notion.so/pricing",
                date: "Jun 28, 2026",
                snippet:
                    '"Notion AI" add-on remains $8/seat/mo, unchanged since Q1 while usage-based competitors raised list price 15%.',
            },
            {
                name: "Coda Blog",
                url: "coda.io/blog/pricing-update",
                date: "Jun 12, 2026",
                snippet:
                    "Coda AI credits repriced upward, effectively $11-14/seat/mo equivalent for comparable usage.",
            },
        ],
    },
    {
        id: "sentiment-drop",
        claim: "Negative sentiment around onboarding complexity is rising month-over-month.",
        agent: "Sentiment Agent",
        sources: [
            {
                name: "G2 Reviews",
                url: "g2.com/products/notion/reviews",
                date: "Jul 1, 2026",
                snippet:
                    '"Steep learning curve" mentioned in 22% of new reviews, up from 14% three months ago.',
            },
            {
                name: "r/SaaS",
                url: "reddit.com/r/saas",
                date: "Jun 30, 2026",
                snippet: "Recurring thread pattern: churn attributed to setup friction, not price.",
            },
        ],
    },
    {
        id: "headcount-signal",
        claim: "Engineering hiring is concentrated on AI/ML roles, signaling an agentic feature push.",
        agent: "Discovery Agent",
        sources: [
            {
                name: "LinkedIn Jobs",
                url: "linkedin.com/company/notion/jobs",
                date: "Jun 25, 2026",
                snippet:
                    '11 of 14 open engineering roles reference "LLM", "agents", or "retrieval" in the description.',
            },
        ],
    },
];

export default function Differentiator() {
    const [activeId, setActiveId] = useState(CLAIMS[0].id);
    const active = CLAIMS.find((c) => c.id === activeId)!;

    return (
        <section id="evidence" className="bg-background py-28">
            <Container>
                <SectionHeading
                    eyebrow="Transparency"
                    title="Don't Trust The AI. Audit It."
                    subtitle="Every claim is inspectable. Every recommendation is traceable."
                />

                <Reveal delay={120}>
                    <div className="mt-14 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                        <div className="space-y-3">
                            {CLAIMS.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setActiveId(c.id)}
                                    className={`w-full rounded-xl border p-5 text-left transition-colors ${activeId === c.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-inkFaint"}`}
                                >
                                    <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/70">
                                        {c.agent}
                                    </div>
                                    <p className="mt-2 text-sm text-foreground">{c.claim}</p>
                                </button>
                            ))}
                        </div>

                        <GlassCard key={activeId} className="reveal in-view">
                            <div className="flex items-center justify-between border-b border-border pb-4">
                                <span className="font-mono text-xs uppercase tracking-widest text-chart-1">
                                    Evidence Drawer
                                </span>
                                <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                                    {active.sources.length} sources
                                </span>
                            </div>
                            <div className="mt-4 space-y-4">
                                {active.sources.map((s) => (
                                    <div
                                        key={s.url}
                                        className="rounded-lg border border-border bg-muted p-4"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="text-sm font-medium text-foreground">
                                                {s.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground/70">
                                                {s.date}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            "{s.snippet}"
                                        </p>
                                        <div className="mt-2 font-mono text-xs text-primary">
                                            {s.url}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 rounded-lg border border-border bg-muted p-4">
                                <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground/70">
                                    Confidence formula
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    Source Quality + Source Agreement + Agent Consensus + Evidence
                                    Coverage
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </Reveal>
            </Container>
        </section>
    );
}
