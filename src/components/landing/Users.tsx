import { Container, GlassCard, Reveal, SectionHeading } from "./primitives";

const USERS = [
    {
        role: "Founder",
        outcome: "Know exactly where to position before your next pitch or launch.",
    },
    {
        role: "Product Leader",
        outcome: "Prioritize roadmap bets backed by what competitors are actually shipping.",
    },
    {
        role: "Strategy Team",
        outcome: "Replace weeks of analyst work with a defensible brief in minutes.",
    },
    {
        role: "Investor",
        outcome: "Diligence a market faster with evidence you can independently verify.",
    },
];

export default function Users() {
    return (
        <section className="bg-muted py-28">
            <Container>
                <SectionHeading
                    eyebrow="Who it's for"
                    title="Built For Anyone Who Has To Be Right"
                />
                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {USERS.map((u, i) => (
                        <Reveal key={u.role} delay={i * 90}>
                            <GlassCard className="h-full">
                                <h3 className="font-display text-lg font-semibold text-foreground">
                                    {u.role}
                                </h3>
                                <p className="mt-3 text-sm text-muted-foreground">{u.outcome}</p>
                            </GlassCard>
                        </Reveal>
                    ))}
                </div>
            </Container>
        </section>
    );
}
