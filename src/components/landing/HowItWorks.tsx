import { Container, GlassCard, Reveal, SectionHeading } from "./primitives";

const EXAMPLES = ["Notion", "Figma", "AI Contract Review for SMBs"];

const AGENTS = [
    { name: "Discovery Agent", task: "Mapping direct & indirect competitors", pct: 90 },
    { name: "Research Agent", task: "Pulling pricing, funding, product signals", pct: 72 },
    { name: "Sentiment Agent", task: "Scoring reviews & social mentions", pct: 58 },
    { name: "Validation Agent", task: "Cross-checking every source", pct: 44 },
    { name: "Strategy Agent", task: "Drafting recommendations", pct: 20 },
];

const OUTPUTS = [
    "SWOT",
    "Threat analysis",
    "Competitor comparison",
    "Strategic recommendations",
    "Confidence scoring",
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="bg-muted py-28">
            <Container>
                <SectionHeading
                    eyebrow="How it works"
                    title="From Question To Strategy In Minutes"
                />

                <div className="mt-16 space-y-16">
                    <Step n={1} title="Enter a company or startup idea.">
                        <div className="flex flex-wrap gap-3">
                            {EXAMPLES.map((e) => (
                                <span
                                    key={e}
                                    className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground"
                                >
                                    {e}
                                </span>
                            ))}
                        </div>
                    </Step>

                    <Step n={2} title="Watch 5 AI agents work simultaneously.">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            {AGENTS.map((a, i) => (
                                <Reveal key={a.name} delay={i * 80}>
                                    <GlassCard className="h-full">
                                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-chart-1">
                                            <span className="h-1.5 w-1.5 rounded-full bg-chart-1 live-dot" />{" "}
                                            Active
                                        </div>
                                        <div className="mt-3 font-display text-sm font-semibold text-foreground">
                                            {a.name}
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {a.task}
                                        </p>
                                        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-secondary">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-primary to-chart-1"
                                                style={{ width: `${a.pct}%` }}
                                            />
                                        </div>
                                        <div className="mt-1 text-right font-mono text-[10px] text-muted-foreground/70">
                                            {a.pct}%
                                        </div>
                                    </GlassCard>
                                </Reveal>
                            ))}
                        </div>
                    </Step>

                    <Step n={3} title="Receive a strategic brief.">
                        <div className="flex flex-wrap gap-3">
                            {OUTPUTS.map((o) => (
                                <span
                                    key={o}
                                    className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-foreground"
                                >
                                    {o}
                                </span>
                            ))}
                        </div>
                    </Step>
                </div>
            </Container>
        </section>
    );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
    return (
        <Reveal>
            <div className="flex items-start gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-display text-sm font-semibold text-primary">
                    {n}
                </div>
                <div className="w-full">
                    <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
                    <div className="mt-5">{children}</div>
                </div>
            </div>
        </Reveal>
    );
}
