import { cn } from "@/lib/utils";

const AGENT_DOTS = [
    { x: 100, y: 10 },
    { x: 185.6, y: 72.2 },
    { x: 152.9, y: 172.8 },
    { x: 47.1, y: 172.8 },
    { x: 14.4, y: 72.2 },
];

const AGENT_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
];

interface HeroVizProps {
    className?: string;
}

/** Decorative orbital SVG — three rings, a rotating gradient sweep, and five
 * dots representing the five specialist agents (chart-1..5, same order the
 * Live Run view uses for its agent lanes). */
export function HeroViz({ className }: HeroVizProps) {
    return (
        <div
            aria-hidden
            className={cn("relative mx-auto aspect-square w-full max-w-sm", className)}
        >
            <svg viewBox="0 0 200 200" className="size-full">
                <defs>
                    <linearGradient id="heroviz-sweep" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--success)" />
                        <stop offset="52%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="var(--watch)" />
                    </linearGradient>
                </defs>

                <circle
                    cx="100"
                    cy="100"
                    r="90"
                    className="fill-none stroke-border"
                    strokeWidth="1"
                />
                <circle
                    cx="100"
                    cy="100"
                    r="65"
                    className="fill-none stroke-border"
                    strokeWidth="1"
                />
                <circle
                    cx="100"
                    cy="100"
                    r="40"
                    className="fill-none stroke-border"
                    strokeWidth="1"
                />

                {/* transform-origin must be an absolute point, not "center" — SVG
                 * resolves percentage origins against the element's own bounding
                 * box, not the viewBox, which would rotate around the line's
                 * midpoint instead of the circle's center. */}
                <g
                    className="animate-[spin_6s_linear_infinite]"
                    style={{ transformOrigin: "100px 100px" }}
                >
                    <line
                        x1="100"
                        y1="100"
                        x2="100"
                        y2="10"
                        stroke="url(#heroviz-sweep)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                </g>

                {AGENT_DOTS.map((dot, index) => (
                    <circle
                        key={index}
                        cx={dot.x}
                        cy={dot.y}
                        r="5"
                        fill={AGENT_COLORS[index]}
                        className="animate-in fade-in-0 duration-700"
                        style={{
                            animationDelay: `${index * 120}ms`,
                            animationFillMode: "backwards",
                        }}
                    />
                ))}
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-iris font-heading text-base font-bold text-background shadow-glow">
                    R
                </div>
            </div>
        </div>
    );
}
