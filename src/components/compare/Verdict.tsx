import type { Competitor } from "@/types/competitor";

interface VerdictProps {
    companyLabel: string;
    selected: Competitor[];
}

/** Violet-gradient-bordered summary box. There's no backend field for a
 * per-rival "counter-positioning angle" (that was mock-only data), so this
 * points to Recommendations — where the real, evidence-backed next steps
 * live — rather than fabricating rival-specific advice. */
export function Verdict({ companyLabel, selected }: VerdictProps) {
    return (
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/15 p-px">
            <div className="space-y-2 rounded-2xl bg-card p-5">
                <p className="font-heading text-sm font-semibold text-foreground">Verdict</p>
                {selected.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Select up to two rivals above to compare {companyLabel} against them.
                    </p>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Comparing {companyLabel} against{" "}
                        <span className="font-medium text-foreground">
                            {selected.map((competitor) => competitor.name).join(" and ")}
                        </span>{" "}
                        — see the recommendations for evidence-backed next steps against each rival.
                    </p>
                )}
            </div>
        </div>
    );
}
