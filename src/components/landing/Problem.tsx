import { Container, GlassCard, Reveal, SectionHeading } from "./primitives";

const CARDS = [
    {
        title: "Manual Research",
        bar: "bg-destructive",
        points: ["Days of analyst work", "Expensive", "Outdated before delivery"],
    },
    {
        title: "Black-Box AI",
        bar: "bg-chart-3",
        points: ["No evidence", "Hallucinated numbers", "Unverifiable conclusions"],
    },
    {
        title: "Information Overload",
        bar: "bg-primary",
        points: ["Too much data", "No strategic direction", "Hard to act on"],
    },
] as const;

export default function Problem() {
    return (
        <section className="bg-background py-28">
            <Container>
                <SectionHeading title="Most Competitive Research Is Broken." />
                <div className="mt-14 grid gap-6 md:grid-cols-3">
                    {CARDS.map((c, i) => (
                        <Reveal key={c.title} delay={i * 100}>
                            <GlassCard className="h-full">
                                <div className={`h-1 w-10 rounded-full ${c.bar}`} />
                                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                                    {c.title}
                                </h3>
                                <ul className="mt-4 space-y-2">
                                    {c.points.map((p) => (
                                        <li
                                            key={p}
                                            className="flex items-start gap-2 text-sm text-muted-foreground"
                                        >
                                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/70" />{" "}
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        </Reveal>
                    ))}
                </div>
                <Reveal delay={300}>
                    <p className="mx-auto mt-20 max-w-3xl text-center font-display text-2xl font-medium leading-snug text-foreground sm:text-3xl">
                        Leadership teams don't need more data.
                        <br />
                        <span className="text-gradient">They need defensible recommendations.</span>
                    </p>
                </Reveal>
            </Container>
        </section>
    );
}
