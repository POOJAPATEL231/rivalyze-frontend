import { SentimentRow } from "@/components/dashboard-view/SentimentRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";

export function SentimentPanel() {
    const report = useAppSelector((state) => state.analysis.report);
    const competitors = useAppSelector((state) => state.analysis.competitors);

    if (!report) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Rival sentiment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {competitors.map((competitor) => {
                    const entry = report.sentiment.find(
                        (sentiment) => sentiment.competitorId === competitor.id,
                    );
                    if (!entry) return null;
                    return (
                        <SentimentRow
                            key={competitor.id}
                            name={competitor.name}
                            score={entry.score}
                            label={entry.label}
                        />
                    );
                })}
                <p className="border-t border-border pt-3 text-xs text-muted-foreground">
                    Scores blend review ratings, forum sentiment, and recent complaint volume —
                    0.65+ reads positive, under 0.50 signals real friction.
                </p>
            </CardContent>
        </Card>
    );
}
