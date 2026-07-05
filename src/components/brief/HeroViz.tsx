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

/** Fixed starfield positions — deterministic so SSR/CSR markup matches
 * (no Math.random at render time). */
const STARS = [
    { x: 24, y: 30, r: 1.2, delay: 0 },
    { x: 168, y: 20, r: 1, delay: 300 },
    { x: 40, y: 150, r: 0.8, delay: 600 },
    { x: 176, y: 140, r: 1.1, delay: 900 },
    { x: 100, y: 185, r: 0.9, delay: 1200 },
    { x: 12, y: 100, r: 1, delay: 1500 },
    { x: 188, y: 95, r: 0.8, delay: 1800 },
    { x: 70, y: 12, r: 1, delay: 2100 },
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
            <div className="absolute inset-8 animate-pulse rounded-full bg-iris opacity-20 blur-3xl" />

            <svg viewBox="0 0 200 200" className="relative size-full">
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
                    className="animate-pulse fill-none stroke-border"
                    strokeWidth="1"
                />
                <circle
                    cx="100"
                    cy="100"
                    r="40"
                    className="fill-none stroke-border"
                    strokeWidth="1"
                />

                {/* starfield — mirrors the night-earth reference's ambient sparkle */}
                {STARS.map((star, index) => (
                    <circle
                        key={index}
                        cx={star.x}
                        cy={star.y}
                        r={star.r}
                        className="animate-pulse fill-muted-foreground"
                        style={{ animationDelay: `${star.delay}ms`, animationDuration: "3s" }}
                    />
                ))}

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

                {/* spokes + pins orbit together so each connecting line always
                 * tracks its own pin, like the "hub with radiating links" shot
                 * in the reference clip. */}
                <g
                    className="animate-[spin_24s_linear_infinite]"
                    style={{ transformOrigin: "100px 100px" }}
                >
                    {AGENT_DOTS.map((dot, index) => (
                        <g
                            key={index}
                            className="animate-in fade-in-0 duration-700"
                            style={{
                                animationDelay: `${index * 120}ms`,
                                animationFillMode: "backwards",
                            }}
                        >
                            <line
                                x1="100"
                                y1="100"
                                x2={dot.x}
                                y2={dot.y}
                                stroke={AGENT_COLORS[index]}
                                strokeWidth="0.75"
                                strokeOpacity="0.35"
                            />
                            <circle
                                cx={dot.x}
                                cy={dot.y}
                                r="7"
                                fill={AGENT_COLORS[index]}
                                className="animate-ping opacity-40"
                                style={{ animationDelay: `${index * 300}ms` }}
                            />
                            <circle
                                cx={dot.x}
                                cy={dot.y}
                                r="9"
                                fill="none"
                                stroke={AGENT_COLORS[index]}
                                strokeWidth="1"
                                strokeOpacity="0.5"
                            />
                            <circle cx={dot.x} cy={dot.y} r="5" fill={AGENT_COLORS[index]} />
                        </g>
                    ))}
                </g>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute size-20 animate-pulse rounded-full border border-iris/50" />
                <div className="flex size-12 items-center justify-center rounded-2xl bg-iris font-heading text-base font-bold text-background shadow-glow">
                    R
                </div>
            </div>
        </div>
    );
}
