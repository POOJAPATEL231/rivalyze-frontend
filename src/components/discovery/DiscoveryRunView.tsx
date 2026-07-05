import {
    Compass,
    Loader2,
    type LucideIcon,
    MessageSquareQuote,
    Newspaper,
    Package,
    Sparkles,
    TriangleAlert,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import { CompetitorList } from "@/components/discovery/CompetitorList";
import { CompetitorRadar } from "@/components/discovery/CompetitorRadar";
import { AgentLane } from "@/components/run/AgentLane";
import { AgentLedger } from "@/components/run/AgentLedger";
import { TelemetryBar } from "@/components/run/TelemetryBar";
import { Button } from "@/components/ui/button";
import { useAnalysisRun } from "@/hooks/useAnalysisRun";
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

/** Discovery and Live Run share one continuous backend poll (see
 * useAnalysisRun), but read as two distinct steps: competitor confirmation
 * first, then per-agent progress — matching the pre-merge two-screen flow. */
export function DiscoveryRunView() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const manual = Boolean((location.state as { manual?: boolean } | null)?.manual);
    const jobId = useAppSelector((state) => state.analysis.jobId);
    const competitors = useAppSelector((state) => state.analysis.competitors);
    const companyName = useAppSelector((state) => state.analysis.companyName);
    const runEvents = useAppSelector((state) => state.analysis.runEvents);
    const laneStatuses = useAppSelector((state) => state.analysis.laneStatuses);
    const { phase, error, confirm } = useAnalysisRun(jobId, { manual });

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

    const isLiveRun = phase === "analyzing" || phase === "done";

    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
            <div>
                <h1 className="font-heading text-3xl font-semibold text-foreground">
                    {isLiveRun ? "Five agents are on it" : "Here’s who you’re up against"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {isLiveRun
                        ? "Sit tight while News, Product, Reviews, and the Strategist work the competitive set in parallel."
                        : "We mapped your competitive set from public signals. Remove anything that doesn’t belong before the agents start digging."}
                </p>
            </div>

            {error && (
                <div className="flex items-start gap-2 rounded-lg border border-dashed border-destructive/60 bg-destructive/10 p-3 text-xs text-destructive">
                    <TriangleAlert className="size-4 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {phase === "discovering" && (
                <div className="flex flex-col items-center gap-4 py-8">
                    <CompetitorRadar competitors={[]} companyLabel={companyName || "Your idea"} />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        Mapping your competitive set…
                    </div>
                </div>
            )}

            {(phase === "awaiting_confirmation" || phase === "confirming") && (
                <div className="grid grid-cols-1 gap-8 min-[960px]:grid-cols-[55fr_45fr] min-[960px]:items-center">
                    <CompetitorRadar
                        competitors={competitors}
                        companyLabel={companyName || "Your idea"}
                    />
                    <CompetitorList onDeploy={confirm} isDeploying={phase === "confirming"} />
                </div>
            )}

            {isLiveRun && (
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
                            disabled={phase !== "done"}
                            onClick={handleOpenDashboard}
                            className="bg-iris text-background hover:opacity-90"
                        >
                            Open the dashboard
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
