import { ConfidenceRing, Container, Reveal, SectionHeading } from "./primitives";

const FORMULA = ["Source Quality", "Source Agreement", "Agent Consensus", "Evidence Coverage"];

export default function Confidence() {
    return (
        <section className="bg-muted py-28">
            <Container>
                <div className="grid items-center gap-14 lg:grid-cols-2">
                    <Reveal>
                        <div className="flex justify-center lg:justify-start">
                            <ConfidenceRing value={42} size={220} stroke={14} label="Confidence" />
                        </div>
                    </Reveal>

                    <div>
                        <SectionHeading
                            center={false}
                            eyebrow="Honesty by design"
                            title="Confidence You Can Verify."
                            subtitle="Most AI tools hide uncertainty. Argus shows it."
                        />
                        <Reveal delay={120}>
                            <div className="mt-8 flex flex-wrap gap-2">
                                {FORMULA.map((f, i) => (
                                    <span key={f} className="flex items-center gap-2">
                                        <span className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground">
                                            {f}
                                        </span>
                                        {i < FORMULA.length - 1 && (
                                            <span className="text-muted-foreground/70">+</span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </Reveal>
                        <Reveal delay={200}>
                            <p className="mt-6 max-w-md text-sm text-muted-foreground">
                                Model-generated confidence values are discarded. Only evidence-based
                                calculations are used.
                            </p>
                        </Reveal>
                    </div>
                </div>
            </Container>
        </section>
    );
}
