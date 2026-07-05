import { useEffect, useState } from "react";
import { Diamond, Loader2 } from "lucide-react";

import { evidence } from "@/data/evidence";
import { cn } from "@/lib/utils";
import { fetchClaimEvidence } from "@/services/analyze";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openEvidence } from "@/store/slices/analysisSlice";

interface EvidenceChipProps {
    evidenceId: string;
    className?: string;
}

/** Inline "◈ N sources" button, reused across every wizard view to open the
 * shared EvidenceDrawer for a given claim. */
export function EvidenceChip({ evidenceId, className }: EvidenceChipProps) {
    const dispatch = useAppDispatch();
    const runId = useAppSelector((state) => state.analysis.runId);

    const mockEvidence = evidence[evidenceId];
    const [count, setCount] = useState<number | null>(
        mockEvidence ? mockEvidence.sources.length : null,
    );
    // Only show loading if we don't have mock data AND we have a runId to fetch from.
    const [loading, setLoading] = useState(!mockEvidence && !!runId);

    useEffect(() => {
        if (mockEvidence || !runId) return;

        let cancelled = false;

        fetchClaimEvidence(evidenceId, runId)
            .then((data) => {
                if (!cancelled) {
                    setCount(data.sources.length);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setCount(0);
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [evidenceId, runId, mockEvidence]);

    return (
        <button
            type="button"
            onClick={() => dispatch(openEvidence(evidenceId))}
            className={cn(
                "inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary",
                className,
            )}
        >
            {loading ? (
                <Loader2 className="size-2.5 animate-spin" />
            ) : (
                <Diamond className="size-2.5" />
            )}
            {loading ? "Loading..." : `${count ?? 0} source${count === 1 ? "" : "s"}`}
        </button>
    );
}
