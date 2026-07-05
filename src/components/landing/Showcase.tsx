import { ConfidenceRing, Container, Reveal, SectionHeading } from "./primitives";

const SWOT: { label: string; tone: string; items: string[] }[] = [
    {
        label: "Strengths",
        tone: "text-chart-1",
        items: ["Strong brand recall", "Deep integration ecosystem"],
    },
    {
        label: "Weaknesses",
        tone: "text-destructive",
        items: ["Onboarding friction", "AI tier under-priced"],
    },
    {
        label: "Opportunities",
        tone: "text-primary",
        items: ["SMB AI wedge vs. Coda", "Enterprise workspace bundle"],
    },
    {
        label: "Threats",
        tone: "text-chart-3",
        items: ["Coda AI repricing", "New entrant velocity"],
    },
];

const H2H = [
    { metric: "Starting Price", you: "$8/seat", rival: "$12/seat" },
    { metric: "AI Features", you: "6 shipped", rival: "4 shipped" },
    { metric: "G2 Rating", you: "4.4", rival: "4.1" },
];

const SENTIMENT = [
    { name: "You", pct: 71, tone: "bg-chart-1" },
    { name: "Coda", pct: 58, tone: "bg-primary" },
    { name: "Airtable", pct: 63, tone: "bg-chart-3" },
];

export default function Showcase() {
    return (
        <section id="showcase" className="bg-muted py-28">
            <Container>
                <SectionHeading
                    eyebrow="Product"
                    title="A Boardroom-Ready Brief"
                    subtitle="Not a chat transcript. A structured, evidence-backed report."
                />

                <Reveal delay={140}>
                    <div className="glass mt-14 overflow-hidden rounded-xl">
                        <div className="flex items-center gap-2 border-b border-border bg-secondary/60 px-5 py-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                            <span className="h-2.5 w-2.5 rounded-full bg-chart-3/60" />
                            <span className="h-2.5 w-2.5 rounded-full bg-chart-1/60" />
                            <span className="ml-3 font-mono text-xs text-muted-foreground/70">
                                rivalyze.app/dash/notion
                            </span>
                            <span className="ml-auto rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                                Updated 3m ago
                            </span>
                        </div>

                        <div className="grid gap-6 p-6 lg:grid-cols-[1.3fr_.7fr] lg:p-8">
                            <div className="space-y-6">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground/70">
                                            Executive Summary
                                        </div>
                                        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                                            Notion holds a strong brand position but is exposed on
                                            AI pricing and onboarding friction; SMB AI positioning
                                            is the clearest near-term wedge.
                                        </p>
                                    </div>
                                    <span className="shrink-0 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                                        Threat: HIGH
                                    </span>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    <Tile
                                        label="Top Threat"
                                        value="Coda AI repricing"
                                        tone="text-destructive"
                                    />
                                    <Tile
                                        label="Biggest Opportunity"
                                        value="SMB AI wedge"
                                        tone="text-chart-1"
                                    />
                                    <Tile
                                        label="Recommended Action"
                                        value="Ship usage-based AI tier"
                                        tone="text-primary"
                                    />
                                </div>

                                <div>
                                    <div className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground/70">
                                        SWOT Analysis
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {SWOT.map((s) => (
                                            <div
                                                key={s.label}
                                                className="rounded-lg border border-border bg-muted p-4"
                                            >
                                                <div
                                                    className={`text-xs font-semibold uppercase tracking-wider ${s.tone}`}
                                                >
                                                    {s.label}
                                                </div>
                                                <ul className="mt-2 space-y-1">
                                                    {s.items.map((it) => (
                                                        <li
                                                            key={it}
                                                            className="text-xs text-muted-foreground"
                                                        >
                                                            {it}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground/70">
                                        Head-to-Head
                                    </div>
                                    <div className="overflow-hidden rounded-lg border border-border">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-muted text-muted-foreground/70">
                                                <tr>
                                                    <th className="px-4 py-2 font-medium">
                                                        Metric
                                                    </th>
                                                    <th className="px-4 py-2 font-medium">You</th>
                                                    <th className="px-4 py-2 font-medium">Coda</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {H2H.map((r) => (
                                                    <tr
                                                        key={r.metric}
                                                        className="border-t border-border"
                                                    >
                                                        <td className="px-4 py-2 text-muted-foreground">
                                                            {r.metric}
                                                        </td>
                                                        <td className="px-4 py-2 text-foreground">
                                                            {r.you}
                                                        </td>
                                                        <td className="px-4 py-2 text-muted-foreground">
                                                            {r.rival}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-center rounded-lg border border-border bg-muted p-6">
                                    <ConfidenceRing
                                        value={81}
                                        size={120}
                                        stroke={9}
                                        label="Confidence"
                                    />
                                </div>
                                <div className="rounded-lg border border-border bg-muted p-4">
                                    <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground/70">
                                        Sentiment
                                    </div>
                                    <div className="mt-3 space-y-3">
                                        {SENTIMENT.map((s) => (
                                            <div key={s.name}>
                                                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                                                    <span>{s.name}</span>
                                                    <span>{s.pct}%</span>
                                                </div>
                                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                                                    <div
                                                        className={`h-full rounded-full ${s.tone}`}
                                                        style={{ width: `${s.pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </Container>
        </section>
    );
}

function Tile({ label, value, tone }: { label: string; value: string; tone: string }) {
    return (
        <div className="rounded-lg border border-border bg-muted p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                {label}
            </div>
            <div className={`mt-2 text-sm font-semibold ${tone}`}>{value}</div>
        </div>
    );
}
