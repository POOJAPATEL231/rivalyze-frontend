import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ApiHistoryEntry } from "@/types/api";

interface HistoryRowProps {
    entry: ApiHistoryEntry;
    onOpen: () => void;
    opening: boolean;
}

const THREAT_BADGE_CLASSNAME: Record<string, string> = {
    HIGH: "bg-watch/10 text-watch",
    MEDIUM: "bg-primary/10 text-primary",
    LOW: "bg-success/10 text-success",
};

export function HistoryRow({ entry, onOpen, opening }: HistoryRowProps) {
    const threatLevel = entry.threat_level?.toUpperCase() ?? null;

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4">
            <div className="space-y-1">
                <p className="font-heading text-sm font-medium text-foreground">{entry.company}</p>
                <p className="text-xs text-muted-foreground">
                    Run on {new Date(entry.created_at).toLocaleDateString()}
                </p>
            </div>
            <div className="flex items-center gap-3">
                {threatLevel && (
                    <Badge
                        variant="outline"
                        className={cn(
                            "border-transparent",
                            THREAT_BADGE_CLASSNAME[threatLevel] ?? "bg-muted text-muted-foreground",
                        )}
                    >
                        {threatLevel}
                    </Badge>
                )}
                <span className="font-mono text-xs text-muted-foreground">
                    {entry.confidence != null ? `${entry.confidence}% confidence` : "No score yet"}
                </span>
                <Button size="sm" onClick={onOpen} disabled={opening}>
                    {opening ? "Opening…" : "Open"}
                </Button>
            </div>
        </div>
    );
}
