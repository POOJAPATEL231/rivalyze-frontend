import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LaneStatus } from "@/types/analysis";

interface AgentLaneProps {
    icon: LucideIcon;
    name: string;
    subtitle: string;
    status: LaneStatus;
    iconClassName: string;
    barClassName: string;
}

const STATUS_CONFIG: Record<
    LaneStatus,
    {
        label: string;
        progress: number;
        badgeVariant: "outline" | "secondary" | "success";
    }
> = {
    queued: { label: "Queued", progress: 0, badgeVariant: "outline" },
    waiting: { label: "Waiting", progress: 0, badgeVariant: "outline" },
    running: { label: "Running", progress: 60, badgeVariant: "secondary" },
    done: { label: "Done", progress: 100, badgeVariant: "success" },
};

/** Lane row for one research agent. Visual states: default (queued/waiting),
 * running (teal glow ring), done (dimmed). */
export function AgentLane({
    icon: Icon,
    name,
    subtitle,
    status,
    iconClassName,
    barClassName,
}: AgentLaneProps) {
    const { label, progress, badgeVariant } = STATUS_CONFIG[status];
    const isRunning = status === "running";
    const isDone = status === "done";

    return (
        <Card className={cn(isRunning && "ring-2 ring-success/50", isDone && "opacity-60")}>
            <CardContent className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Icon className={cn("size-4", iconClassName)} />
                        <span className="font-heading text-sm font-medium text-foreground">
                            {name}
                        </span>
                    </div>
                    <Badge variant={badgeVariant} className="text-[10px]">
                        {label}
                    </Badge>
                </div>
                <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-700",
                            barClassName,
                        )}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
