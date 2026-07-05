import { ArrowLeft, Moon, Sun } from "lucide-react";
import { Link } from "react-router";

import { GuideView } from "@/components/guide/GuideView";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/uiSlice";

export default function Guide() {
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.ui.theme);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const homeHref = isAuthenticated ? "/brief" : "/";

    return (
        <div className="min-h-svh bg-background text-foreground">
            <header className="glass sticky top-0 z-50 flex items-center gap-3 px-4 py-3 sm:px-6">
                <Link
                    to={homeHref}
                    className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight text-foreground"
                >
                    <img
                        src="/brand/argus-icon.png"
                        alt=""
                        className="h-8 w-8 rounded-md object-cover"
                    />
                    Rivalyze
                </Link>
                <span className="hidden text-sm text-muted-foreground sm:inline">/ User guide</span>
                <div className="ml-auto flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle theme"
                        onClick={() => dispatch(toggleTheme())}
                    >
                        {theme === "dark" ? <Sun /> : <Moon />}
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link to={homeHref}>
                            <ArrowLeft data-icon="inline-start" />
                            {isAuthenticated ? "Back to app" : "Back home"}
                        </Link>
                    </Button>
                </div>
            </header>

            <GuideView />
        </div>
    );
}
