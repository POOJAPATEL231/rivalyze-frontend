import { useEffect } from "react";

import { BriefView } from "@/components/brief/BriefView";
import { DiscoveryView } from "@/components/discovery/DiscoveryView";
import { EvidenceDrawer } from "@/components/evidence/EvidenceDrawer";
import { StepBar } from "@/components/layout/StepBar";
import { LiveRunView } from "@/components/run/LiveRunView";
import { useAppSelector } from "@/store/hooks";

const BUILT_STEPS = ["brief", "discovery", "run"];

export default function AnalysisFlow() {
    const step = useAppSelector((state) => state.analysis.currentStep);
    const theme = useAppSelector((state) => state.ui.theme);

    // AppShell isn't mounted for the wizard flow, so this page owns keeping
    // the <html> class in sync with theme state instead.
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, [theme]);

    return (
        <div className="flex min-h-svh flex-col">
            <StepBar />
            {step === "brief" && <BriefView />}
            {step === "discovery" && <DiscoveryView />}
            {step === "run" && <LiveRunView />}
            {!BUILT_STEPS.includes(step) && (
                <div className="flex flex-1 items-center justify-center py-24 text-sm text-muted-foreground">
                    This step isn't built yet — check back after the next phase ships.
                </div>
            )}
            <EvidenceDrawer />
        </div>
    );
}
