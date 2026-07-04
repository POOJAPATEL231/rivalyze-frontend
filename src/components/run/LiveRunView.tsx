import {
    Compass,
    type LucideIcon,
    MessageSquareQuote,
    Newspaper,
    Package,
    Sparkles,
} from "lucide-react";

import { AgentLane } from "@/components/run/AgentLane";
import { useNavigate } from "react-router";
import { AgentLedger } from "@/components/run/AgentLedger";
import { LowSignalWarning } from "@/components/run/LowSignalWarning";
import { TelemetryBar } from "@/components/run/TelemetryBar";
import { Button } from "@/components/ui/button";
import { useRunSimulation } from "@/hooks/useRunSimulation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { unlockStep } from "@/store/slices/analysisSlice";
import type { LaneId } from "@/types/analysis";

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

export function LiveRunView() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { skip, lowSignalDetected } = useRunSimulation();
    const runEvents = useAppSelector((state) => state.analysis.runEvents);
    const laneStatuses = useAppSelector((state) => state.analysis.laneStatuses);
    const runStatus = useAppSelector((state) => state.analysis.runStatus);

    function latestTextFor(lane: LaneId, fallback: string) {
        for (let i = runEvents.length - 1; i >= 0; i--) {
            if (runEvents[i].agent === lane) return runEvents[i].text;
        }
        return fallback;
    }

    function handleOpenDashboard() {
        dispatch(unlockStep("dashboard"));
        navigate("/dashboard");
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
            <div>
                <h1 className="font-heading text-3xl font-semibold text-foreground">
                    Five agents are on it
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Sit tight while News, Product, Reviews, and the Strategist work the competitive
                    set in parallel.
                </p>
            </div>

            <TelemetryBar />

            {lowSignalDetected && <LowSignalWarning />}

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
                <Button variant="outline" onClick={skip} disabled={runStatus === "done"}>
                    Skip animation
                </Button>
                <Button
                    size="lg"
                    disabled={runStatus !== "done"}
                    onClick={handleOpenDashboard}
                    className="bg-iris text-background hover:opacity-90"
                >
                    Open the dashboard
                </Button>
            </div>
        </div>
    );
}
