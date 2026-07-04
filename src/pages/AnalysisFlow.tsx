import type { ComponentType, ReactNode } from "react";

import { BriefView } from "@/components/brief/BriefView";
import { CompareView } from "@/components/compare/CompareView";
import { DashboardView } from "@/components/dashboard-view/DashboardView";
import { DiscoveryView } from "@/components/discovery/DiscoveryView";
import { EvidenceDrawer } from "@/components/evidence/EvidenceDrawer";
import { HistoryView } from "@/components/history/HistoryView";
import { StepBar } from "@/components/layout/StepBar";
import { RecommendationsView } from "@/components/recommendations/RecommendationsView";
import { LiveRunView } from "@/components/run/LiveRunView";
import { WorkspaceView } from "@/components/workspace/WorkspaceView";
import { useAppSelector } from "@/store/hooks";
import type { AnalysisStep } from "@/types/analysis";

const VIEWS: Partial<Record<AnalysisStep, ComponentType>> = {
    brief: BriefView,
    discovery: DiscoveryView,
    run: LiveRunView,
    dashboard: DashboardView,
    recommendations: RecommendationsView,
    compare: CompareView,
    workspace: WorkspaceView,
    history: HistoryView,
};

/** translateY(14px) + opacity:0 -> normal, 0.5s ease-out, matching the
 * prototype's "rise" keyframe. Keyed by step so every view remounts (and
 * re-animates) on navigation instead of reusing the previous view's node. */
function PageTransition({ children }: { children: ReactNode }) {
    return (
        <div className="animate-in fade-in-0 slide-in-from-bottom-[14px] duration-500 ease-out">
            {children}
        </div>
    );
}

export default function AnalysisFlow() {
    const step = useAppSelector((state) => state.analysis.currentStep);

    const View = VIEWS[step];

    return (
        <div className="flex min-h-svh flex-col">
            <StepBar />
            {View ? (
                <PageTransition key={step}>
                    <View />
                </PageTransition>
            ) : (
                <div className="flex flex-1 items-center justify-center py-24 text-sm text-muted-foreground">
                    This step isn't built yet — check back after the next phase ships.
                </div>
            )}
            <EvidenceDrawer />
        </div>
    );
}
