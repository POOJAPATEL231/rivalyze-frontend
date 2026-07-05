import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScoreBadge } from "@/components/dashboard/ScoreBadge";
import type { Competitor } from "@/types/competitor";

interface CompetitorCardProps {
    competitor: Competitor;
    color: string;
}

export function CompetitorCard({ competitor, color }: CompetitorCardProps) {
    const isGrowing = competitor.growthRate >= 0;
    const score =
        competitor.status === "opportunity" ? competitor.opportunityScore : competitor.threatScore;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                        aria-hidden
                    />
                    <CardTitle>{competitor.name}</CardTitle>
                </div>
                <CardDescription>{competitor.category}</CardDescription>
                <CardAction>
                    <ScoreBadge status={competitor.status} score={score} />
                </CardAction>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{competitor.summary}</p>
                <div className="flex items-center justify-between border-t border-border pt-3 font-mono text-sm">
                    <div>
                        <div className="text-muted-foreground">Market share</div>
                        <div className="text-base font-medium text-foreground">
                            {competitor.marketShare}%
                        </div>
                    </div>
                    <div
                        className={
                            isGrowing
                                ? "flex items-center gap-1 text-success"
                                : "flex items-center gap-1 text-destructive"
                        }
                    >
                        {isGrowing ? (
                            <ArrowUpRight className="size-4" />
                        ) : (
                            <ArrowDownRight className="size-4" />
                        )}
                        {Math.abs(competitor.growthRate)}%
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
