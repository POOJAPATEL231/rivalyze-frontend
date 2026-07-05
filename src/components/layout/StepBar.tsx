import { Check, HelpCircle, Lock, LogOut, Moon, Sun, MoreHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout as logoutApi } from "@/services/auth";
import { clearAllPersistedData } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
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
    { id: "run", label: "Run", number: "03" },
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
    const navigate = useNavigate();
    const currentStep = useAppSelector((state) => state.analysis.currentStep);
    const unlockedSteps = useAppSelector((state) => state.analysis.unlockedSteps);
    const runStatus = useAppSelector((state) => state.analysis.runStatus);
    const theme = useAppSelector((state) => state.ui.theme);
    // Discovery and Run share one URL for the live automatic flow (see
    // useAnalysisRun) — the rail still needs to show two nodes, so once
    // agents are deployed it displays "Run" as current instead of "Discovery"
    // without touching the actual route/currentStep.
    const displayStep = currentStep === "discovery" && runStatus !== "idle" ? "run" : currentStep;
    const currentIndex = STEPS.findIndex((step) => step.id === displayStep);
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
        // Wipe all persisted data (session, analysis cache, etc.) so the next
        // user who logs in starts completely fresh. Theme is intentionally kept
        // — clearAllPersistedData() preserves ui_state so the theme survives.
        clearAllPersistedData();
    }

    return (
        <nav
            aria-label="Analysis progress"
            className="bg-white sticky top-0 z-50 flex shrink-0 items-center gap-3 overflow-x-auto overflow-y-hidden px-4 py-3 min-[1430px]:gap-5 min-[1430px]:px-6 border-b border-b-gray-200"
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
                <span className="hidden sm:inline">Argus</span>
            </a>

            {/* Wizard rail — always visible. Labels hide below md, circles shrink below md */}
            <ol className="flex min-w-0 flex-1 items-center">
                {WIZARD_STEPS.map((step, index) => {
                    const isActive = step.id === displayStep;
                    const isUnlocked = unlockedSteps.includes(step.id);
                    const isDone = isUnlocked && index < currentIndex;

                    return (
                        <li key={step.id} className="flex items-center">
                            {index > 0 && (
                                <div
                                    aria-hidden
                                    className={cn(
                                        "h-px min-w-3 flex-1 transition-colors duration-500 min-[960px]:min-w-6 min-[1430px]:min-w-10",
                                        index <= currentIndex ? "bg-primary" : "bg-border",
                                    )}
                                />
                            )}
                            <button
                                type="button"
                                disabled={
                                    !isUnlocked ||
                                    ((step.id === "discovery" || step.id === "run") && isDone)
                                }
                                aria-current={isActive ? "step" : undefined}
                                aria-label={!isUnlocked ? `${step.label}, locked` : undefined}
                                onClick={() => navigate(`/${step.id}`, { state: { manual: true } })}
                                className="group flex items-center rounded-full py-1 pr-1 pl-1 transition-colors disabled:cursor-not-allowed min-[960px]:gap-2 min-[960px]:pr-2.5"
                            >
                                <span
                                    className={cn(
                                        "relative flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] tabular-nums transition-all duration-300 min-[960px]:size-7 min-[960px]:text-[11px]",
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
                                    {(step.label === "Discovery" || step.label === "Run") &&
                                    isUnlocked ? (
                                        <Lock className="size-2.5 min-[960px]:size-3 pointer-events-none" />
                                    ) : isDone ? (
                                        <Check className="size-3 min-[960px]:size-3.5" />
                                    ) : !isUnlocked ? (
                                        <Lock className="size-2.5 min-[960px]:size-3" />
                                    ) : (
                                        step.number
                                    )}
                                </span>
                                {/* Labels only show at md+ */}
                                <span
                                    className={cn(
                                        "hidden font-heading text-sm font-medium whitespace-nowrap min-[960px]:inline",
                                        isActive
                                            ? "text-foreground"
                                            : isUnlocked ||
                                                step.label === "Discovery" ||
                                                step.label === "Run"
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

            {/* Actions and dropdown items container */}
            <div className="ml-auto flex shrink-0 items-center gap-2">
                {/* NAV_STEPS dropdown — visible below xl */}
                <div className="flex shrink-0 items-center min-[1430px]:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 rounded-full font-heading text-sm text-muted-foreground hover:text-foreground"
                            >
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                            {NAV_STEPS.map((step, i) => {
                                const index = WIZARD_STEPS.length + i;
                                const isActive = step.id === displayStep;
                                const isUnlocked = unlockedSteps.includes(step.id);
                                const isDone = isUnlocked && index < currentIndex;
                                return (
                                    <DropdownMenuItem
                                        key={step.id}
                                        disabled={
                                            !isUnlocked ||
                                            ((step.id === "discovery" || step.id === "run") &&
                                                isDone)
                                        }
                                        aria-label={
                                            !isUnlocked ? `${step.label}, locked` : undefined
                                        }
                                        onClick={() => navigate(`/${step.id}`)}
                                        className={cn(
                                            "cursor-pointer font-heading text-sm flex items-center justify-between gap-3",
                                            isActive &&
                                                "bg-primary/10 font-semibold text-primary focus:bg-primary/10 focus:text-primary",
                                            !isActive &&
                                                isDone &&
                                                "text-success focus:text-success",
                                            !isUnlocked && "text-muted-foreground/50",
                                        )}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="w-3">
                                                {isDone ? (
                                                    <Check className="size-3" />
                                                ) : !isUnlocked ? (
                                                    <Lock className="size-3" />
                                                ) : null}
                                            </span>
                                            {step.label}
                                        </span>
                                        {step.stretch && (
                                            <span className="flex size-3.5 items-center justify-center rounded-full bg-watch text-[9px] font-bold text-watch-foreground">
                                                S
                                            </span>
                                        )}
                                    </DropdownMenuItem>
                                );
                            })}

                            {/* On small screens, also show Help and Logout inside the dropdown */}
                            <DropdownMenuItem
                                onClick={() => navigate("/guide")}
                                className="cursor-pointer font-heading text-sm sm:hidden"
                            >
                                <span className="flex items-center gap-2">
                                    <HelpCircle className="size-4" />
                                    User Guide
                                </span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer font-heading text-sm text-destructive focus:text-destructive sm:hidden"
                            >
                                <span className="flex items-center gap-2">
                                    <LogOut className="size-4" />
                                    Log Out
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div
                    aria-hidden
                    className="hidden h-6 w-px shrink-0 bg-border min-[1430px]:block"
                />

                <div className="hidden shrink-0 items-center gap-1 min-[1430px]:flex">
                    {NAV_STEPS.map((step, i) => {
                        const index = WIZARD_STEPS.length + i;
                        const isActive = step.id === displayStep;
                        const isUnlocked = unlockedSteps.includes(step.id);
                        const isDone = isUnlocked && index < currentIndex;

                        return (
                            <button
                                key={step.id}
                                type="button"
                                disabled={!isUnlocked}
                                aria-current={isActive ? "step" : undefined}
                                aria-label={!isUnlocked ? `${step.label}, locked` : undefined}
                                onClick={() => navigate(`/${step.id}`, { state: { manual: true } })}
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
                    aria-label="User guide"
                    title="User guide"
                    asChild
                    className="hidden sm:inline-flex shrink-0"
                >
                    <Link to="/guide">
                        <HelpCircle className="size-5" />
                    </Link>
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Toggle theme"
                    onClick={() => dispatch(toggleTheme())}
                    className="shrink-0"
                >
                    {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Log out"
                    title="Log out"
                    onClick={handleLogout}
                    className="hidden sm:inline-flex shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                >
                    <LogOut className="size-5" />
                </Button>
            </div>
        </nav>
    );
}
