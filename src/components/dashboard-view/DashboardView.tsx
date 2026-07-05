import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";

import { ExecSummary } from "@/components/dashboard-view/ExecSummary";
import { HeadToHead } from "@/components/dashboard-view/HeadToHead";
import { SentimentPanel } from "@/components/dashboard-view/SentimentPanel";
import { StatsStrip } from "@/components/dashboard-view/StatsStrip";
import { SwotGrid } from "@/components/dashboard-view/SwotGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReport } from "@/hooks/useReport";
import { extractApiErrorMessage } from "@/lib/apiError";
import { exportSectionsToPdf } from "@/lib/exportPdf";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { unlockStep } from "@/store/slices/analysisSlice";

export function DashboardView() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const runId = useAppSelector((state) => state.analysis.runId);
    const report = useReport(runId);
    const exportRef = useRef<HTMLDivElement>(null);
    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState<string | null>(null);

    function handleContinue() {
        dispatch(unlockStep("recommendations"));
        navigate("/recommendations");
    }

    async function handleExportPdf(companyName: string) {
        const node = exportRef.current;
        if (!node) return;
        setExporting(true);
        setExportError(null);
        try {
            await exportSectionsToPdf(node, `${companyName || "dashboard"}-report.pdf`);
        } catch (err) {
            setExportError(extractApiErrorMessage(err));
        } finally {
            setExporting(false);
        }
    }

    if (report.status === "idle") {
        return (
            <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-muted-foreground">
                No report yet — run the agents first.
            </div>
        );
    }

    if (report.status === "loading") {
        return (
            <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-12 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading report&hellip;
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

    const formatSwotArray = (arr: string[]) =>
        arr.map((str) => str.replace(/\s*\(ev-[a-zA-Z0-9]{8}\)/g, ".").trim());

    const formattedSwot = {
        strengths: formatSwotArray(data.swot.strengths),
        weaknesses: formatSwotArray(data.swot.weaknesses),
        opportunities: formatSwotArray(data.swot.opportunities),
        threats: formatSwotArray(data.swot.threats),
    };

    return (
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-4">
                    <div>
                        <h1 className="font-heading text-3xl font-semibold text-foreground">
                            Here&rsquo;s the read
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Every claim below traces back to a source — click any of them to see the
                            evidence.
                        </p>
                    </div>
                </div>
                <div className="space-y-1.5 text-right">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={exporting}
                        onClick={() => handleExportPdf(data.company)}
                    >
                        <Download data-icon="inline-start" />
                        {exporting ? "Exporting…" : "Export PDF"}
                    </Button>
                    {exportError && <p className="text-sm text-destructive">{exportError}</p>}
                </div>
            </div>

            <div ref={exportRef} className="space-y-8 bg-background">
                <ExecSummary report={data} />
                <StatsStrip stats={data.stats} />

                <Card>
                    <CardHeader>
                        <CardTitle>Head to head</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <HeadToHead rows={data.head_to_head} />
                    </CardContent>
                </Card>

                <SwotGrid swot={formattedSwot} />

                <SentimentPanel sentiment={data.sentiment} />
            </div>

            <div className="flex justify-end">
                <Button
                    size="lg"
                    onClick={handleContinue}
                    className="bg-iris text-background hover:opacity-90"
                >
                    See the recommendations
                </Button>
            </div>
        </div>
    );
}
