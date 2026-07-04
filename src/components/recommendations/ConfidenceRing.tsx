import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface ConfidenceRingProps {
    value: number;
    className?: string;
}

const RADIUS = 24;
const STROKE_WIDTH = 5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ringColorClassName(value: number) {
    if (value >= 70) return "stroke-success";
    if (value >= 55) return "stroke-watch";
    return "stroke-destructive";
}

/** SVG donut ring — animates stroke-dashoffset from 0 to value on mount. */
export function ConfidenceRing({ value, className }: ConfidenceRingProps) {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        // Render at 0 first, then move to the real value on the next frame so
        // the transition has something to animate from instead of snapping.
        const frame = requestAnimationFrame(() => setAnimatedValue(value));
        return () => cancelAnimationFrame(frame);
    }, [value]);

    const offset = CIRCUMFERENCE * (1 - animatedValue / 100);

    return (
        <div className={cn("relative size-14 shrink-0", className)}>
            <svg viewBox="0 0 56 56" className="size-full -rotate-90">
                <circle
                    cx="28"
                    cy="28"
                    r={RADIUS}
                    strokeWidth={STROKE_WIDTH}
                    className="fill-none stroke-muted"
                />
                <circle
                    cx="28"
                    cy="28"
                    r={RADIUS}
                    strokeWidth={STROKE_WIDTH}
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={offset}
                    className={cn(
                        "fill-none transition-[stroke-dashoffset] duration-1000 ease-out",
                        ringColorClassName(value),
                    )}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-xs font-semibold text-foreground">{value}%</span>
            </div>
        </div>
    );
}
