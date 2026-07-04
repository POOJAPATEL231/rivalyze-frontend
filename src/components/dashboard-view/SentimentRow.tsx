import { cn } from "@/lib/utils";

interface SentimentRowProps {
    name: string;
    score: number;
    label: string;
}

function scoreBarClassName(score: number) {
    if (score >= 0.65) return "bg-success";
    if (score >= 0.5) return "bg-watch";
    return "bg-destructive";
}

export function SentimentRow({ name, score, label }: SentimentRowProps) {
    return (
        <div className="flex items-center gap-3">
            <span className="w-[86px] shrink-0 truncate text-sm text-foreground">{name}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                    className={cn("h-full rounded-full", scoreBarClassName(score))}
                    style={{ width: `${Math.round(score * 100)}%` }}
                />
            </div>
            <span className="w-32 shrink-0 text-right text-xs text-muted-foreground">{label}</span>
            <span className="w-10 shrink-0 text-right font-mono text-xs text-foreground">
                {score.toFixed(2)}
            </span>
        </div>
    );
}
