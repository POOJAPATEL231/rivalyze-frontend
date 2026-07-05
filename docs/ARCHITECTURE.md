# Architecture & Onboarding — Rivalyze Frontend

How the app fits together end to end: routing → the wizard → Redux state → the two-phase
backend lifecycle → the API layer. Read this once before touching cross-cutting code
(`Router/`, `store/`, `services/`, `hooks/useAnalysisRun`).

> For **UI/design-system rules** (color tokens, shadcn, chart wrappers, import style) see
> [CLAUDE.md](../CLAUDE.md). This doc is about *structure and data flow*, not styling.

---

## 1. The big picture

The app is a **single progressive-unlock wizard**. A user briefs a company or idea; the
backend runs a multi-agent pipeline; the frontend drives it with one continuous poll loop
and reveals each step as it unlocks.

```
                 ┌─────────── one <AnalysisFlow> shell, one poll loop ───────────┐
   Splash / →  Brief  →  Discovery+Run  →  Dashboard  →  Recommendations  →  Compare
   Landing       │        (merged live      (cited        (ranked            Workspace
                 │         screen)           report)       actions)          History
                 │
   Auth: Signup / Login  (JWT access + refresh, auto-refresh on 401)
```

Every protected route renders the **same** `AnalysisFlow` component; the *step* is derived
from the URL and gated by `analysis.unlockedSteps`.

---

## 2. Routing (`src/Router/index.tsx`)

`react-router` v8, `BrowserRouter`. Three access tiers:

| Route(s) | Guard | Renders |
|---|---|---|
| `/login`, `/signup` | `PublicRoute` (redirects away if already authed) | `Login` / `Signup` |
| `/` | — | `Splash` landing (redirects to `/brief` if authed) |
| `/guide` | — (public) | `Guide` |
| `/brief` `/discovery` `/run` `/dashboard` `/recommendations` `/compare` `/workspace` `/history` | `ProtectedRoute` | **all render `AnalysisFlow`** |

`AnalysisFlow` (`src/pages/AnalysisFlow.tsx`) maps the URL step → a view component and syncs
it with Redux `currentStep`:

```
brief → BriefView   discovery|run → DiscoveryRunView   dashboard → DashboardView
recommendations → RecommendationsView   compare → CompareView   workspace → WorkspaceView   history → HistoryView
```

Note: **`discovery` and `run` render the same merged `DiscoveryRunView`** — it owns the whole
`running_discovery → completed` lifecycle in one screen. Steps the user hasn't unlocked
redirect back; direct/stale links still resolve.

---

## 3. State (`src/store/`) — Redux Toolkit, 3 slices

| Slice | Holds | Persistence |
|---|---|---|
| **`ui`** | `theme`, `sidebarOpen` | **localStorage** (`ui_state`) — survives across sessions |
| **`analysis`** | the whole wizard: `currentStep`, `unlockedSteps`, `runStatus`, `competitors`, run `events`, `telemetry`, `runId`, `evidenceDrawer`, and the cached live report (`apiReport` + `apiReportRunId`) | **sessionStorage** (`analysis_state`) — survives a refresh mid-run, clears when the tab closes. The evidence-drawer open flag is dropped on rehydrate. |
| **`auth`** | `accessToken`, `refreshToken`, `isAuthenticated`, `user` | in-memory (rehydrated by the auth flow) |

Rules of the road:
- Use the **typed hooks** `useAppDispatch` / `useAppSelector` from `@/store/hooks` — never raw react-redux.
- Slices follow `uiSlice.ts` exactly (typed `initialState`, named action exports, default-export reducer).
- `store/index.ts` wires persistence via `store.subscribe` — don't add ad-hoc `localStorage` writes elsewhere.

---

## 4. The heart: the two-phase analysis lifecycle

The backend pipeline is **two-phase with a human approval gate**. The frontend drives it from
one hook — **`src/hooks/useAnalysisRun.ts`** — with a single continuous poll loop.

```
POST /analyze/company | /analyze/idea            → { job_id, status:"running_discovery" }
   │
   ▼  poll GET /runs/{job_id} every 2s  (pollDiscovery)
running_discovery … → status:"awaiting_confirmation"
   │                     result.competitors = the PROPOSED rivals  ← user reviews & edits
   ▼  POST /runs/{job_id}/confirm { confirmed_competitors:[…] }     ← confirm(competitors)
confirmed → running_analysis
   │
   ▼  poll GET /runs/{job_id} every 2s  (pollAnalysis)
completed   → run_id is now set
   │
   ▼  GET /reports/{run_id}   → the full cited CompetitiveReport → Dashboard
```

Key behaviours baked into `useAnalysisRun`:
- **One growing event ledger** across both phases (discovery + analysis events share the array server-side) — no reset at the confirm boundary; only the poll target changes.
- **Mode is classified once from the store**, not from how you navigated: `fresh` (start the loop), `resume` (job still running server-side — keep polling), `static` (done / awaiting confirmation — render from store, no network). So a step-bar click, Back button, typed URL, or page refresh all land on correct behaviour.
- **Soft timeouts**: discovery ~50s (`MAX_DISCOVERY_POLLS`), analysis ~3min (`MAX_ANALYSIS_POLLS`) → `phase:"failed"` with a friendly message.
- **Telemetry**: `lane_stats.{llm_calls,searches,signals_found}` → the live TelemetryBar. `llm_calls` is already the backend's own cross-provider sum — don't re-total.

Returned API: `{ phase, error, confirm }` where `phase ∈ discovering | awaiting_confirmation | confirming | analyzing | done | failed`.

