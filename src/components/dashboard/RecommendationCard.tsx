import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceMeter } from "@/components/dashboard/ConfidenceMeter";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationCardProps {
    recommendation: Recommendation;
    relatedName: string;
    relatedColor: string;
}

export function RecommendationCard({
    recommendation,
    relatedName,
    relatedColor,
}: RecommendationCardProps) {
    return (
        <Card>
            <CardContent className="flex h-full flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="capitalize">
                        {recommendation.type}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span
                            className="size-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: relatedColor }}
                            aria-hidden
                        />
                        {relatedName}
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="font-heading text-sm leading-snug font-semibold text-foreground">
                        {recommendation.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                </div>

                <ConfidenceMeter value={recommendation.confidence} className="mt-auto" />

                <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
                    {recommendation.sources.map((source) => (
                        <Badge
                            key={source}
                            variant="secondary"
                            className="font-mono text-[10px] font-normal"
                        >
                            {source}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
