import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

import { ExecSummary } from "@/components/dashboard-view/ExecSummary";
import { HeadToHead } from "@/components/dashboard-view/HeadToHead";
import { OpportunitiesPanel } from "@/components/dashboard-view/OpportunitiesPanel";
import { SentimentPanel } from "@/components/dashboard-view/SentimentPanel";
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

    function handleContinue() {
        dispatch(unlockStep("recommendations"));
        navigate("/recommendations");
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
            <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-muted-foreground">
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
            <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => navigate("/run")}>
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

            <ExecSummary report={data} />

            <div className="grid grid-cols-1 gap-6 min-[960px]:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Head to head</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <HeadToHead rows={data.head_to_head} />
                    </CardContent>
                </Card>
                <SwotGrid swot={data.swot} />
            </div>

            <div className="grid grid-cols-1 gap-6 min-[960px]:grid-cols-2">
                <SentimentPanel sentiment={data.sentiment} />
                <OpportunitiesPanel
                    opportunities={data.opportunities}
                    lowSignalFindings={data.low_signal_findings}
                />
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
