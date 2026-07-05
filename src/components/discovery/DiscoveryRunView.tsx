import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router";

import { DiscoveryPanel } from "@/components/discovery/DiscoveryPanel";
import { RunPanel } from "@/components/run/RunPanel";
import { Button } from "@/components/ui/button";
import { useAnalysisRun } from "@/hooks/useAnalysisRun";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { unlockStep } from "@/store/slices/analysisSlice";

/** Discovery and Live Run share one continuous backend poll (see
 * useAnalysisRun), but read as two distinct steps: competitor confirmation
 * first, then per-agent progress — matching the pre-merge two-screen flow.
 * Rendering is split into DiscoveryPanel/RunPanel; this component only owns
 * the shared poll and hands each phase its slice of state. */
export function DiscoveryRunView() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const jobId = useAppSelector((state) => state.analysis.jobId);
    const competitors = useAppSelector((state) => state.analysis.competitors);
    const companyName = useAppSelector((state) => state.analysis.companyName);
    const runEvents = useAppSelector((state) => state.analysis.runEvents);
    const laneStatuses = useAppSelector((state) => state.analysis.laneStatuses);
    const { phase, error, confirm } = useAnalysisRun(jobId);

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

            {phase === "failed" && (
                <div className="flex justify-center py-4">
                    <Button
                        onClick={() => navigate("/brief")}
                        className="bg-iris text-background hover:opacity-90"
                    >
                        Try again
                    </Button>
                </div>
            )}

            {(phase === "discovering" ||
                phase === "awaiting_confirmation" ||
                phase === "confirming") && (
                <DiscoveryPanel
                    phase={phase}
                    competitors={competitors}
                    companyName={companyName}
                    onConfirm={confirm}
                />
            )}

            {isLiveRun && (
                <RunPanel
                    isDone={phase === "done"}
                    runEvents={runEvents}
                    laneStatuses={laneStatuses}
                    onOpenDashboard={handleOpenDashboard}
                />
            )}
        </div>
    );
}
