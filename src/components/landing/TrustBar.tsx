import { Container, Reveal } from "./primitives";

const ITEMS = [
    "5 AI Agents",
    "7-Node Intelligence Pipeline",
    "Evidence-Based Recommendations",
    "Live Source Validation",
    "Deterministic Confidence Scoring",
];

export default function TrustBar() {
    return (
        <div className="relative border-y border-border bg-muted py-6">
            <Container>
                <Reveal>
                    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
                        {ITEMS.map((item) => (
                            <span
                                key={item}
                                className="text-sm font-mono uppercase tracking-wider text-muted-foreground/70"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </Reveal>
            </Container>
        </div>
    );
}
