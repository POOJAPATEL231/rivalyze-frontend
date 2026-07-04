import { BarChart3, LayoutDashboard, Settings, Swords } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";

const NAV_ITEMS = [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "Competitors", icon: Swords, active: false },
    { label: "Reports", icon: BarChart3, active: false },
    { label: "Settings", icon: Settings, active: false },
];

const labelClass = (sidebarOpen: boolean) =>
    cn(
        // Opacity-only: a layout property (width/margin) animating on every one
        // of these labels at once, alongside the sidebar's own width transition,
        // is what caused the stutter — opacity is compositor-only, no reflow.
        "truncate whitespace-nowrap transition-opacity duration-150 ease-in-out",
        sidebarOpen ? "opacity-100 delay-150" : "opacity-0",
    );

export function Sidebar() {
    const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);

    return (
        <aside
            className={cn(
                "flex h-svh shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 ease-in-out will-change-[width]",
                sidebarOpen ? "w-(--spacing-sidebar)" : "w-(--spacing-sidebar-collapsed)",
            )}
        >
            <div className="flex h-(--spacing-header) items-center gap-2 px-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-sidebar-primary font-heading text-sm font-bold text-sidebar-primary-foreground">
                    R
                </span>
                <span
                    className={cn(
                        labelClass(sidebarOpen),
                        "font-heading text-sm font-semibold tracking-wide uppercase",
                    )}
                >
                    Rivalyze
                </span>
            </div>

            <nav className="flex flex-1 flex-col gap-1 p-2">
                {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
                    <button
                        key={label}
                        type="button"
                        className={cn(
                            "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                            active
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                        )}
                    >
                        <Icon className="size-4 shrink-0" />
                        <span className={labelClass(sidebarOpen)}>{label}</span>
                    </button>
                ))}
            </nav>

            <div
                className={cn(
                    labelClass(sidebarOpen),
                    "border-t border-sidebar-border p-3 text-xs text-muted-foreground",
                )}
            >
                War room boilerplate — static demo data.
            </div>
        </aside>
    );
}
