import { ConfidenceRing } from "@/components/recommendations/ConfidenceRing";
import { Card, CardContent } from "@/components/ui/card";
import type { ApiRecommendation } from "@/types/api";

interface RecCardProps {
    recommendation: ApiRecommendation;
}

/** ponytail: evidence_ids are opaque backend ids with no content endpoint
 * yet, shown as a plain source count rather than wired to EvidenceChip
 * (which only resolves against the static mock evidence set). */
export function RecCard({ recommendation }: RecCardProps) {
    const evidenceCount = recommendation.evidence_ids.length;
    const confidencePercent = Math.round(recommendation.confidence * 100);

    return (
        <Card className="h-full">
            <CardContent className="flex h-full flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="font-heading text-sm font-semibold leading-snug text-foreground">
                        {recommendation.action}
                    </h3>
                    <ConfidenceRing value={confidencePercent} />
                </div>

                <p className="text-sm text-muted-foreground">{recommendation.rationale}</p>

                <p className="mt-auto border-t border-border pt-3 font-mono text-[11px] text-muted-foreground">
                    {evidenceCount} source{evidenceCount === 1 ? "" : "s"} · confidence{" "}
                    {confidencePercent}%
                </p>
            </CardContent>
        </Card>
    );
}
