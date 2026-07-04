import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openEvidence } from "@/store/slices/analysisSlice";
import type { Claim, ThreatLevel } from "@/types/analysis";

const THREAT_LEVEL_CONFIG: Record<ThreatLevel, { label: string; className: string }> = {
    low: { label: "Low", className: "text-success" },
    moderate: { label: "Moderate", className: "text-watch" },
    elevated: { label: "Elevated", className: "text-watch" },
    critical: { label: "Critical", className: "text-destructive" },
};

interface ExecSummaryRowProps {
    label: string;
    claim: Claim;
}

function ExecSummaryRow({ label, claim }: ExecSummaryRowProps) {
    const dispatch = useAppDispatch();

    return (
        <div className="flex flex-wrap items-start justify-between gap-3 border-t border-border py-3 first:border-t-0 first:pt-0">
            <div className="space-y-1">
                <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                    {label}
                </p>
                <button
                    type="button"
                    onClick={() => claim.evidenceId && dispatch(openEvidence(claim.evidenceId))}
                    className="text-left text-sm text-foreground hover:underline"
                >
                    {claim.text}
                </button>
            </div>
            {claim.evidenceId && <EvidenceChip evidenceId={claim.evidenceId} />}
        </div>
    );
}

/** Wide banner: threat level + run metadata on the left, sourced claim rows
 * on the right. Gradient border via a 1px iris-filled wrapper. */
export function ExecSummary() {
    const report = useAppSelector((state) => state.analysis.report);
    const companyName = useAppSelector((state) => state.analysis.companyName);
    const competitors = useAppSelector((state) => state.analysis.competitors);
    const telemetry = useAppSelector((state) => state.analysis.telemetry);

    if (!report) return null;

    const level = THREAT_LEVEL_CONFIG[report.threatLevel];

    return (
        <div className="rounded-2xl bg-iris p-px">
            <div className="grid grid-cols-1 gap-6 rounded-2xl bg-card p-6 md:grid-cols-[220px_1fr]">
                <div className="space-y-2 md:border-r md:border-border md:pr-6">
                    <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                        Threat level
                    </p>
                    <p className={cn("font-heading text-4xl font-bold", level.className)}>
                        {level.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {companyName || "Your idea"} · {competitors.length} competitors tracked ·{" "}
                        {telemetry.elapsedSeconds}s run · {telemetry.llmCalls} LLM calls
                    </p>
                </div>

                <div>
                    <ExecSummaryRow label="Top threat" claim={report.topThreat} />
                    <ExecSummaryRow label="Biggest opportunity" claim={report.biggestOpportunity} />
                    <ExecSummaryRow label="Recommended action" claim={report.recommendedAction} />
                </div>
            </div>
        </div>
    );
}
