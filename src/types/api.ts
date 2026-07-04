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

export interface ApiAnalyzeRequest {
    company: string;
    domain: string;
    idea: string | null;
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

/** Poll shape for GET /api/v1/runs/{job_id}, polled every 2s. In this
 * vertical slice `result` holds the Discovery `ApiCompetitorSet`. */
export interface ApiRunStatus {
    job_id: string;
    status: "queued" | "running" | "completed" | "failed";
    current_stage: string;
    events: ApiRunEvent[];
    result: ApiCompetitorSet | null;
    lane_stats: Record<string, number>;
    run_id: string | null;
    error: string | null;
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
