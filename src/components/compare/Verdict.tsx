import { YOUR_ANGLE } from "@/data/compareData";
import type { Competitor } from "@/types/competitor";

interface VerdictProps {
    companyLabel: string;
    selected: Competitor[];
}

/** Violet-gradient-bordered summary box — text changes with the selection. */
export function Verdict({ companyLabel, selected }: VerdictProps) {
    return (
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/15 p-px">
            <div className="space-y-2 rounded-2xl bg-card p-5">
                <p className="font-heading text-sm font-semibold text-foreground">Verdict</p>
                {selected.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Select up to two rivals above to see {companyLabel}&rsquo;s angle against
                        them.
                    </p>
                ) : (
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {selected.map((competitor) => (
                            <li key={competitor.id}>
                                <span className="font-medium text-foreground">
                                    {competitor.name}:
                                </span>{" "}
                                {YOUR_ANGLE[competitor.id] ?? "No counter-angle logged yet."}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
