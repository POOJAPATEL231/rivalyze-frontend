import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiReportStats } from "@/types/api";

interface StatsStripProps {
    stats: ApiReportStats | null;
}

const SOURCE_TYPE_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
];

const SENTIMENT_COLOR: Record<"POSITIVE" | "NEUTRAL" | "NEGATIVE", string> = {
    POSITIVE: "var(--chart-3)",
    NEUTRAL: "var(--chart-5)",
    NEGATIVE: "var(--chart-1)",
};

interface TileProps {
    value: string;
    label: string;
    hero?: boolean;
}

function Tile({ value, label, hero }: TileProps) {
    return (
        <div className="space-y-1">
            <p
                className={cn(
                    "font-mono text-2xl font-bold",
                    // ponytail: bg-clip-text gradient renders as a solid block in
                    // html2canvas (used for PDF export), swallowing the number — plain
                    // text-primary is the fix that survives both live view and export.
                    hero ? "text-primary" : "text-foreground",
                )}
            >
                {value}
            </p>
            <p className="text-xs text-muted-foreground uppercase">{label}</p>
        </div>
    );
}

/** {label: count} -> proportional horizontal bars, sharing one denominator. */
function CountBars({
    data,
    total,
    colorFor,
}: {
    data: Record<string, number>;
    total: number;
    colorFor: (key: string, index: number) => string;
}) {
    const entries = Object.entries(data);
    if (entries.length === 0 || total <= 0) return null;

    return (
        <div className="space-y-2">
            {entries.map(([key, count], index) => (
                <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="capitalize">{key}</span>
                        <span className="font-mono">{count}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${(count / total) * 100}%`,
                                backgroundColor: colorFor(key, index),
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

/** Deterministic "by the numbers" strip — every value is a real evidence
 * count, nothing estimated. `stats` is null on degraded runs and on
 * reports created before this field existed — render nothing then. */
export function StatsStrip({ stats }: StatsStripProps) {
    if (!stats) return null;

    const corroboration = stats.corroboration_rate == null ? null : `${stats.corroboration_rate}%`;
    const avgConfidence =
        stats.avg_confidence == null ? null : `${Math.round(stats.avg_confidence * 100)}%`;
    const freshness = stats.freshest_signal_days == null ? null : `${stats.freshest_signal_days}d`;

    return (
        <Card>
            <CardHeader>
                <CardTitle>By the numbers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    <Tile value={String(stats.evidence_count)} label="Evidence sources" />
                    <Tile value={String(stats.competitors_analyzed)} label="Competitors" />
                    {corroboration && (
                        <Tile value={corroboration} label="Corroborated (2+ sources)" hero />
                    )}
                    <Tile value={String(stats.distinct_sources)} label="Independent domains" />
                    {freshness && <Tile value={freshness} label="Newest evidence" />}
                    {avgConfidence && <Tile value={avgConfidence} label="Avg. confidence" />}
                </div>

                <div className="grid grid-cols-1 gap-6 border-t border-border pt-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                            Source mix
                        </p>
                        <CountBars
                            data={stats.source_type_breakdown}
                            total={stats.evidence_count}
                            colorFor={(_key, index) =>
                                SOURCE_TYPE_COLORS[index % SOURCE_TYPE_COLORS.length]
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                            Sentiment spread
                        </p>
                        <CountBars
                            data={stats.sentiment_spread}
                            total={
                                stats.sentiment_spread.POSITIVE +
                                stats.sentiment_spread.NEUTRAL +
                                stats.sentiment_spread.NEGATIVE
                            }
                            colorFor={(key) => SENTIMENT_COLOR[key as keyof typeof SENTIMENT_COLOR]}
                        />
                    </div>

                    <div className="space-y-2">
                        <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                            Sources per rival
                        </p>
                        <CountBars
                            data={stats.sources_per_competitor}
                            total={stats.evidence_count}
                            colorFor={() => "var(--chart-4)"}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
                    <span>
                        {stats.competitors_with_complaints} of {stats.competitors_analyzed} rivals
                        have complaints
                    </span>
                    {stats.uncorroborated_claims > 0 && (
                        <span className="text-watch">
                            {stats.uncorroborated_claims} finding
                            {stats.uncorroborated_claims === 1 ? "" : "s"} on a single source
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
