import { HistoryRow } from "@/components/history/HistoryRow";
import { useNavigate } from "react-router";
import { competitors as seedCompetitors } from "@/data/competitors";
import { HISTORY_ENTRIES, type HistoryEntry } from "@/data/historyData";
import { MOCK_REPORT } from "@/data/report";
import { useAppDispatch } from "@/store/hooks";
import {
    setCompanyName,
    setCompetitors,
    setDomain,
    setReport,
    unlockStep,
} from "@/store/slices/analysisSlice";
import type { AnalysisStep } from "@/types/analysis";

const ALL_STEPS: AnalysisStep[] = [
    "brief",
    "discovery",
    "run",
    "dashboard",
    "recommendations",
    "compare",
    "workspace",
    "history",
];

export function HistoryView() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    function handleOpen(entry: HistoryEntry) {
        dispatch(setCompanyName(entry.companyName));
        dispatch(setDomain(entry.domain));
        dispatch(setCompetitors(seedCompetitors));
        dispatch(setReport({ ...MOCK_REPORT, generatedAt: entry.runDate }));
        for (const step of ALL_STEPS) dispatch(unlockStep(step));
        navigate("/dashboard");
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
            <div>
                <h1 className="font-heading text-3xl font-semibold text-foreground">
                    Past analyses
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Only Notion has a cached run wired up for this demo — the rest are placeholders.
                </p>
            </div>

            <div className="space-y-3">
                {HISTORY_ENTRIES.map((entry) => (
                    <HistoryRow key={entry.id} entry={entry} onOpen={() => handleOpen(entry)} />
                ))}
            </div>
        </div>
    );
}
