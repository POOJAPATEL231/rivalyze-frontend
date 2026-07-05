import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch } from "@/store/hooks";
import { openEvidence } from "@/store/slices/analysisSlice";
import type { ApiOpportunity } from "@/types/api";

interface OpportunitiesPanelProps {
    opportunities: ApiOpportunity[];
    lowSignalFindings: string[];
}

export function OpportunitiesPanel({ opportunities, lowSignalFindings }: OpportunitiesPanelProps) {
    const dispatch = useAppDispatch();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ol className="space-y-3">
                    {opportunities.map((opportunity, index) => {
                        const evidenceCount = opportunity.evidence_ids?.length ?? 0;
                        const hasRef = !!opportunity.claim_ref;
                        return (
                            <li key={opportunity.claim_ref ?? index} className="flex gap-3">
                                <span className="font-mono text-sm text-muted-foreground">
                                    {(index + 1).toString().padStart(2, "0")}
                                </span>
                                <div className="space-y-1.5">
                                    <p className="text-sm text-muted-foreground">
                                        {opportunity.text}
                                    </p>
                                    {evidenceCount > 0 &&
                                        (hasRef ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    dispatch(openEvidence(opportunity.claim_ref!))
                                                }
                                                className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary hover:bg-primary/20 transition-colors"
                                                title="View evidence sources"
                                            >
                                                {evidenceCount} source
                                                {evidenceCount === 1 ? "" : "s"}
                                            </button>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                                                {evidenceCount} source
                                                {evidenceCount === 1 ? "" : "s"}
                                            </span>
                                        ))}
                                </div>
                            </li>
                        );
                    })}
                </ol>
                {lowSignalFindings.length > 0 && (
                    <div className="space-y-1.5 border-t border-border pt-3">
                        <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                            Low-signal findings
                        </p>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                            {lowSignalFindings.map((finding) => (
                                <li key={finding}>{finding}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
