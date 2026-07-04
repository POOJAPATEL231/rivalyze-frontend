import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/uiSlice";

const LINKS = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#evidence", label: "Evidence" },
    { href: "#showcase", label: "Product" },
    { href: "#roadmap", label: "Roadmap" },
];

export default function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.ui.theme);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled ? "glass" : "border-b border-transparent"}`}
        >
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                <a
                    href="#top"
                    className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight text-foreground"
                >
                    <img
                        src="/brand/argus-icon.png"
                        alt=""
                        className="h-8 w-8 rounded-md object-cover"
                    />
                    Argus
                </a>
                <div className="hidden items-center gap-8 md:flex">
                    {LINKS.map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {l.label}
                        </a>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle theme"
                        onClick={() => dispatch(toggleTheme())}
                    >
                        {theme === "dark" ? <Sun /> : <Moon />}
                    </Button>
                    <Link
                        to="/login"
                        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-muted-foreground"
                    >
                        Login
                    </Link>
                    <Link
                        to="/signup"
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-foreground transition-transform hover:-translate-y-0.5 hover:brightness-110"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
}
