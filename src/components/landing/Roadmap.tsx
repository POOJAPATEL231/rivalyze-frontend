import { Container, Reveal, SectionHeading } from "./primitives";

const STAGES = [
    { tag: "Today", title: "AI Competitive Intelligence", current: true },
    { tag: "Next", title: "Continuous Monitoring", current: false },
    { tag: "Then", title: "Team Workspaces", current: false },
    { tag: "Then", title: "Slack & CRM Integrations", current: false },
    { tag: "Then", title: "Advanced Intelligence Signals", current: false },
];

export default function Roadmap() {
    return (
        <section id="roadmap" className="bg-background py-28">
            <Container>
                <SectionHeading eyebrow="Roadmap" title="Where We're Headed" />
                <div className="relative mt-16">
                    <div className="absolute left-4 top-2 hidden h-[calc(100%-1rem)] w-px bg-border md:block" />
                    <div className="grid gap-8 md:grid-cols-5 md:gap-6">
                        {STAGES.map((s, i) => (
                            <Reveal key={s.title} delay={i * 100}>
                                <div className="relative flex gap-4 md:block md:pl-0">
                                    <div
                                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${s.current ? "border-primary bg-primary/20" : "border-border bg-card"}`}
                                    >
                                        <span
                                            className={`h-2 w-2 rounded-full ${s.current ? "bg-primary live-dot" : "bg-muted-foreground/70"}`}
                                        />
                                    </div>
                                    <div>
                                        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground/70">
                                            {s.tag}
                                        </div>
                                        <div className="mt-1 font-display text-sm font-semibold text-foreground">
                                            {s.title}
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}
