import { CenterNode } from "@/components/discovery/CenterNode";
import { RadarNode } from "@/components/discovery/RadarNode";
import { cn } from "@/lib/utils";
import type { Competitor, CompetitorRelation } from "@/types/competitor";

interface CompetitorRadarProps {
    competitors: Competitor[];
    companyLabel: string;
    className?: string;
}

const RING_RADIUS: Record<CompetitorRelation, number> = {
    direct: 65,
    indirect: 90,
};

// Tailwind's scanner needs literal class strings, so orbit durations are
// fixed pairs rather than interpolated — direct orbits faster, on the
// smaller ring; indirect drifts slower on the outer one.
const ORBIT_CLASS: Record<CompetitorRelation, string> = {
    direct: "animate-[spin_40s_linear_infinite]",
    indirect: "animate-[spin_60s_linear_infinite]",
};
const COUNTER_ORBIT_CLASS: Record<CompetitorRelation, string> = {
    direct: "animate-[spin_40s_linear_infinite_reverse]",
    indirect: "animate-[spin_60s_linear_infinite_reverse]",
};

function layoutNodes(competitors: Competitor[]) {
    const groups: Record<CompetitorRelation, Competitor[]> = {
        direct: [],
        indirect: [],
    };
    for (const competitor of competitors) {
        const relation: CompetitorRelation =
            competitor.relation === "indirect" ? "indirect" : "direct";
        groups[relation].push(competitor);
    }

    return (Object.keys(groups) as CompetitorRelation[]).flatMap((relation) => {
        const list = groups[relation];
        const radius = RING_RADIUS[relation];
        return list.map((competitor, index) => {
            const angle = (-90 + (360 / list.length) * index) * (Math.PI / 180);
            return {
                competitor,
                relation,
                x: 100 + radius * Math.cos(angle),
                y: 100 + radius * Math.sin(angle),
            };
        });
    });
}

/** SVG radar: three rings, a rotating gradient sweep, and one node per
 * competitor — direct relations on the middle ring, indirect on the outer. */
export function CompetitorRadar({ competitors, companyLabel, className }: CompetitorRadarProps) {
    const nodes = layoutNodes(competitors);

    return (
        <div className={cn("relative mx-auto aspect-square w-full max-w-md", className)}>
            <div className="absolute inset-10 animate-pulse rounded-full bg-primary opacity-10 blur-3xl" />

            <svg viewBox="0 0 200 200" className="relative size-full overflow-visible" aria-hidden>
                <defs>
                    <linearGradient id="radar-sweep" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--success)" />
                        <stop offset="52%" stopColor="var(--primary)" />
                        <stop offset="100%" stopColor="var(--watch)" />
                    </linearGradient>
                </defs>

                <circle
                    cx="100"
                    cy="100"
                    r="90"
                    className="animate-pulse fill-none stroke-border"
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

                {/* See HeroViz for why transform-origin needs an absolute point. */}
                <g
                    className="animate-[spin_6s_linear_infinite]"
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

                {(["direct", "indirect"] as CompetitorRelation[]).map((relation) => (
                    <g
                        key={relation}
                        className={ORBIT_CLASS[relation]}
                        style={{ transformOrigin: "100px 100px" }}
                    >
                        {nodes
                            .filter((node) => node.relation === relation)
                            .map(({ competitor, x, y }, index) => (
                                <RadarNode
                                    key={competitor.id}
                                    x={x}
                                    y={y}
                                    label={competitor.name}
                                    relation={relation}
                                    delayMs={index * 100}
                                    counterOrbitClass={COUNTER_ORBIT_CLASS[relation]}
                                />
                            ))}
                    </g>
                ))}
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
                <CenterNode label={companyLabel} />
            </div>
        </div>
    );
}
