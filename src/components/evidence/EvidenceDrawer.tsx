import { SourceCard } from "@/components/evidence/SourceCard";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { evidence } from "@/data/evidence";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeEvidence } from "@/store/slices/analysisSlice";

/** Global slide-in overlay showing the sources behind a claim. Mounted once
 * at the AnalysisFlow root; every EvidenceChip just dispatches openEvidence. */
export function EvidenceDrawer() {
    const dispatch = useAppDispatch();
    const { open, evidenceId } = useAppSelector((state) => state.analysis.evidenceDrawer);
    const item = evidenceId ? evidence[evidenceId] : undefined;

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
                    // shadcn's default slide-in-from-right-10 only nudges the panel
                    // 2.5rem — barely perceptible on a 460px drawer. The design calls
                    // for a proper reveal from fully off-screen, not an edge nudge.
                    "data-[side=right]:data-open:slide-in-from-right data-[side=right]:data-closed:slide-out-to-right",
                )}
            >
                <SheetHeader>
                    <SheetTitle>Evidence</SheetTitle>
                    <SheetDescription className="text-foreground">
                        {item ? `“${item.claim}”` : "Select a source to view supporting evidence."}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-4 px-4 pb-4">
                    {item?.sources.map((source) => (
                        <SourceCard key={source.id} source={source} />
                    ))}
                </div>

                {item?.confidenceNote && (
                    <div className="mt-auto border-t border-border p-4 font-mono text-xs text-muted-foreground">
                        {item.confidenceNote}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
