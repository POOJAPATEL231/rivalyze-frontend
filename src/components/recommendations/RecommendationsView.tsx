import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ConfidenceNote } from "@/components/recommendations/ConfidenceNote";
import { RecCard } from "@/components/recommendations/RecCard";
import { Button } from "@/components/ui/button";
import { useReport } from "@/hooks/useReport";
import { extractApiErrorMessage } from "@/lib/apiError";
import { exportReport } from "@/services/analyze";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { unlockStep } from "@/store/slices/analysisSlice";

export function RecommendationsView() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const runId = useAppSelector((state) => state.analysis.runId);
    const report = useReport(runId);
    const [isExporting, setIsExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

    async function handleExport(format: "md" | "pdf") {
        if (!runId || isExporting) return;

        setIsExporting(true);
        setExportError(null);
        try {
            const blob = await exportReport(runId, format);

            // Create a link element, hide it, direct it toward the blob, and then click it
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            // Provide a default file name with the selected format
            a.download = `report-${runId}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            setExportError(extractApiErrorMessage(err));
        } finally {
            setIsExporting(false);
        }
    }

    function goTo(step: "compare" | "workspace") {
        dispatch(unlockStep(step));
        navigate(`/${step}`);
    }

    if (report.status === "idle") {
        return (
            <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-muted-foreground">
                No recommendations yet — run the agents first.
            </div>
        );
    }

    if (report.status === "loading") {
        return (
            <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-12 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading recommendations&hellip;
            </div>
        );
    }

    if (report.status === "error") {
        return (
            <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-destructive">
                {report.message}
            </div>
        );
    }

    const data = report.data;

    return (
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
            <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                    <ArrowLeft data-icon="inline-start" />
                    Back
                </Button>
                <div>
                    <h1 className="font-heading text-3xl font-semibold text-foreground">
                        What to do about it
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Ranked by confidence — every recommendation traces back to the evidence that
                        produced it.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 min-[960px]:grid-cols-3">
                {data.recommendations.map((recommendation) => (
                    <RecCard key={recommendation.claim_ref} recommendation={recommendation} />
                ))}
            </div>

            <ConfidenceNote />

            <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-end gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" disabled={isExporting || !runId}>
                                {isExporting && <Loader2 className="mr-2 size-4 animate-spin" />}
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExport("md")}>
                                Markdown (.md)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport("pdf")}>
                                PDF (.pdf)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" onClick={() => goTo("compare")}>
                        Compare side-by-side
                    </Button>
                    <Button variant="outline" onClick={() => goTo("workspace")}>
                        Ask the intelligence
                    </Button>
                    <Button
                        onClick={() => navigate("/brief")}
                        className="bg-iris text-background hover:opacity-90"
                    >
                        Re-run
                    </Button>
                </div>
                {exportError && (
                    <p className="text-right text-sm text-destructive">{exportError}</p>
                )}
            </div>
        </div>
    );
}
