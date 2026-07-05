import { BarChart } from "@/components/charts/BarChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import type { ApiSentimentEntry } from "@/types/api";

interface SentimentPanelProps {
    sentiment: Record<string, ApiSentimentEntry>;
}

const STATUS_COLOR = {
    POSITIVE: "var(--chart-3)",
    NEUTRAL: "var(--chart-5)",
    NEGATIVE: "var(--chart-1)",
} as const;

/** label is an LLM-generated field, not a strictly-enforced enum — fall back
 * to the same score thresholds the old plain-bar version used whenever it
 * doesn't match one of the three expected values. */
function sentimentColor(score: number, label: string): string {
    const known = STATUS_COLOR[label.toUpperCase() as keyof typeof STATUS_COLOR];
    if (known) return known;
    if (score >= 0.65) return STATUS_COLOR.POSITIVE;
    if (score >= 0.5) return STATUS_COLOR.NEUTRAL;
    return STATUS_COLOR.NEGATIVE;
}

const chartConfig = {
    score: { label: "Sentiment score" },
} satisfies ChartConfig;

export function SentimentPanel({ sentiment }: SentimentPanelProps) {
    const entries = Object.entries(sentiment);

    if (entries.length === 0) return null;

    const chartData = entries.map(([name, entry]) => ({
        name,
        score: Math.round(entry.score * 100),
        fill: sentimentColor(entry.score, entry.label),
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Rival sentiment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <BarChart
                    data={chartData}
                    config={chartConfig}
                    xKey="name"
                    series={["score"]}
                    colorKey="fill"
                    className="aspect-auto h-48 w-full"
                />

                <div className="flex flex-wrap items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <span
                            aria-hidden
                            className="size-2 rounded-full"
                            style={{ backgroundColor: STATUS_COLOR.POSITIVE }}
                        />
                        Positive (0.65+)
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span
                            aria-hidden
                            className="size-2 rounded-full"
                            style={{ backgroundColor: STATUS_COLOR.NEUTRAL }}
                        />
                        Neutral
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span
                            aria-hidden
                            className="size-2 rounded-full"
                            style={{ backgroundColor: STATUS_COLOR.NEGATIVE }}
                        />
                        Negative (under 0.50)
                    </span>
                    <span className="ml-auto">
                        Scores blend review ratings, forum sentiment, and recent complaint volume.
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
