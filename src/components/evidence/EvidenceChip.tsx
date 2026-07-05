import { Diamond } from "lucide-react";

import { evidence } from "@/data/evidence";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { openEvidence } from "@/store/slices/analysisSlice";

interface EvidenceChipProps {
    evidenceId: string;
    className?: string;
}

/** Inline "◈ N sources" button, reused across every wizard view to open the
 * shared EvidenceDrawer for a given claim. */
export function EvidenceChip({ evidenceId, className }: EvidenceChipProps) {
    const dispatch = useAppDispatch();
    const count = evidence[evidenceId]?.sources.length ?? 0;

    return (
        <button
            type="button"
            onClick={() => dispatch(openEvidence(evidenceId))}
            className={cn(
                "inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary",
                className,
            )}
        >
            <Diamond className="size-2.5" />
            {count} source{count === 1 ? "" : "s"}
        </button>
    );
}
