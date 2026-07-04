import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiOpportunity } from "@/types/api";

interface OpportunitiesPanelProps {
    opportunities: ApiOpportunity[];
    lowSignalFindings: string[];
}

/** ponytail: evidence_ids/claim_ref are opaque backend ids with no content
 * endpoint yet — shown as a plain source count, not wired to EvidenceDrawer
 * (which only knows the static mock evidence set). Wire up once the backend
 * exposes evidence content by id. */
export function OpportunitiesPanel({ opportunities, lowSignalFindings }: OpportunitiesPanelProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ol className="space-y-3">
                    {opportunities.map((opportunity, index) => (
                        <li key={opportunity.claim_ref || index} className="flex gap-3">
                            <span className="font-mono text-sm text-muted-foreground">
                                {(index + 1).toString().padStart(2, "0")}
                            </span>
                            <div className="space-y-1.5">
                                <p className="text-sm text-muted-foreground">{opportunity.text}</p>
                                {opportunity.evidence_ids.length > 0 && (
                                    <span className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                                        {opportunity.evidence_ids.length} source
                                        {opportunity.evidence_ids.length === 1 ? "" : "s"}
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
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
