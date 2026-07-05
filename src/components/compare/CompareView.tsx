import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";

import { CompareColumn, type CompareRow } from "@/components/compare/CompareColumn";
import { RivalPicker } from "@/components/compare/RivalPicker";
import { Verdict } from "@/components/compare/Verdict";
import { Button } from "@/components/ui/button";
import { useReport } from "@/hooks/useReport";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";

export function CompareView() {
    const navigate = useNavigate();
    const runId = useAppSelector((state) => state.analysis.runId);
    const report = useReport(runId);
    const competitors = useAppSelector((state) => state.analysis.competitors);
    const companyName = useAppSelector((state) => state.analysis.companyName);
    const [selectedIds, setSelectedIds] = useState<string[]>(() =>
        competitors.slice(0, 2).map((competitor) => competitor.id),
    );

    const companyLabel = companyName || "Your idea";

    function handleToggle(id: string) {
        setSelectedIds((prev) => {
            if (prev.includes(id)) return prev.filter((existing) => existing !== id);
            if (prev.length < 2) return [...prev, id];
            // Already at the max of two — the oldest selection makes room for the new one.
            return [...prev.slice(1), id];
        });
    }

    if (report.status === "idle") {
        return (
            <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-muted-foreground">
                Nothing to compare yet — run the agents first.
            </div>
        );
    }

    if (report.status === "loading") {
        return (
            <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-12 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading comparison&hellip;
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

    // Rival cells are keyed by the competitor's real name in the API response
    // (e.g. "Ola"), not the internal slugified Competitor.id (e.g. "ola").
    function buildRows(competitorName?: string): CompareRow[] {
        const h2hRows = data.head_to_head.map((row) => ({
            label: row.metric,
            text: competitorName ? (row.rivals[competitorName]?.value ?? "No data yet") : row.you,
        }));

        const sentimentEntry = competitorName ? data.sentiment[competitorName] : undefined;

        return [
            ...h2hRows,
            {
                label: "Sentiment",
                text: competitorName
                    ? sentimentEntry
                        ? `${sentimentEntry.label} (${sentimentEntry.score.toFixed(2)})`
                        : "No data yet"
                    : "Building your sentiment baseline — check back after your first review cycle.",
            },
        ];
    }

    const selectedCompetitors = competitors.filter((competitor) =>
        selectedIds.includes(competitor.id),
    );

    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
            <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => navigate("/recommendations")}>
                    <ArrowLeft data-icon="inline-start" />
                    Back
                </Button>
                <div>
                    <h1 className="font-heading text-3xl font-semibold text-foreground">
                        Side by side
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Pick up to two rivals to line up against {companyLabel}.
                    </p>
                </div>
            </div>

            <RivalPicker
                companyLabel={companyLabel}
                competitors={competitors}
                selectedIds={selectedIds}
                onToggle={handleToggle}
            />

            <div
                className={cn(
                    "grid grid-cols-1 gap-4",
                    selectedCompetitors.length === 1 && "min-[960px]:grid-cols-2",
                    selectedCompetitors.length === 2 && "min-[960px]:grid-cols-3",
                )}
            >
                <CompareColumn name={`${companyLabel} · you`} accent rows={buildRows()} />
                {selectedCompetitors.map((competitor) => (
                    <CompareColumn
                        key={competitor.id}
                        name={competitor.name}
                        rows={buildRows(competitor.name)}
                    />
                ))}
            </div>

            <Verdict companyLabel={companyLabel} selected={selectedCompetitors} />
        </div>
    );
}
