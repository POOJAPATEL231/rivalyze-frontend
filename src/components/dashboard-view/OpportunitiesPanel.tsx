import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiOpportunity } from "@/types/api";

interface OpportunitiesPanelProps {
    opportunities: ApiOpportunity[];
    lowSignalFindings: string[];
}

export function OpportunitiesPanel({ opportunities, lowSignalFindings }: OpportunitiesPanelProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ol className="space-y-3">
                    {opportunities.map((opportunity, index) => {
                        return (
                            <li key={opportunity.claim_ref ?? index} className="flex gap-3">
                                <span className="font-mono text-sm text-muted-foreground">
                                    {(index + 1).toString().padStart(2, "0")}
                                </span>
                                <div className="space-y-1.5">
                                    <p className="text-sm text-muted-foreground">
                                        {opportunity.text}
                                    </p>
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
