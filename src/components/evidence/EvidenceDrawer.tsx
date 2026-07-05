import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { SourceCard } from "@/components/evidence/SourceCard";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { fetchClaimEvidence } from "@/services/analyze";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    closeEvidence,
    setEvidenceSources,
    setEvidenceLoading,
} from "@/store/slices/analysisSlice";
import type { ApiEvidenceSource } from "@/types/api";

/** Map an ApiEvidenceSource to the shape SourceCard expects. */
function toSourceCardShape(s: ApiEvidenceSource) {
    return {
        id: s.id,
        name: s.source_name,
        type: s.source_type,
        date: s.source_date,
        snippet: s.snippet,
        url: s.url,
        agent: s.agent as import("@/types/analysis").LaneId,
    };
}

/** Global slide-in overlay showing the sources behind a claim. Mounted once
 * at the AnalysisFlow root; triggered by dispatching openEvidence(claimRef). */
export function EvidenceDrawer() {
    const dispatch = useAppDispatch();
    const runId = useAppSelector((state) => state.analysis.runId);
    const { open, claimRef, sources, loading } = useAppSelector(
        (state) => state.analysis.evidenceDrawer,
    );

    // Fetch evidence whenever the drawer opens with a new claimRef
    useEffect(() => {
        if (!open || !claimRef || !runId) return;

        let cancelled = false;
        dispatch(setEvidenceLoading(true));

        fetchClaimEvidence(claimRef, runId)
            .then((data) => {
                if (!cancelled) dispatch(setEvidenceSources(data.sources));
            })
            .catch(() => {
                if (!cancelled) dispatch(setEvidenceSources([]));
            });

        return () => {
            cancelled = true;
        };
    }, [open, claimRef, runId, dispatch]);

    return (
        <Sheet
            open={open}
            onOpenChange={(next) => {
                if (!next) dispatch(closeEvidence());
            }}
        >
            <SheetContent
                side="right"
                className={cn(
                    "gap-0 overflow-y-auto duration-300",
                    "data-[side=right]:w-115 data-[side=right]:max-w-[92vw] sm:data-[side=right]:max-w-115",
                    "data-[side=right]:data-open:slide-in-from-right data-[side=right]:data-closed:slide-out-to-right",
                )}
            >
                <SheetHeader>
                    <SheetTitle>Evidence</SheetTitle>
                    <SheetDescription className="font-mono text-xs text-muted-foreground">
                        {claimRef ?? "Select a source to view supporting evidence."}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-4 px-4 pb-4">
                    {loading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                            <Loader2 className="size-4 animate-spin" />
                            Loading sources…
                        </div>
                    )}

                    {!loading && sources.length === 0 && (
                        <p className="text-sm text-muted-foreground py-4">
                            No sources found for this claim.
                        </p>
                    )}

                    {!loading &&
                        sources.map((source) => (
                            <SourceCard key={source.id} source={toSourceCardShape(source)} />
                        ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}
