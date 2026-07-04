import { Container, GlassCard, Reveal, SectionHeading } from "./primitives";

const FEATURES = [
    {
        title: "Competitor Discovery",
        desc: "Automatically surfaces direct and indirect competitors from live market signals.",
    },
    {
        title: "Live Agent Monitoring",
        desc: "Watch each agent work in real time — status, sources pulled, evidence collected.",
    },
    {
        title: "Executive Dashboard",
        desc: "Threat level, SWOT, and recommendations in one boardroom-ready view.",
    },
    {
        title: "Evidence Explorer",
        desc: "Drill into any claim to its source, date, and the agent that found it.",
    },
    {
        title: "Strategic Recommendations",
        desc: "Ranked actions with rationale, confidence, and supporting evidence.",
    },
    {
        title: "Instant Recall & History",
        desc: "Every past run saved and searchable — track how the competitive picture shifts.",
    },
];

export default function Features() {
    return (
        <section className="bg-background py-28">
            <Container>
                <SectionHeading eyebrow="Platform" title="Everything Strategy Teams Need" />
                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((f, i) => (
                        <Reveal key={f.title} delay={(i % 3) * 100}>
                            <GlassCard className="h-full">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 font-mono text-sm text-primary">
                                    {i + 1}
                                </div>
                                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                                    {f.title}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                            </GlassCard>
                        </Reveal>
                    ))}
                </div>
            </Container>
        </section>
    );
}
