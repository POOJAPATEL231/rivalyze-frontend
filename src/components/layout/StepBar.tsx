import { Check, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setStep } from "@/store/slices/analysisSlice";
import type { AnalysisStep } from "@/types/analysis";

interface StepConfig {
    id: AnalysisStep;
    label: string;
    number: string;
    stretch?: boolean;
}

const STEPS: StepConfig[] = [
    { id: "brief", label: "Brief", number: "01" },
    { id: "discovery", label: "Discovery", number: "02" },
    { id: "run", label: "Live run", number: "03" },
    { id: "dashboard", label: "Dashboard", number: "04" },
    { id: "recommendations", label: "Recommendations", number: "05" },
    { id: "compare", label: "Compare", number: "06", stretch: true },
    { id: "workspace", label: "Workspace", number: "07", stretch: true },
    { id: "history", label: "History", number: "08" },
];

/** Top step bar for the analysis wizard — replaces sidebar nav. Reads
 * currentStep/unlockedSteps from analysisSlice; locked steps aren't clickable. */
export function StepBar() {
    const dispatch = useAppDispatch();
    const currentStep = useAppSelector((state) => state.analysis.currentStep);
    const unlockedSteps = useAppSelector((state) => state.analysis.unlockedSteps);
    const currentIndex = STEPS.findIndex((step) => step.id === currentStep);

    return (
        <nav
            aria-label="Analysis progress"
            className="flex h-(--spacing-header) shrink-0 items-center gap-1 overflow-x-auto border-b border-border bg-background px-4"
        >
            {STEPS.map((step, index) => {
                const isActive = step.id === currentStep;
                const isUnlocked = unlockedSteps.includes(step.id);
                const isDone = isUnlocked && index < currentIndex;

                return (
                    <button
                        key={step.id}
                        type="button"
                        disabled={!isUnlocked}
                        aria-current={isActive ? "step" : undefined}
                        onClick={() => dispatch(setStep(step.id))}
                        className={cn(
                            "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-heading text-xs font-medium whitespace-nowrap transition-colors",
                            isActive && "bg-primary text-primary-foreground",
                            !isActive && isDone && "text-success hover:bg-muted",
                            !isActive && !isDone && isUnlocked && "text-foreground hover:bg-muted",
                            !isUnlocked && "cursor-not-allowed text-muted-foreground/50",
                        )}
                    >
                        <span
                            className={cn(
                                "inline-flex size-3.5 items-center justify-center font-mono text-[10px] tabular-nums",
                                isActive ? "text-primary-foreground/70" : "text-muted-foreground",
                            )}
                        >
                            {isDone ? (
                                <Check className="size-3" />
                            ) : !isUnlocked ? (
                                <Lock className="size-3" />
                            ) : (
                                step.number
                            )}
                        </span>
                        {step.label}
                        {step.stretch && (
                            <span
                                aria-label="Stretch goal"
                                className="ml-0.5 flex size-3.5 items-center justify-center rounded-full bg-watch text-[9px] font-bold text-watch-foreground"
                            >
                                S
                            </span>
                        )}
                    </button>
                );
            })}
        </nav>
    );
}
