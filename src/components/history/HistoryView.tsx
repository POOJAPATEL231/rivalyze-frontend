import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";

import { HistoryRow } from "@/components/history/HistoryRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_REPORT } from "@/data/report";
import { extractApiErrorMessage } from "@/lib/apiError";
import { getRunStatus, mapApiCompetitor } from "@/services/analyze";
import { getHistory } from "@/services/history";
import { useAppDispatch } from "@/store/hooks";
import {
    setCompanyName,
    setCompetitors,
    setDomain,
    setReport,
    setRunId,
    unlockStep,
} from "@/store/slices/analysisSlice";
import type { AnalysisStep } from "@/types/analysis";
import type { ApiHistoryEntry } from "@/types/api";

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

const PAGE_SIZE = 10;
// API caps limit at 100 and has no offset/page param — fetch the max and
// paginate client-side over the (already small) result set.
const FETCH_LIMIT = 100;
const SEARCH_DEBOUNCE_MS = 300;

export function HistoryView() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [entries, setEntries] = useState<ApiHistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openingJobId, setOpeningJobId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timeout = setTimeout(() => {
            getHistory(search.trim() || undefined, FETCH_LIMIT)
                .then((data) => {
                    setEntries(data);
                    setPage(1);
                })
                .catch((err: unknown) => setError(extractApiErrorMessage(err)))
                .finally(() => setLoading(false));
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timeout);
    }, [search]);

    const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
    const pageEntries = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    async function handleOpen(entry: ApiHistoryEntry) {
        if (openingJobId) return;
        setOpeningJobId(entry.job_id);
        setError(null);
        try {
            const status = await getRunStatus(entry.job_id);
            const competitors = (status.result?.competitors ?? []).map(mapApiCompetitor);
            dispatch(setCompanyName(entry.company));
            dispatch(setDomain(""));
            dispatch(setCompetitors(competitors));
            dispatch(setReport({ ...MOCK_REPORT, generatedAt: entry.created_at }));
            dispatch(setRunId(status.run_id));
            for (const step of ALL_STEPS) dispatch(unlockStep(step));
            navigate("/dashboard");
        } catch (err) {
            setError(extractApiErrorMessage(err));
        } finally {
            setOpeningJobId(null);
        }
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
            <div>
                <h1 className="font-heading text-3xl font-semibold text-foreground">
                    Past analyses
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">Completed runs, newest first.</p>
            </div>

            <Input
                placeholder="Search by company name"
                value={search}
                onChange={(event) => {
                    setSearch(event.target.value);
                    setLoading(true);
                    setError(null);
                }}
                className="max-w-sm"
            />

            {loading && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Loading&hellip;
                </p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {!loading && !error && entries.length === 0 && (
                <p className="text-sm text-muted-foreground">No past runs found.</p>
            )}

            <div className="space-y-3">
                {pageEntries.map((entry) => (
                    <HistoryRow
                        key={entry.job_id}
                        entry={entry}
                        opening={openingJobId === entry.job_id}
                        disabled={openingJobId !== null && openingJobId !== entry.job_id}
                        onOpen={() => handleOpen(entry)}
                    />
                ))}
            </div>

            {!loading && entries.length > PAGE_SIZE && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        Page {page} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
