import { Moon, PanelLeft, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar, toggleTheme } from "@/store/slices/uiSlice";

export function Header() {
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.ui.theme);

    return (
        <header className="flex h-(--spacing-header) shrink-0 items-center gap-3 border-b border-border bg-background px-4">
            <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle sidebar"
                onClick={() => dispatch(toggleSidebar())}
            >
                <PanelLeft />
            </Button>

            <div>
                <h1 className="font-heading text-lg leading-tight font-semibold">
                    Competitive Overview
                </h1>
                <p className="text-xs text-muted-foreground">
                    Live read on the market — updated hourly
                </p>
            </div>

            <div className="ml-auto flex items-center gap-2">
                <Input placeholder="Search competitors..." className="hidden w-56 sm:block" />
                <Button
                    variant="outline"
                    size="icon"
                    aria-label="Toggle theme"
                    onClick={() => dispatch(toggleTheme())}
                >
                    {theme === "dark" ? <Sun /> : <Moon />}
                </Button>
            </div>
        </header>
    );
}
