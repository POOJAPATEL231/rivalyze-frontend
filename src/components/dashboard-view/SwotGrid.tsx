import { SwotQuadrant } from "@/components/dashboard-view/SwotQuadrant";
import type { ApiSwot } from "@/types/api";

interface SwotGridProps {
    swot: ApiSwot;
}

export function SwotGrid({ swot }: SwotGridProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SwotQuadrant
                label="Strengths"
                textClassName="text-success"
                dotClassName="bg-success"
                items={swot.strengths}
            />
            <SwotQuadrant
                label="Weaknesses"
                textClassName="text-destructive"
                dotClassName="bg-destructive"
                items={swot.weaknesses}
            />
            <SwotQuadrant
                label="Opportunities"
                textClassName="text-watch"
                dotClassName="bg-watch"
                items={swot.opportunities}
            />
            <SwotQuadrant
                label="Threats"
                textClassName="text-primary"
                dotClassName="bg-primary"
                items={swot.threats}
            />
        </div>
    );
}
