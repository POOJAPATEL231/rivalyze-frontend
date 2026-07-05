import {
    Compass,
    type LucideIcon,
    MessageSquareQuote,
    Newspaper,
    Package,
    Sparkles,
} from "lucide-react";

import { AgentLane } from "@/components/run/AgentLane";
import { AgentLedger } from "@/components/run/AgentLedger";
import { TelemetryBar } from "@/components/run/TelemetryBar";
import { Button } from "@/components/ui/button";
import type { LaneId, LaneStatus, RunEvent } from "@/types/analysis";

interface LaneConfig {
    id: LaneId;
    icon: LucideIcon;
    name: string;
    fallbackSubtitle: string;
    iconClassName: string;
    barClassName: string;
}

const LANES: LaneConfig[] = [
    {
        id: "discovery",
        icon: Compass,
        name: "Discovery",
        fallbackSubtitle: "Competitive set confirmed",
        iconClassName: "text-muted-foreground",
        barClassName: "bg-muted-foreground",
    },
    {
        id: "news",
        icon: Newspaper,
        name: "News",
        fallbackSubtitle: "Press, funding, and announcements",
        iconClassName: "text-success",
        barClassName: "bg-success",
    },
    {
        id: "product",
        icon: Package,
        name: "Product",
        fallbackSubtitle: "Pricing and changelog diffs",
        iconClassName: "text-primary",
        barClassName: "bg-primary",
    },
    {
        id: "reviews",
        icon: MessageSquareQuote,
        name: "Reviews",
        fallbackSubtitle: "G2, Capterra, and forum threads",
        iconClassName: "text-destructive",
        barClassName: "bg-destructive",
    },
    {
        id: "strategist",
        icon: Sparkles,
        name: "Strategist",
        fallbackSubtitle: "Synthesizing the report",
        iconClassName: "text-chart-4",
        barClassName: "bg-chart-4",
    },
];

interface RunPanelProps {
    isDone: boolean;
    runEvents: RunEvent[];
    laneStatuses: Record<LaneId, LaneStatus>;
    onOpenDashboard: () => void;
}

/** Live-run phase: per-agent lanes, ledger, and the dashboard hand-off once done. */
export function RunPanel({ isDone, runEvents, laneStatuses, onOpenDashboard }: RunPanelProps) {
    function latestTextFor(lane: LaneId, fallback: string) {
        for (let i = runEvents.length - 1; i >= 0; i--) {
            if (runEvents[i].agent === lane) return runEvents[i].text;
        }
        return fallback;
    }

    return (
        <>
            <TelemetryBar />

            <div className="grid grid-cols-1 gap-6 min-[960px]:grid-cols-[55fr_45fr]">
                <div className="space-y-3">
                    {LANES.map((lane) => (
                        <AgentLane
                            key={lane.id}
                            icon={lane.icon}
                            name={lane.name}
                            subtitle={latestTextFor(lane.id, lane.fallbackSubtitle)}
                            status={laneStatuses[lane.id]}
                            iconClassName={lane.iconClassName}
                            barClassName={lane.barClassName}
                        />
                    ))}
                </div>

                <AgentLedger />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
                <Button
                    size="lg"
                    disabled={!isDone}
                    onClick={onOpenDashboard}
                    className="bg-iris text-background hover:opacity-90"
                >
                    Open the dashboard
                </Button>
            </div>
        </>
    );
}
