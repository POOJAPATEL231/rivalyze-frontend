import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openEvidence } from "@/store/slices/analysisSlice";

export function OpportunitiesPanel() {
    const dispatch = useAppDispatch();
    const report = useAppSelector((state) => state.analysis.report);

    if (!report) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ol className="space-y-3">
                    {report.opportunities.map((opportunity, index) => (
                        <li key={opportunity.lead} className="flex gap-3">
                            <span className="font-mono text-sm text-muted-foreground">
                                {(index + 1).toString().padStart(2, "0")}
                            </span>
                            <div className="space-y-1.5">
                                <p className="text-sm">
                                    <span className="font-semibold text-foreground">
                                        {opportunity.lead}.
                                    </span>{" "}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            dispatch(openEvidence(opportunity.evidenceId))
                                        }
                                        className="text-left text-muted-foreground hover:text-foreground hover:underline"
                                    >
                                        {opportunity.claim}
                                    </button>
                                </p>
                                <EvidenceChip evidenceId={opportunity.evidenceId} />
                            </div>
                        </li>
                    ))}
                </ol>
                <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
                    {report.sourceCategories.map((category) => (
                        <Badge key={category} variant="outline" className="text-[10px]">
                            {category}
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
