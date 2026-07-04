import { Container, Reveal } from "./primitives";

interface FinalCTAProps {
    onStartAnalysis: () => void;
}

export default function FinalCTA({ onStartAnalysis }: FinalCTAProps) {
    return (
        <section className="relative overflow-hidden bg-background py-32">
            <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-chart-1/20 blur-[120px]" />
            <Container>
                <Reveal className="relative text-center">
                    <h2 className="mx-auto max-w-3xl font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">
                        Perplexity Gives You Answers.
                        <br />
                        <span className="text-gradient">Argus Gives You Decisions.</span>
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
                        Turn competitive intelligence into strategic action.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={onStartAnalysis}
                            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-foreground shadow-[0_0_40px_-8px_rgba(142,124,247,.6)] transition-transform hover:-translate-y-0.5 hover:brightness-110"
                        >
                            Start Analysis
                        </button>
                        <a
                            href="#top"
                            className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-inkDim"
                        >
                            Schedule Demo
                        </a>
                    </div>
                </Reveal>
            </Container>
        </section>
    );
}
