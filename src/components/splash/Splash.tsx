import { StatStrip } from "@/components/brief/StatStrip";

interface SplashProps {
    onDismiss: () => void;
}

/** Full-viewport entry gate — reuses the same iris "R" mark from HeroViz and
 * the Discovery radar's CenterNode, and the same StatStrip from Brief, so
 * the splash doesn't invent a second visual language for the same brand. */
export function Splash({ onDismiss }: SplashProps) {
    return (
        <div
            role="button"
            tabIndex={0}
            aria-label="Click to enter Rivalyze"
            onClick={onDismiss}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onDismiss();
            }}
            className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center gap-10 bg-background px-4 animate-in fade-in-0 duration-700"
        >
            <div className="relative flex flex-col items-center gap-4">
                <div
                    aria-hidden
                    className="absolute inset-0 -z-10 mx-auto size-32 animate-pulse rounded-full bg-iris opacity-30 blur-3xl"
                />
                <div className="flex size-20 items-center justify-center rounded-3xl bg-iris font-heading text-4xl font-bold text-background shadow-glow">
                    R
                </div>
                <p className="font-heading text-2xl font-semibold tracking-wide text-foreground uppercase">
                    Rivalyze
                </p>
                <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                    Competitive intelligence, automated
                </p>
            </div>

            <StatStrip className="max-w-md" />

            <p className="mt-4 animate-pulse font-mono text-xs tracking-widest text-muted-foreground uppercase">
                Click to enter
            </p>
        </div>
    );
}
