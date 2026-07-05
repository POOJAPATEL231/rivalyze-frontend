/** Wire types for the Rivalyze backend, matching its OpenAPI schemas
 * exactly. Kept separate from `types/analysis.ts` — several backend names
 * (`RunEvent`, `RunStatus`) collide with existing frontend types used by
 * the Live Run mock simulation. */

export interface ApiSignupRequest {
    email: string;
    password: string;
}

export interface ApiLoginRequest {
    email: string;
    password: string;
}

export interface ApiRefreshRequest {
    refresh_token: string;
}

export interface ApiTokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

/** Not wired anywhere yet — GET /api/v1/auth/me returns this, but nothing
 * in the app currently needs a server round-trip for user info. */
export interface ApiUserPublic {
    user_id: string;
    email: string;
}

export interface ApiAnalyzeCompanyRequest {
    company: string;
    domain: string;
}

export interface ApiAnalyzeIdeaRequest {
    idea: string;
}

export interface ApiAnalyzeResponse {
    job_id: string;
    status: string;
}

export interface ApiCompetitor {
    name: string;
    category: "direct" | "indirect";
    rationale: string;
}

/** Discovery output. Max 4 rivals, never includes the input company. */
export interface ApiCompetitorSet {
    competitors: ApiCompetitor[];
}

export interface ApiRunEvent {
    t: number;
    agent: string;
    msg: string;
}

/** Poll shape for GET /api/v1/runs/{job_id}, polled every 2s.
 *
 * Two-phase pipeline: queued -> running_discovery -> awaiting_confirmation
 * -> confirmed -> running_analysis -> completed | failed. `running` is only
 * for rows written by the earlier single-phase slice. At
 * `awaiting_confirmation`, `result.competitors` is the proposed rival set. */
export interface ApiRunStatus {
    job_id: string;
    status:
        | "queued"
        | "running"
        | "running_discovery"
        | "awaiting_confirmation"
        | "confirmed"
        | "running_analysis"
        | "completed"
        | "failed";
    current_stage: string;
    events: ApiRunEvent[];
    result: ApiCompetitorSet | null;
    lane_stats: Record<string, number>;
    run_id: string | null;
    error: string | null;
}

export interface ApiSwot {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}

export interface ApiSentimentEntry {
    score: number;
    label: string;
}

export interface ApiHeadToHeadRival {
    value: string;
    claim_ref: string | null;
    source_date: string | null;
}

export interface ApiHeadToHeadRow {
    metric: string;
    you: string;
    rivals: Record<string, ApiHeadToHeadRival>;
}

export interface ApiOpportunity {
    text: string;
    evidence_ids?: string[];
    claim_ref: string | null;
}

export interface ApiRecommendation {
    action: string;
    rationale: string;
    confidence: number;
    evidence_ids?: string[];
    claim_ref: string | null;
}

export interface ApiEvidenceSource {
    id: string;
    run_id: string;
    claim_ref: string;
    source_type: string;
    source_name: string;
    url: string;
    snippet: string;
    source_date: string;
    agent: string;
}

export interface ApiClaimEvidenceResponse {
    claim_ref: string;
    sources: ApiEvidenceSource[];
}

/** Deterministic evidence counts for a report — null on degraded runs
 * (synthesis failed) and on reports created before this field existed.
 * `corroboration_rate` is already a 0-100 percent; `avg_confidence` is a
 * 0-1 fraction — don't conflate the two units. */
export interface ApiReportStats {
    evidence_count: number;
    competitors_analyzed: number;
    sources_per_competitor: Record<string, number>;
    source_type_breakdown: Record<string, number>;
    signals_by_type: Record<string, number>;
    competitors_with_complaints: number;
    sentiment_spread: Record<"POSITIVE" | "NEUTRAL" | "NEGATIVE", number>;
    avg_confidence: number | null;
    freshest_signal_days: number | null;
    distinct_sources: number;
    corroboration_rate: number | null;
    uncorroborated_claims: number;
}

/** GET /api/v1/reports/{run_id} response, matching the OpenAPI schema
 * exactly — the schema declares `threat_level` and sentiment `label` as
 * closed enums, but callers should still fall back gracefully on an
 * unrecognized value rather than assume the backend can never change or
 * loosen them. */
export interface ApiReportResponse {
    company: string;
    threat_level: string;
    executive_summary: string;
    swot: ApiSwot;
    sentiment: Record<string, ApiSentimentEntry>;
    head_to_head: ApiHeadToHeadRow[];
    opportunities: ApiOpportunity[];
    recommendations: ApiRecommendation[];
    low_signal_findings: string[];
    analysis_date: string;
    stats: ApiReportStats | null;
}
/** One row of GET /api/v1/history. threat_level/confidence are null for
 * runs completed before the strategist agent produced a report. */
export interface ApiHistoryEntry {
    job_id: string;
    company: string;
    threat_level: string | null;
    confidence: number | null;
    created_at: string;
}

export interface ApiValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
}

/** FastAPI's default error body shape: `detail` is a plain string for most
 * HTTPExceptions (bad credentials, duplicate email, ...) and a
 * `ValidationError[]` specifically for 422s. */
export interface ApiErrorBody {
    detail: string | ApiValidationError[];
}
