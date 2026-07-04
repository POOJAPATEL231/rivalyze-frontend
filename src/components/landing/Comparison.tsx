import { Container, Reveal, SectionHeading } from "./primitives";

const ROWS = [
    { label: "Evidence Attribution", trad: false, ai: false, rivalyze: true },
    { label: "Confidence Transparency", trad: false, ai: false, rivalyze: true },
    { label: "Strategic Recommendations", trad: true, ai: false, rivalyze: true },
    { label: "Live Intelligence Gathering", trad: false, ai: true, rivalyze: true },
    { label: "Source Validation", trad: true, ai: false, rivalyze: true },
    { label: "Boardroom Readiness", trad: true, ai: false, rivalyze: true },
];

function Mark({ ok }: { ok: boolean }) {
    return ok ? (
        <span className="text-chart-1">✓</span>
    ) : (
        <span className="text-muted-foreground/70">—</span>
    );
}

export default function Comparison() {
    return (
        <section className="bg-background py-28">
            <Container>
                <SectionHeading eyebrow="Why Argus" title="Built To Be Trusted, Not Just Used" />
                <Reveal delay={120}>
                    <div className="mt-14 overflow-x-auto rounded-xl border border-border">
                        <table className="w-full min-w-[560px] text-left text-sm">
                            <thead>
                                <tr className="bg-card text-muted-foreground">
                                    <th className="px-5 py-4 font-medium">Capability</th>
                                    <th className="px-5 py-4 font-medium">Traditional Research</th>
                                    <th className="px-5 py-4 font-medium">AI Search Tools</th>
                                    <th className="px-5 py-4 font-semibold text-foreground">
                                        Argus
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {ROWS.map((r) => (
                                    <tr key={r.label} className="border-t border-border">
                                        <td className="px-5 py-4 text-muted-foreground">
                                            {r.label}
                                        </td>
                                        <td className="px-5 py-4">
                                            <Mark ok={r.trad} />
                                        </td>
                                        <td className="px-5 py-4">
                                            <Mark ok={r.ai} />
                                        </td>
                                        <td className="border-l border-primary/30 bg-primary/5 px-5 py-4">
                                            <Mark ok={r.rivalyze} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Reveal>
            </Container>
        </section>
    );
}
