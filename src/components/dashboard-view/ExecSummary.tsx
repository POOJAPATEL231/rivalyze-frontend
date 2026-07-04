import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import type { ApiReportResponse } from "@/types/api";

const THREAT_LEVEL_CONFIG: Record<string, { label: string; className: string }> = {
    LOW: { label: "Low", className: "text-success" },
    MEDIUM: { label: "Medium", className: "text-watch" },
    MODERATE: { label: "Moderate", className: "text-watch" },
    ELEVATED: { label: "Elevated", className: "text-watch" },
    HIGH: { label: "High", className: "text-destructive" },
    CRITICAL: { label: "Critical", className: "text-destructive" },
};

interface ExecSummaryProps {
    report: ApiReportResponse;
}

/** Wide banner: threat level + run metadata on the left, executive summary
 * on the right. Gradient border via a 1px iris-filled wrapper. */
export function ExecSummary({ report }: ExecSummaryProps) {
    const companyName = useAppSelector((state) => state.analysis.companyName);
    const competitors = useAppSelector((state) => state.analysis.competitors);
    const telemetry = useAppSelector((state) => state.analysis.telemetry);

    const level = THREAT_LEVEL_CONFIG[report.threat_level.toUpperCase()] ?? {
        label: report.threat_level,
        className: "text-foreground",
    };

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
                        {companyName || report.company || "Your idea"} · {competitors.length}{" "}
                        competitors tracked · {telemetry.elapsedSeconds}s run · {telemetry.llmCalls}{" "}
                        LLM calls
                    </p>
                </div>

                <div className="space-y-2">
                    <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                        Executive summary
                    </p>
                    <p className="text-sm text-foreground">{report.executive_summary}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                        Generated {report.analysis_date}
                    </p>
                </div>
            </div>
        </div>
    );
}
