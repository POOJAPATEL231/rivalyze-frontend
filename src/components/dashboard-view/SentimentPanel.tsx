import { SentimentRow } from "@/components/dashboard-view/SentimentRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiSentimentEntry } from "@/types/api";

interface SentimentPanelProps {
    sentiment: Record<string, ApiSentimentEntry>;
}

export function SentimentPanel({ sentiment }: SentimentPanelProps) {
    const entries = Object.entries(sentiment);

    if (entries.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Rival sentiment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {entries.map(([name, entry]) => (
                    <SentimentRow key={name} name={name} score={entry.score} label={entry.label} />
                ))}
                <p className="border-t border-border pt-3 text-xs text-muted-foreground">
                    Scores blend review ratings, forum sentiment, and recent complaint volume —
                    0.65+ reads positive, under 0.50 signals real friction.
                </p>
            </CardContent>
        </Card>
    );
}
