import { cn } from "@/lib/utils";

interface ConfidenceMeterProps {
    value: number;
    label?: string;
    className?: string;
}

/** How sure the model is about a recommendation — distinct from ScoreBadge,
 * which classifies a competitor as threat/opportunity/watch. */
export function ConfidenceMeter({ value, label = "Confidence", className }: ConfidenceMeterProps) {
    return (
        <div className={cn("space-y-1.5", className)}>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{label}</span>
                <span className="font-mono font-medium text-foreground">{value}%</span>
            </div>
            <div
                role="meter"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={label}
                className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
            >
                <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}
