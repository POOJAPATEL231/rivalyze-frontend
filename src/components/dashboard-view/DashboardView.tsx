import { useRef, useState } from "react";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useNavigate } from "react-router";

import { ExecSummary } from "@/components/dashboard-view/ExecSummary";
import { HeadToHead } from "@/components/dashboard-view/HeadToHead";
import { OpportunitiesPanel } from "@/components/dashboard-view/OpportunitiesPanel";
import { SentimentPanel } from "@/components/dashboard-view/SentimentPanel";
import { StatsStrip } from "@/components/dashboard-view/StatsStrip";
import { SwotGrid } from "@/components/dashboard-view/SwotGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReport } from "@/hooks/useReport";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { unlockStep } from "@/store/slices/analysisSlice";

export function DashboardView() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const runId = useAppSelector((state) => state.analysis.runId);
    const report = useReport(runId);
    const exportRef = useRef<HTMLDivElement>(null);
    const [exporting, setExporting] = useState(false);

    function handleContinue() {
        dispatch(unlockStep("recommendations"));
        navigate("/recommendations");
    }

    async function handleExportPdf(companyName: string) {
        const node = exportRef.current;
        if (!node) return;
        setExporting(true);
        try {
            const canvas = await html2canvas(node, { scale: 2, backgroundColor: null });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            pdf.save(`${companyName || "dashboard"}-report.pdf`);
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

    return (
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-4">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/discovery")}>
                        <ArrowLeft data-icon="inline-start" />
                        Back
                    </Button>
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
                <Button
                    variant="outline"
                    size="sm"
                    disabled={exporting}
                    onClick={() => handleExportPdf(data.company)}
                >
                    <Download data-icon="inline-start" />
                    {exporting ? "Exporting…" : "Export PDF"}
                </Button>
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

                <SwotGrid swot={data.swot} />

                <div className="grid grid-cols-1 gap-6 min-[960px]:grid-cols-2">
                    <SentimentPanel sentiment={data.sentiment} />
                    <OpportunitiesPanel
                        opportunities={data.opportunities}
                        lowSignalFindings={data.low_signal_findings}
                    />
                </div>
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
