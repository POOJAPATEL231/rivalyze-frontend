import type { CompetitorRelation } from "@/types/competitor";

interface RadarNodeProps {
    x: number;
    y: number;
    label: string;
    relation: CompetitorRelation;
    delayMs: number;
}

const RELATION_COLOR: Record<CompetitorRelation, string> = {
    direct: "var(--success)",
    indirect: "var(--primary)",
};

/** Single competitor dot + label on the radar, staggered pop-in on mount. */
export function RadarNode({ x, y, label, relation, delayMs }: RadarNodeProps) {
    const isRightHalf = x >= 100;

    return (
        <g
            className="animate-in fade-in-0 zoom-in-50 duration-500"
            style={{
                animationDelay: `${delayMs}ms`,
                animationFillMode: "backwards",
                transformOrigin: `${x}px ${y}px`,
            }}
        >
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
    );
}