**Fetching the report is a separate concern.** `useAnalysisRun` only drives the run to `done`
and stores `run_id`. The **`useReport(run_id)`** hook (`src/hooks/useReport.ts`) then fetches
`GET /reports/{run_id}` **once** and caches it in `analysis.apiReport` (keyed by `apiReportRunId`),
so Dashboard, Recommendations, and Compare share one fetch per run instead of racing. There is
**no mock report** — the dashboard renders the live backend `CompetitiveReport`.

---

## 5. API layer (`src/services/`)

| File | Responsibility |
|---|---|
| **`api.ts`** | The axios client. `baseURL = VITE_API_BASE_URL`. Request interceptor injects `Authorization: Bearer <accessToken>`. Response interceptor does a **single-flight 401 refresh** (one `/auth/refresh` for a burst of concurrent 401s, since the backend rotates the refresh token), then retries; logs out on failure. |
| **`analyze.ts`** | `startCompanyAnalysis`, `startIdeaAnalysis`, `getRunStatus`, `confirmRun`, `getReport`, `exportReport`, and `mapApiCompetitor` (wire → domain). |
| **`auth.ts`** | signup / login / refresh. |
| **`history.ts`** | past completed runs (`GET /history`). |

**Backend endpoint contract** (see the backend repo for full schemas):

| Method / path | Purpose |
|---|---|
| `POST /api/v1/analyze/company` · `/analyze/idea` | start Phase 1 → `{ job_id, status }` |
| `GET /api/v1/runs/{job_id}` | poll shape (`status`, `events`, `result.competitors`, `lane_stats`, `run_id`) |
| `POST /api/v1/runs/{job_id}/confirm` | launch Phase 2 with the edited rival list |
| `GET /api/v1/reports/{run_id}` | full `CompetitiveReport` (SWOT, head-to-head, recs, `stats`) |
| `GET /api/v1/reports/{run_id}/export?format=` | PDF/markdown export blob |
| `GET /api/v1/evidence/{claim_ref}` · `/evidence-refs?ids=` | the citation drawer |
| `POST /api/v1/auth/signup` · `/login` · `/refresh` | auth |
| `GET /api/v1/history` | past runs |

---

## 6. Types (`src/types/`)

- **`api.ts`** — backend **wire types**, mirroring the OpenAPI schema exactly (`ApiRunStatus`,
  `ApiReportResponse`, `ApiReportStats`, `ApiCompetitor`, …). Deliberately separate from domain
  types because names like `RunStatus`/`RunEvent` collide.
- **`analysis.ts`, `competitor.ts`, `recommendation.ts`, `auth.ts`** — the frontend **domain**
  shapes the components render. `mapApiCompetitor` / `mapEvent` / `mapTelemetry` convert wire → domain.

> Unit note in `ApiReportStats`: **`corroboration_rate` is a 0–100 percent**, but
> **`avg_confidence` is a 0–1 fraction** — don't conflate the two when rendering.

---

## 7. Component map (by wizard step)

```
components/
├── auth/         ProtectedRoute, PublicRoute, TestimonialCarousel
├── brief/        BriefView, InputCard, ModeSwitch (company|idea), ExampleChip, HeroViz, StatStrip
├── discovery/    DiscoveryRunView (merged live screen), CompetitorList/Row, CompetitorRadar, RadarLoader
├── run/          RunPanel, AgentLane, AgentLedger, TelemetryBar/Cell   (live agent stream)
├── dashboard-view/ DashboardView, ExecSummary, SwotGrid, HeadToHead, SentimentPanel, OpportunitiesPanel, StatsStrip
├── recommendations/ RecommendationsView, RecCard, ConfidenceRing/Note
├── compare/      CompareView, CompareColumn, RivalPicker, Verdict
├── workspace/    WorkspaceView, ChatBox, ChatMessage, DocDropzone, SuggestionChips
├── history/      HistoryView, HistoryRow
├── evidence/     EvidenceDrawer, EvidenceChip, SourceCard   (the "click any claim to verify" drawer)
├── landing/      marketing splash sections
├── charts/       BarChart, LineChart, RadarChart   (recharts wrappers — use these only)
├── layout/       AppShell, Header, Sidebar, StepBar
└── ui/           shadcn primitives (generated — don't hand-edit)
```

---

## 8. Notes & gotchas

- **`report.stats` can be `null`** — on degraded runs (synthesis failed) and on reports created
  before the field existed. `StatsStrip` must render **nothing** in that case (not zeros). And the
  units differ: **`corroboration_rate` is a 0–100 percent**, **`avg_confidence` is a 0–1 fraction**.
- **Idea intake** (`ApiAnalyzeIdeaRequest`) now carries optional structured fields — `industry`,
  `target_geography`, `target_customer`, `business_model`, `stage`. They're optional; sending
  `target_geography` in particular makes idea-mode discovery return same-market rivals. Surface
  them via the "add details" affordance in `BriefView`.
- **CLAUDE.md is partly stale** — it predates `services/`, `hooks/`, `Router/`, and the auth slice
  (it calls them "empty scaffolds"). Trust *this* doc for structure; trust CLAUDE.md for the
  design-system rules.

---

## 9. Where to start (new contributor)

1. `npm install`, copy `.env.example` → `.env`, `npm run dev`.
2. Skim **[CLAUDE.md](../CLAUDE.md)** for the non-negotiable UI rules (tokens, shadcn, `cn()`, `@/`).
3. Read `hooks/useAnalysisRun.ts` (the run poll loop), `hooks/useReport.ts` (report fetch), and `services/analyze.ts` — that's the whole backend dance.
4. Pick a step folder under `components/<step>/` and match the patterns in a sibling component.
5. `npm run lint && npm run build` before every PR.
