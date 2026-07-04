import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

import { CompareColumn, type CompareRow } from "@/components/compare/CompareColumn";
import { RivalPicker } from "@/components/compare/RivalPicker";
import { Verdict } from "@/components/compare/Verdict";
import { Button } from "@/components/ui/button";
import { YOUR_ANGLE } from "@/data/compareData";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import type { Report } from "@/types/analysis";

const H2H_ROWS: { key: keyof Report["headToHead"]; label: string }[] = [
    { key: "price", label: "Entry price" },
    { key: "aiPositioning", label: "AI positioning" },
    { key: "recentMove", label: "Recent move" },
    { key: "topComplaint", label: "Top complaint" },
];

export function CompareView() {
    const navigate = useNavigate();
    const report = useAppSelector((state) => state.analysis.report);
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

    if (!report) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-muted-foreground">
                Nothing to compare yet — run the agents first.
            </div>
        );
    }

    function buildRows(competitorId?: string): CompareRow[] {
        const h2hRows = H2H_ROWS.map(({ key, label }) => {
            const data = report!.headToHead[key];
            const cell = competitorId ? data.rivals[competitorId] : data.you;
            return { label, text: cell.text, evidenceId: cell.evidenceId };
        });

        const sentimentEntry = competitorId
            ? report!.sentiment.find((entry) => entry.competitorId === competitorId)
            : undefined;

        return [
            ...h2hRows,
            {
                label: "Sentiment",
                text: competitorId
                    ? sentimentEntry
                        ? `${sentimentEntry.label} (${sentimentEntry.score.toFixed(2)})`
                        : "No data yet"
                    : "Building your sentiment baseline — check back after your first review cycle.",
            },
            {
                label: "Your angle",
                text: competitorId
                    ? (YOUR_ANGLE[competitorId] ?? "No counter-angle logged yet.")
                    : "Ship evidence-linked recommendations faster than rivals can track competitive moves.",
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
                        rows={buildRows(competitor.id)}
                    />
                ))}
            </div>

            <Verdict companyLabel={companyLabel} selected={selectedCompetitors} />
        </div>
    );
}
