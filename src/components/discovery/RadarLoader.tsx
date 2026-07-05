import { CenterNode } from "@/components/discovery/CenterNode";
import { cn } from "@/lib/utils";

interface RadarLoaderProps {
    companyLabel: string;
    className?: string;
}

export function RadarLoader({ companyLabel, className }: RadarLoaderProps) {
    return (
        <div className={cn("relative mx-auto aspect-square w-full max-w-md", className)}>
            <svg viewBox="0 0 200 200" className="size-full overflow-visible" aria-hidden>
                <defs>
                    <linearGradient id="radar-sweep" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--success)" />
                        <stop offset="52%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="var(--watch)" />
                    </linearGradient>
                </defs>

                {/* Radar Rings with synchronized pulsing opacity */}
                <circle
                    cx="100"
                    cy="100"
                    r="90"
                    className="fill-none stroke-primary/60 animate-pulse"
                    strokeWidth="1.5"
                    style={{ animationDelay: "600ms", animationDuration: "2s" }}
                />
                <circle
                    cx="100"
                    cy="100"
                    r="65"
                    className="fill-none stroke-primary/80 animate-pulse"
                    strokeWidth="1.5"
                    style={{ animationDelay: "300ms", animationDuration: "2s" }}
                />
                <circle
                    cx="100"
                    cy="100"
                    r="40"
                    className="fill-none stroke-primary animate-pulse"
                    strokeWidth="1.5"
                    style={{ animationDelay: "0ms", animationDuration: "2s" }}
                />

                {/* Radar Sweep */}
                <g
                    className="animate-[spin_4s_linear_infinite]"
                    style={{ transformOrigin: "100px 100px" }}
                >
                    <line
                        x1="100"
                        y1="100"
                        x2="100"
                        y2="10"
                        stroke="url(#radar-sweep)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </g>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center scale-75">
                <CenterNode label={companyLabel} />
            </div>
        </div>
    );
}
