import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type CalloutVariant = "warning" | "clarify" | "note";

interface GuideCalloutProps {
    variant: CalloutVariant;
    children: ReactNode;
}

const VARIANT_CONFIG: Record<
    CalloutVariant,
    { label: string; className: string; labelClassName: string }
> = {
    warning: {
        label: "Warning",
        className: "border-destructive/60 bg-destructive/10",
        labelClassName: "text-destructive",
    },
    clarify: {
        label: "Needs clarification",
        className: "border-watch/60 bg-watch/10",
        labelClassName: "text-watch",
    },
    note: {
        label: "Note",
        className: "border-primary/60 bg-primary/10",
        labelClassName: "text-primary",
    },
};

/** Dashed callout box for the User Guide — same convention as ConfidenceNote
 * and the low-signal/not-found warnings elsewhere, just parameterized over
 * three severities via STATUS_CONFIG-style variant mapping. */
export function GuideCallout({ variant, children }: GuideCalloutProps) {
    const config = VARIANT_CONFIG[variant];

    return (
        <div
            className={cn(
                "space-y-1.5 rounded-lg border border-dashed p-4 text-sm text-muted-foreground",
                config.className,
            )}
        >
            <p
                className={cn(
                    "font-mono text-[10px] font-semibold tracking-wide uppercase",
                    config.labelClassName,
                )}
            >
                {config.label}
            </p>
            {children}
        </div>
    );
}
