import { Check, Lock, LogOut, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout as logoutApi } from "@/services/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setStep } from "@/store/slices/analysisSlice";
import { logout } from "@/store/slices/authSlice";
import { toggleTheme } from "@/store/slices/uiSlice";
import type { AnalysisStep } from "@/types/analysis";

interface StepConfig {
    id: AnalysisStep;
    label: string;
    number: string;
    stretch?: boolean;
}

const WIZARD_STEPS: StepConfig[] = [
    { id: "brief", label: "Brief", number: "01" },
    { id: "discovery", label: "Discovery", number: "02" },
    { id: "run", label: "Live run", number: "03" },
    { id: "dashboard", label: "Dashboard", number: "04" },
    { id: "recommendations", label: "Recommendations", number: "05" },
];

const NAV_STEPS: StepConfig[] = [
    { id: "compare", label: "Compare", number: "06", stretch: true },
    { id: "workspace", label: "Workspace", number: "07", stretch: true },
    { id: "history", label: "History", number: "08" },
];

const STEPS = [...WIZARD_STEPS, ...NAV_STEPS];

/** Top step bar for the analysis wizard — replaces sidebar nav. Reads
 * currentStep/unlockedSteps from analysisSlice; locked steps aren't clickable.
 * The 5-phase wizard (brief→recommendations) renders as a connected rail —
 * numbered nodes joined by a fill line, the 2026-era "linear progress"
 * pattern — while compare/workspace/history stay pill tabs since they're
 * peer destinations, not sequential phases. */
export function StepBar() {
    const dispatch = useAppDispatch();
    const currentStep = useAppSelector((state) => state.analysis.currentStep);
    const unlockedSteps = useAppSelector((state) => state.analysis.unlockedSteps);
    const theme = useAppSelector((state) => state.ui.theme);
    const currentIndex = STEPS.findIndex((step) => step.id === currentStep);
    const refreshToken = useAppSelector((state) => state.auth.refreshToken);

    async function handleLogout() {
        if (refreshToken) {
            try {
                await logoutApi(refreshToken);
            } catch {
                // Best-effort — a network blip shouldn't trap the user in a
                // logged-in UI state, the local session clears regardless.
            }
        }
        dispatch(logout());
    }

    return (
        <nav
            aria-label="Analysis progress"
            className="glass sticky top-0 z-50 flex shrink-0 items-center gap-5 overflow-x-auto px-6 py-3"
        >
            <a
                href="/"
                className="flex shrink-0 items-center gap-2 font-heading text-lg font-semibold tracking-tight text-foreground"
            >
                <img
                    src="/brand/argus-icon.png"
                    alt=""
                    className="h-8 w-8 rounded-md object-cover"
                />
                Argus
            </a>

            <ol className="flex shrink-0 items-center">
                {WIZARD_STEPS.map((step, index) => {
                    const isActive = step.id === currentStep;
                    const isUnlocked = unlockedSteps.includes(step.id);
                    const isDone = isUnlocked && index < currentIndex;

                    return (
                        <li key={step.id} className="flex items-center">
                            {index > 0 && (
                                <div
                                    aria-hidden
                                    className={cn(
                                        "h-px w-6 shrink-0 transition-colors duration-500 sm:w-10",
                                        index <= currentIndex ? "bg-primary" : "bg-border",
                                    )}
                                />
                            )}
                            <button
                                type="button"
                                disabled={!isUnlocked}
                                aria-current={isActive ? "step" : undefined}
                                onClick={() => dispatch(setStep(step.id))}
                                className="group flex items-center gap-2 rounded-full py-1 pr-2.5 pl-1 transition-colors disabled:cursor-not-allowed"
                            >
                                <span
                                    className={cn(
                                        "relative flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] tabular-nums transition-all duration-300",
                                        isActive &&
                                            "scale-110 border-primary bg-primary text-primary-foreground shadow-glow",
                                        !isActive &&
                                            isDone &&
                                            "border-success/40 bg-success/15 text-success",
                                        !isActive &&
                                            !isDone &&
                                            isUnlocked &&
                                            "border-border bg-card text-muted-foreground group-hover:border-primary/50 group-hover:text-foreground",
                                        !isUnlocked &&
                                            "border-border/60 bg-transparent text-muted-foreground/40",
                                    )}
                                >
                                    {isActive && (
                                        <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
                                    )}
                                    {isDone ? (
                                        <Check className="size-3.5" />
                                    ) : !isUnlocked ? (
                                        <Lock className="size-3" />
                                    ) : (
                                        step.number
                                    )}
                                </span>
                                <span
                                    className={cn(
                                        "hidden font-heading text-sm font-medium whitespace-nowrap sm:inline",
                                        isActive
                                            ? "text-foreground"
                                            : isUnlocked
                                              ? "text-muted-foreground group-hover:text-foreground"
                                              : "text-muted-foreground/40",
                                    )}
                                >
                                    {step.label}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ol>

            <div aria-hidden className="h-6 w-px shrink-0 bg-border" />

            <div className="flex items-center gap-1 overflow-x-auto">
                {NAV_STEPS.map((step, i) => {
                    const index = WIZARD_STEPS.length + i;
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
                                "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-heading text-sm font-medium whitespace-nowrap transition-colors",
                                isActive && "bg-primary text-primary-foreground",
                                !isActive && isDone && "text-success hover:bg-muted",
                                !isActive &&
                                    !isDone &&
                                    isUnlocked &&
                                    "text-foreground hover:bg-muted",
                                !isUnlocked && "cursor-not-allowed text-muted-foreground/50",
                            )}
                        >
                            <span
                                className={cn(
                                    "inline-flex size-3.5 items-center justify-center font-mono text-[10px] tabular-nums",
                                    isActive
                                        ? "text-primary-foreground/70"
                                        : "text-muted-foreground",
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
            </div>

            <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle theme"
                onClick={() => dispatch(toggleTheme())}
                className="ml-auto shrink-0"
            >
                {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>

            <Button
                variant="ghost"
                size="icon"
                aria-label="Log out"
                title="Log out"
                onClick={handleLogout}
                className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
            >
                <LogOut className="size-5" />
            </Button>
        </nav>
    );
}
