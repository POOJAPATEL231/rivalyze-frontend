import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface GuideStepsProps {
    items: ReactNode[];
    className?: string;
}

/** Numbered walkthrough list — circular index badges echo the step-bar's own
 * numbered nodes, since this page documents that same wizard. */
export function GuideSteps({ items, className }: GuideStepsProps) {
    return (
        <ol className={cn("space-y-2.5", className)}>
            {items.map((item, index) => (
                <li key={index} className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-success/40 bg-success/10 font-mono text-[11px] text-success">
                        {index + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">{item}</span>
                </li>
            ))}
        </ol>
    );
}
