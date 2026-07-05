import { ShieldAlert, TrendingUp, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ScoreStatus } from "@/types/competitor";

const STATUS_CONFIG: Record<
    ScoreStatus,
    { label: string; variant: "destructive" | "success" | "watch"; icon: typeof ShieldAlert }
> = {
    threat: { label: "Threat", variant: "destructive", icon: ShieldAlert },
    opportunity: { label: "Opportunity", variant: "success", icon: TrendingUp },
    watch: { label: "Watch", variant: "watch", icon: Eye },
};

interface ScoreBadgeProps {
    status: ScoreStatus;
    score: number;
    className?: string;
}

/** Threat / opportunity / watch score indicator used across cards and tables. */
export function ScoreBadge({ status, score, className }: ScoreBadgeProps) {
    const { label, variant, icon: Icon } = STATUS_CONFIG[status];

    return (
        <Badge variant={variant} className={cn("font-mono", className)}>
            <Icon data-icon="inline-start" />
            {label}
            <span className="opacity-70">{score}</span>
        </Badge>
    );
}
