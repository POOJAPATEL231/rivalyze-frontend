import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HistoryEntry, HistoryThreatLevel } from "@/data/historyData";

interface HistoryRowProps {
    entry: HistoryEntry;
    onOpen: () => void;
}

const THREAT_BADGE_CLASSNAME: Record<HistoryThreatLevel, string> = {
    HIGH: "bg-watch/10 text-watch",
    MEDIUM: "bg-primary/10 text-primary",
    LOW: "bg-success/10 text-success",
};

export function HistoryRow({ entry, onOpen }: HistoryRowProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4">
            <div className="space-y-1">
                <p className="font-heading text-sm font-medium text-foreground">
                    {entry.companyName}
                </p>
                <p className="text-xs text-muted-foreground">Run on {entry.runDate}</p>
            </div>
            <div className="flex items-center gap-3">
                <Badge
                    variant="outline"
                    className={cn("border-transparent", THREAT_BADGE_CLASSNAME[entry.threatLevel])}
                >
                    {entry.threatLevel}
                </Badge>
                <span className="font-mono text-xs text-muted-foreground">
                    {entry.confidence}% confidence
                </span>
                {entry.openable ? (
                    <Button size="sm" onClick={onOpen}>
                        Open
                    </Button>
                ) : (
                    <Button size="sm" variant="outline" disabled>
                        Cached
                    </Button>
                )}
            </div>
        </div>
    );
}
