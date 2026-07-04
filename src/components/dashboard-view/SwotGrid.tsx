import { SwotQuadrant } from "@/components/dashboard-view/SwotQuadrant";
import { useAppSelector } from "@/store/hooks";

export function SwotGrid() {
    const report = useAppSelector((state) => state.analysis.report);

    if (!report) return null;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SwotQuadrant
                label="Strengths"
                textClassName="text-success"
                dotClassName="bg-success"
                items={report.swot.strengths}
            />
            <SwotQuadrant
                label="Weaknesses"
                textClassName="text-destructive"
                dotClassName="bg-destructive"
                items={report.swot.weaknesses}
            />
            <SwotQuadrant
                label="Opportunities"
                textClassName="text-watch"
                dotClassName="bg-watch"
                items={report.swot.opportunities}
            />
            <SwotQuadrant
                label="Threats"
                textClassName="text-primary"
                dotClassName="bg-primary"
                items={report.swot.threats}
            />
        </div>
    );
}
