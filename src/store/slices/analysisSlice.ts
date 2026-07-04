import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Competitor } from "@/types/competitor";
import type {
    AnalysisStep,
    InputMode,
    LaneId,
    LaneStatus,
    Report,
    RunEvent,
    RunStatus,
    Telemetry,
} from "@/types/analysis";
import type { ApiReportResponse } from "@/types/api";

interface AnalysisState {
    currentStep: AnalysisStep;
    unlockedSteps: AnalysisStep[];
    inputMode: InputMode;
    companyName: string;
    domain: string;
    ideaDescription: string;
    competitors: Competitor[];
    removedCompetitors: Competitor[];
    jobId: string | null;
    runStatus: RunStatus;
    runEvents: RunEvent[];
    telemetry: Telemetry;
    laneStatuses: Record<LaneId, LaneStatus>;
    report: Report | null;
    runId: string | null;
    /** Cache of the real GET /reports/{run_id} response, keyed by the runId
     * it belongs to — lets a manual revisit to Dashboard reuse it instead of
     * re-fetching. Distinct from `report` above, which is the mock-shaped
     * type still consumed by Recommendations/Compare. */
    apiReport: ApiReportResponse | null;
    apiReportRunId: string | null;
    evidenceDrawer: { open: boolean; evidenceId: string | null };
}

const initialState: AnalysisState = {
    currentStep: "brief",
    // History shows past runs independent of the current session — always
    // reachable, unlike compare/workspace which unlock from Recommendations.
    unlockedSteps: ["brief", "history"],
    inputMode: "company",
    companyName: "",
    domain: "",
    ideaDescription: "",
    competitors: [],
    removedCompetitors: [],
    jobId: null,
    runStatus: "idle",
    runEvents: [],
    telemetry: { elapsedSeconds: 0, llmCalls: 0, searches: 0, signals: 0 },
    laneStatuses: {
        discovery: "queued",
        news: "queued",
        product: "queued",
        reviews: "queued",
        strategist: "waiting",
    },
    report: null,
    runId: null,
    apiReport: null,
    apiReportRunId: null,
    evidenceDrawer: { open: false, evidenceId: null },
};

const analysisSlice = createSlice({
    name: "analysis",
    initialState,
    reducers: {
        setStep(state, action: PayloadAction<AnalysisStep>) {
            state.currentStep = action.payload;
        },
        unlockStep(state, action: PayloadAction<AnalysisStep>) {
            if (!state.unlockedSteps.includes(action.payload)) {
                state.unlockedSteps.push(action.payload);
            }
        },
        setInputMode(state, action: PayloadAction<InputMode>) {
            state.inputMode = action.payload;
        },
        setCompanyName(state, action: PayloadAction<string>) {
            state.companyName = action.payload;
        },
        setDomain(state, action: PayloadAction<string>) {
            state.domain = action.payload;
        },
        setIdeaDescription(state, action: PayloadAction<string>) {
            state.ideaDescription = action.payload;
        },
        setCompetitors(state, action: PayloadAction<Competitor[]>) {
            state.competitors = action.payload;
            state.removedCompetitors = [];
        },
        removeCompetitor(state, action: PayloadAction<string>) {
            const index = state.competitors.findIndex((c) => c.id === action.payload);
            if (index !== -1) {
                state.removedCompetitors.push(state.competitors[index]);
                state.competitors.splice(index, 1);
            }
        },
        restoreCompetitor(state, action: PayloadAction<string>) {
            const index = state.removedCompetitors.findIndex((c) => c.id === action.payload);
            if (index !== -1) {
                state.competitors.push(state.removedCompetitors[index]);
                state.removedCompetitors.splice(index, 1);
            }
        },
        setJobId(state, action: PayloadAction<string | null>) {
            state.jobId = action.payload;
        },
        setRunStatus(state, action: PayloadAction<RunStatus>) {
            state.runStatus = action.payload;
        },
        setRunEvents(state, action: PayloadAction<RunEvent[]>) {
            state.runEvents = action.payload;
        },
        updateTelemetry(state, action: PayloadAction<Partial<Telemetry>>) {
            Object.assign(state.telemetry, action.payload);
        },
        setLaneStatus(state, action: PayloadAction<{ lane: LaneId; status: LaneStatus }>) {
            state.laneStatuses[action.payload.lane] = action.payload.status;
        },
        setReport(state, action: PayloadAction<Report | null>) {
            state.report = action.payload;
        },
        setRunId(state, action: PayloadAction<string | null>) {
            state.runId = action.payload;
        },
        setApiReport(state, action: PayloadAction<{ runId: string; report: ApiReportResponse }>) {
            state.apiReport = action.payload.report;
            state.apiReportRunId = action.payload.runId;
        },
        /** Starting a fresh analysis should always begin clean, not pile a
         * new run on top of a previous one's ledger/telemetry. */
        resetRun(state) {
            state.runStatus = "idle";
            state.runEvents = [];
            state.telemetry = { elapsedSeconds: 0, llmCalls: 0, searches: 0, signals: 0 };
            state.report = null;
            state.runId = null;
            state.apiReport = null;
            state.apiReportRunId = null;
            state.laneStatuses = {
                discovery: "queued",
                news: "queued",
                product: "queued",
                reviews: "queued",
                strategist: "waiting",
            };
        },
        openEvidence(state, action: PayloadAction<string>) {
            state.evidenceDrawer = { open: true, evidenceId: action.payload };
        },
        /** Keep evidenceId while closing so the drawer content doesn't flash
         * empty during the slide-out animation. */
        closeEvidence(state) {
            state.evidenceDrawer.open = false;
        },
    },
});

export const {
    setStep,
    unlockStep,
    setInputMode,
    setCompanyName,
    setDomain,
    setIdeaDescription,
    setCompetitors,
    removeCompetitor,
    restoreCompetitor,
    setJobId,
    setRunStatus,
    setRunEvents,
    updateTelemetry,
    setLaneStatus,
    setReport,
    setRunId,
    setApiReport,
    resetRun,
    openEvidence,
    closeEvidence,
} = analysisSlice.actions;
export default analysisSlice.reducer;
