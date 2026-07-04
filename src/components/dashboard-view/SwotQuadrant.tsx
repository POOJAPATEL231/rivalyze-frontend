import { cn } from "@/lib/utils";

interface SwotQuadrantProps {
    label: string;
    textClassName: string;
    dotClassName: string;
    items: string[];
}

export function SwotQuadrant({ label, textClassName, dotClassName, items }: SwotQuadrantProps) {
    return (
        <div className="space-y-2 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <p
                className={cn(
                    "font-heading text-xs font-semibold tracking-wide uppercase",
                    textClassName,
                )}
            >
                {label}
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
                {items.map((item) => (
                    <li key={item} className="flex gap-2">
                        <span className={cn("mt-1.5 size-1 shrink-0 rounded-full", dotClassName)} />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
