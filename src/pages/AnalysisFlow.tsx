import { useEffect, type ComponentType, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

import { BriefView } from "@/components/brief/BriefView";
import { CompareView } from "@/components/compare/CompareView";
import { DashboardView } from "@/components/dashboard-view/DashboardView";
import { DiscoveryRunView } from "@/components/discovery/DiscoveryRunView";
import { EvidenceDrawer } from "@/components/evidence/EvidenceDrawer";
import { HistoryView } from "@/components/history/HistoryView";
import { StepBar } from "@/components/layout/StepBar";
import { RecommendationsView } from "@/components/recommendations/RecommendationsView";
import { WorkspaceView } from "@/components/workspace/WorkspaceView";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setStep } from "@/store/slices/analysisSlice";
import type { AnalysisStep } from "@/types/analysis";

// "discovery" and "run" both render the same merged screen — it owns the
// whole running_discovery -> completed lifecycle in one continuous view.
// Both entries stay mapped so a direct /run visit (stale link, back button)
// still resolves instead of blank-screening.
const VIEWS: Partial<Record<AnalysisStep, ComponentType>> = {
    brief: BriefView,
    discovery: DiscoveryRunView,
    run: DiscoveryRunView,
    dashboard: DashboardView,
    recommendations: RecommendationsView,
    compare: CompareView,
    workspace: WorkspaceView,
    history: HistoryView,
};

const VALID_STEPS = new Set(Object.keys(VIEWS) as AnalysisStep[]);

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
    const dispatch = useAppDispatch();
    const location = useLocation();
    const theme = useAppSelector((state) => state.ui.theme);
    const unlockedSteps = useAppSelector((state) => state.analysis.unlockedSteps);
    const currentStep = useAppSelector((state) => state.analysis.currentStep);

    // Derive step from URL path: "/brief" → "brief"
    const stepFromPath = location.pathname.slice(1) as AnalysisStep;
    const isValidStep = VALID_STEPS.has(stepFromPath);

    // Keep Redux currentStep in sync with URL whenever the path changes.
    useEffect(() => {
        if (isValidStep && stepFromPath !== currentStep) {
            dispatch(setStep(stepFromPath));
        }
    }, [stepFromPath, isValidStep, currentStep, dispatch]);

    // AppShell isn't mounted for the wizard flow, so this page owns keeping
    // the <html> class in sync with theme state instead.
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    // Guard: unrecognised path → brief
    if (!isValidStep) {
        return <Navigate to="/brief" replace />;
    }

    // Guard: locked step accessed directly via URL → brief
    if (!unlockedSteps.includes(stepFromPath)) {
        return <Navigate to="/brief" replace />;
    }

    const View = VIEWS[stepFromPath];

    return (
        <div className="flex min-h-svh flex-col">
            <StepBar />
            {View ? (
                <PageTransition key={stepFromPath}>
                    <View />
                </PageTransition>
            ) : (
                <div className="flex flex-1 items-center justify-center py-24 text-sm text-muted-foreground">
                    This step isn&apos;t built yet — check back after the next phase ships.
                </div>
            )}
            <EvidenceDrawer />
        </div>
    );
}
