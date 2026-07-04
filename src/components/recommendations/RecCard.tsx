import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { ConfidenceRing } from "@/components/recommendations/ConfidenceRing";
import { Card, CardContent } from "@/components/ui/card";
import type { Recommendation } from "@/types/recommendation";

interface RecCardProps {
    recommendation: Recommendation;
}

export function RecCard({ recommendation }: RecCardProps) {
    const evidenceIds = recommendation.evidenceIds ?? [];
    const agentCount = recommendation.agentCount ?? 1;

    return (
        <Card className="h-full">
            <CardContent className="flex h-full flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="font-heading text-sm font-semibold leading-snug text-foreground">
                        {recommendation.title}
                    </h3>
                    <ConfidenceRing value={recommendation.confidence} />
                </div>

                <p className="text-sm text-muted-foreground">{recommendation.description}</p>

                {evidenceIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {evidenceIds.map((evidenceId) => (
                            <EvidenceChip key={evidenceId} evidenceId={evidenceId} />
                        ))}
                    </div>
                )}

                <p className="mt-auto border-t border-border pt-3 font-mono text-[11px] text-muted-foreground">
                    {agentCount} agent{agentCount === 1 ? "" : "s"} · {evidenceIds.length} source
                    group{evidenceIds.length === 1 ? "" : "s"} · confidence{" "}
                    {recommendation.confidence}%
                </p>
            </CardContent>
        </Card>
    );
}
