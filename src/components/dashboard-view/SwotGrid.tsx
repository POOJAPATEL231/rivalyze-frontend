import { SwotQuadrant } from "@/components/dashboard-view/SwotQuadrant";
import type { ApiSwot } from "@/types/api";

interface SwotGridProps {
    swot: ApiSwot;
}

export function SwotGrid({ swot }: SwotGridProps) {
    const hasStrengths = swot.strengths && swot.strengths.length > 0;
    const hasWeaknesses = swot.weaknesses && swot.weaknesses.length > 0;
    const hasOpportunities = swot.opportunities && swot.opportunities.length > 0;
    const hasThreats = swot.threats && swot.threats.length > 0;

    const allEmpty = !hasStrengths && !hasWeaknesses && !hasOpportunities && !hasThreats;

    if (allEmpty) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg border-border bg-card text-center text-sm text-muted-foreground gap-1.5">
                <p className="font-semibold text-foreground font-heading">Issues with processing</p>
                <p>There was a problem generating the SWOT analysis. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {hasStrengths && (
                <SwotQuadrant
                    label="Strengths"
                    textClassName="text-success"
                    dotClassName="bg-success"
                    items={swot.strengths}
                />
            )}
            {hasWeaknesses && (
                <SwotQuadrant
                    label="Weaknesses"
                    textClassName="text-destructive"
                    dotClassName="bg-destructive"
                    items={swot.weaknesses}
                />
            )}
            {hasOpportunities && (
                <SwotQuadrant
                    label="Opportunities"
                    textClassName="text-watch"
                    dotClassName="bg-watch"
                    items={swot.opportunities}
                />
            )}
            {hasThreats && (
                <SwotQuadrant
                    label="Threats"
                    textClassName="text-primary"
                    dotClassName="bg-primary"
                    items={swot.threats}
                />
            )}
        </div>
    );
}
