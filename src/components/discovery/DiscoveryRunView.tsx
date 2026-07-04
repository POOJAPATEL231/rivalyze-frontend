import { TriangleAlert } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

import { CompetitorList } from "@/components/discovery/CompetitorList";
import { CompetitorRadar } from "@/components/discovery/CompetitorRadar";
import { AgentLedger } from "@/components/run/AgentLedger";
import { TelemetryBar } from "@/components/run/TelemetryBar";
import { Button } from "@/components/ui/button";
import { useAnalysisRun } from "@/hooks/useAnalysisRun";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { unlockStep } from "@/store/slices/analysisSlice";

export function DiscoveryRunView() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const manual = Boolean((location.state as { manual?: boolean } | null)?.manual);
    const jobId = useAppSelector((state) => state.analysis.jobId);
    const competitors = useAppSelector((state) => state.analysis.competitors);
    const companyName = useAppSelector((state) => state.analysis.companyName);
    const { phase, error, confirm } = useAnalysisRun(jobId, { manual });

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
                    Sit tight while Discovery, News, Product, Reviews, and the Strategist work the
                    competitive set in parallel.
                </p>
            </div>

            <TelemetryBar />

            {error && (
                <div className="flex items-start gap-2 rounded-lg border border-dashed border-destructive/60 bg-destructive/10 p-3 text-xs text-destructive">
                    <TriangleAlert className="size-4 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {(phase === "awaiting_confirmation" || phase === "confirming") && (
                <div className="space-y-4">
                    <div>
                        <h2 className="font-heading text-2xl font-semibold text-foreground">
                            Here&rsquo;s who you&rsquo;re up against
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            We mapped your competitive set from public signals. Remove anything that
                            doesn&rsquo;t belong before the agents keep digging.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-8 min-[960px]:grid-cols-[55fr_45fr] min-[960px]:items-center">
                        <CompetitorRadar
                            competitors={competitors}
                            companyLabel={companyName || "Your idea"}
                        />
                        <CompetitorList onDeploy={confirm} isDeploying={phase === "confirming"} />
                    </div>
                </div>
            )}

            <div className="w-full">
                <AgentLedger />
            </div>

            {phase === "done" && (
                <div className="flex flex-wrap items-center justify-end gap-3">
                    <Button
                        size="lg"
                        onClick={handleOpenDashboard}
                        className="bg-iris text-background hover:opacity-90"
                    >
                        Open the dashboard
                    </Button>
                </div>
            )}
        </div>
    );
}
