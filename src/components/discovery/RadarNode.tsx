import type { CompetitorRelation } from "@/types/competitor";

interface RadarNodeProps {
    x: number;
    y: number;
    label: string;
    relation: CompetitorRelation;
    delayMs: number;
    /** Counter-spin class, same duration as the parent ring's orbit but
     * reversed, so the dot travels the ring while its label stays upright. */
    counterOrbitClass: string;
}

const RELATION_COLOR: Record<CompetitorRelation, string> = {
    direct: "var(--success)",
    indirect: "var(--primary)",
};

/** Single competitor dot + label, staggered pop-in on mount, then riding its
 * ring's orbit (see CompetitorRadar) while staying upright and readable. */
export function RadarNode({ x, y, label, relation, delayMs, counterOrbitClass }: RadarNodeProps) {
    const isRightHalf = x >= 100;

    return (
        <g className={counterOrbitClass} style={{ transformOrigin: `${x}px ${y}px` }}>
            <g
                className="animate-in fade-in-0 zoom-in-50 duration-500"
                style={{
                    animationDelay: `${delayMs}ms`,
                    animationFillMode: "backwards",
                    transformOrigin: `${x}px ${y}px`,
                }}
            >
                <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill={RELATION_COLOR[relation]}
                    className="animate-ping opacity-40"
                    style={{ animationDelay: `${delayMs + 400}ms` }}
                />
                <circle cx={x} cy={y} r="5" fill={RELATION_COLOR[relation]} />
                <text
                    x={x + (isRightHalf ? 9 : -9)}
                    y={y}
                    textAnchor={isRightHalf ? "start" : "end"}
                    dominantBaseline="middle"
                    className="fill-foreground font-heading text-[7px] font-medium"
                >
                    {label}
                </text>
            </g>
        </g>
    );
}
