# Frontend Implementation Plan

> This plan maps every prototype screen to the existing codebase. Each phase is
> self-contained and produces a working state. Ship phases in order — each depends
> on the one before it.
>
> For project conventions, critical rules, and tech stack, see [CLAUDE.md](../CLAUDE.md).
> This doc is the roadmap — pull it into context only when you're planning or building
> a specific phase.

---

## Architecture Shift: Wizard Flow, Not Sidebar Nav

The prototype is a **progressive-unlock wizard** (steps 01 → 08), not a sidebar-nav dashboard. The current codebase has `AppShell` + `Sidebar` + `Header` for chrome. That layout stays for post-hackathon, but the hackathon build replaces the sidebar nav with a **top step bar** and the body becomes a single-page multi-view flow.

**Key decision:** Use **local state in a single `AnalysisFlow` page** — no router needed. Each step is a component that mounts/unmounts based on a `currentStep` Redux state. This avoids the "first person to wire the router" coordination cost.

---

## Prototype Screen Inventory

| #   | Screen          | Prototype ID     | Core Purpose                                            | Priority     |
| --- | --------------- | ---------------- | ------------------------------------------------------- | ------------ |
| 01  | Brief           | `view-brief`     | Input company/idea, start scan                          | P0           |
| 02  | Discovery       | `view-discovery` | Radar viz, confirm competitor set                       | P0           |
| 03  | Live Run        | `view-run`       | Agent lanes, ledger, telemetry                          | P0           |
| 04  | Dashboard       | `view-dash`      | Exec summary, H2H table, SWOT, sentiment, opportunities | P0           |
| 05  | Recommendations | `view-recs`      | Rec cards + confidence rings + evidence chips           | P0           |
| 06  | Compare         | `view-compare`   | Side-by-side rival columns                              | P1 (stretch) |
| 07  | Workspace       | `view-workspace` | Chat + doc upload + grounded Q&A                        | P1 (stretch) |
| 08  | History         | `view-history`   | Past analyses list                                      | P1           |
| —   | Evidence Drawer | `#drawer`        | Slide-in source viewer (global overlay)                 | P0           |
| —   | Splash          | `.splash`        | Argus branded intro                                     | P2 (polish)  |

---

## Phase 0 — Foundation (do first, blocks everything)

**Goal:** Wire the step-based flow, set up shared state, add missing tokens.

### 0A. New Redux Slice: `analysisSlice.ts`

Location: `src/store/slices/analysisSlice.ts`

This slice owns the entire analysis lifecycle. Follow `uiSlice.ts` pattern exactly.

```
interface AnalysisState {
  currentStep: 'brief' | 'discovery' | 'run' | 'dashboard' | 'recommendations' | 'compare' | 'workspace' | 'history'
  unlockedSteps: string[]
  inputMode: 'company' | 'idea'
  companyName: string
  domain: string
  ideaDescription: string
  competitors: Competitor[]           // reuse src/types/competitor.ts, extend if needed
  runStatus: 'idle' | 'running' | 'done'
  runEvents: RunEvent[]               // ledger entries
  telemetry: Telemetry                // LLM calls, searches, signals, elapsed
  laneStatuses: Record<LaneId, LaneStatus>
  report: Report | null               // populated after run completes
  evidenceDrawer: { open: boolean; evidenceId: string | null }
}
```

New types to add to `src/types/`:

- `analysis.ts` — `RunEvent`, `Telemetry`, `LaneId`, `LaneStatus`, `Report`, `EvidenceItem`, `Source`
- Extend `competitor.ts` — add `category: 'direct' | 'indirect'`, `rationale: string`, `domain: string`
- Extend `recommendation.ts` — add `confidence: number`, `evidenceIds: string[]`, `agentCount: number`

### 0B. Design Tokens — Resolved (done, see `index.css`)

The prototype names four accents (teal/violet/gold/rose) that already exist in the current token set — don't add new hex values for them, map onto what's there:

| Prototype name | Use this instead             | Already-existing utility              |
| -------------- | ---------------------------- | ------------------------------------- |
| `teal`         | `--success`                  | `text-success` / `bg-success`         |
| `violet`       | `--primary` (== `--chart-2`) | `text-primary` / `bg-primary`         |
| `gold`         | `--watch`                    | `text-watch` / `bg-watch`             |
| `rose`         | `--destructive`              | `text-destructive` / `bg-destructive` |

This matches `ScoreBadge`'s existing `STATUS_CONFIG` (`threat`→destructive, `opportunity`→success, `watch`→watch) — the prototype's accent language is just a rename of what's already validated for contrast in both themes.

The one genuinely new thing is the **iris gradient**, added in `:root`:

```css
--iris: linear-gradient(135deg, var(--success) 0%, var(--primary) 52%, var(--watch) 100%);
```

Built from the existing tokens (not raw hex) so it recomputes correctly in dark mode automatically. It's wired into Tailwind via `--background-image-iris: var(--iris)` in `@theme inline`, which generates a `bg-iris` utility. Use it as:

- Headline/stat gradient text: `className="bg-iris bg-clip-text text-transparent"`
- Gradient CTA background: `className="bg-iris"`

Phase 3's agent-lane palette (teal/violet/rose/blue/gold for News/Product/Reviews/Strategist/low-signal) maps the same way, plus `--chart-4` (blue) for Strategist — see the note in Phase 3 below. No new color tokens needed for any of this.

### 0C. Step Bar Component

Location: `src/components/layout/StepBar.tsx`

Replaces sidebar nav for the analysis flow. Reads `currentStep` + `unlockedSteps` from `analysisSlice`.

Step config (hardcode as a const):

```
const STEPS = [
  { id: 'brief',           label: 'Brief',           number: '01' },
  { id: 'discovery',       label: 'Discovery',       number: '02' },
  { id: 'run',             label: 'Live run',        number: '03' },
  { id: 'dashboard',       label: 'Dashboard',       number: '04' },
  { id: 'recommendations', label: 'Recommendations', number: '05' },
  { id: 'compare',         label: 'Compare',         number: '06', stretch: true },
  { id: 'workspace',       label: 'Workspace',       number: '07', stretch: true },
  { id: 'history',         label: 'History',          number: '08' },
]
```

Visual states per step: `active` (current), `done` (unlocked + before current), `locked` (not unlocked), `stretch` (gold "S" badge).

### 0D. Analysis Flow Page

Location: `src/pages/AnalysisFlow.tsx` (default export)

This is the new main page. Replace `<Dashboard/>` in `App.tsx` with `<AnalysisFlow/>`.

```tsx
export default function AnalysisFlow() {
    const step = useAppSelector((s) => s.analysis.currentStep);
    return (
        <>
            <StepBar />
            {step === "brief" && <BriefView />}
            {step === "discovery" && <DiscoveryView />}
            {step === "run" && <LiveRunView />}
            {step === "dashboard" && <DashboardView />}
            {step === "recommendations" && <RecommendationsView />}
            {step === "compare" && <CompareView />}
            {step === "workspace" && <WorkspaceView />}
            {step === "history" && <HistoryView />}
            <EvidenceDrawer />
        </>
    );
}
```

### 0E. Evidence Drawer (global overlay)

Location: `src/components/evidence/EvidenceDrawer.tsx`

Reads `evidenceDrawer.open` + `evidenceDrawer.evidenceId` from `analysisSlice`. Renders a fixed right-side panel (460px max, 92vw on mobile) with scrim backdrop. Evidence data comes from `src/data/evidence.ts`.

Sub-components in `src/components/evidence/`:

- `EvidenceDrawer.tsx` — shell (scrim, slide animation, close on ✕ / scrim click / Escape)
- `SourceCard.tsx` — single source block (name, type badge, date, snippet with left-border accent, URL, agent label)
- `EvidenceChip.tsx` — the `◈ 3 sources` inline button that opens the drawer (reused across ALL views)

### 0F. Mock Data Files

Location: `src/data/`

- `evidence.ts` — all evidence records keyed by ID (`ev-threat`, `ev-clickup-ai`, etc.). Copy the `EVIDENCE` object from prototype, type it properly.
- `competitors.ts` — extend existing with `category`, `rationale`, `domain` fields.
- `runScript.ts` — the scripted run event sequence (`RUN_SCRIPT` array from prototype).
- `compareData.ts` — per-competitor comparison data (`CMP` + `YOU` from prototype).
- `historyData.ts` — past analyses list.

---

## Phase 1 — Brief View (screen 01)

Location: `src/components/brief/BriefView.tsx`

### Layout

Split grid: left copy (55%) + right hero viz (45%). On ≤960px: single column.

### Sub-components in `src/components/brief/`

| Component         | What it does                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `BriefView.tsx`   | Orchestrator — eyebrow, headline, lead text, input card, stats, "How it works"               |
| `InputCard.tsx`   | Mode switch + field inputs + example chips + CTA button                                      |
| `ModeSwitch.tsx`  | Two-button toggle: EXISTING COMPANY / STARTUP IDEA. Active state: teal border + teal bg tint |
| `ExampleChip.tsx` | Clickable pill ("Notion", "Zomato", etc.) — sets input values on click                       |
| `HeroViz.tsx`     | SVG orbital animation: 3 concentric circles, gradient sweep arm rotating, 5 positioned dots  |
| `StatStrip.tsx`   | Row of 3 stats with iris-gradient numbers ("5 specialist AI agents", etc.)                   |
| `HowItWorks.tsx`  | 4-column "how it works" grid + 4-column "built for" audience grid, below the fold            |

### Behavior

- Mode switch toggles between Company fields (name + domain) and Idea field (description textarea)
- Example chips populate Company + Domain inputs on click
- "Start Intelligence Scan" button dispatches: store inputs → `unlockStep('discovery')` → `setStep('discovery')`
- Headline uses iris gradient on "Shape your strategy" via `bg-clip-text` + `text-transparent`
- Stats numbers use same iris gradient technique

### Reuse from existing codebase

- `Button` from `ui/button` for CTAs
- `Input` from `ui/input` for text fields
- `Badge` from `ui/badge` for example chips (or build custom pill with `cva`)

---

## Phase 2 — Discovery View (screen 02)

Location: `src/components/discovery/DiscoveryView.tsx`

### Layout

Split grid: left radar SVG (55%) + right competitor panel (45%).

### Sub-components in `src/components/discovery/`

| Component             | What it does                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------- |
| `DiscoveryView.tsx`   | Back button, title ("Here's who you're up against"), subtitle, grid                          |
| `CompetitorRadar.tsx` | SVG radar: 3 concentric rings, animated sweep arm, positioned competitor nodes               |
| `RadarNode.tsx`       | Single dot + label on radar. Color: teal=direct, violet=indirect. Staggered pop-in animation |
| `CenterNode.tsx`      | Target company at radar center: iris-gradient rounded square + company initial + label       |
| `CompetitorList.tsx`  | Panel with header ("Confirmed competitor set" + count), competitor rows, CTA                 |
| `CompetitorRow.tsx`   | Row: name + category tag (direct/indirect) + rationale + ✕ remove button                     |

### Behavior

- Radar nodes appear with staggered CSS animation (`animation: pop 0.5s forwards`, delay per index)
- Sweep arm rotates continuously: `animation: spin 6s linear infinite`
- ✕ button removes competitor from list and updates count badge ("3 of 4")
- "Deploy the agents" button dispatches: `unlockStep('run')` → `setStep('run')`

### Reuse

- `Card` from `ui/card` for right panel
- `Badge` from `ui/badge` for direct/indirect tags
- `Button` for CTA and remove actions

---

## Phase 3 — Live Run View (screen 03)

Location: `src/components/run/LiveRunView.tsx`

### Layout

Title + subtitle → telemetry row (4 cells) → split grid: left agent lanes + right event ledger → footer with CTA.

### Sub-components in `src/components/run/`

| Component              | What it does                                                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `LiveRunView.tsx`      | Orchestrator                                                                                                                             |
| `TelemetryBar.tsx`     | 4-cell horizontal grid                                                                                                                   |
| `TelemetryCell.tsx`    | Single stat: label (mono, uppercase) + large number + optional sub-detail                                                                |
| `AgentLane.tsx`        | Lane row: icon + name + status subtitle + progress bar + status badge. Visual states: default, running (teal glow border), done (dimmed) |
| `AgentLedger.tsx`      | Scrollable log panel (dark bg, mono font, ~388px height, auto-scroll to bottom)                                                          |
| `LedgerLine.tsx`       | Single entry: timestamp (faint) + `[agent]` (color-coded) + event text                                                                   |
| `LowSignalWarning.tsx` | Gold dashed-border warning when low-signal finding detected                                                                              |

### Run simulation hook: `src/hooks/useRunSimulation.ts`

This custom hook drives the timed simulation using the `RUN_SCRIPT` data:

1. On mount, start interval incrementing `elapsed` every 1000ms
2. For each entry in `RUN_SCRIPT` (`[delay_ms, agent, text, effects]`), schedule a `setTimeout`
3. On fire: dispatch actions to append ledger entry, update telemetry, update lane status
4. Lane progression: QUEUED → RUNNING → DONE. Progress bars use CSS width transition
5. Effect flags: `doneN` (news done), `doneP` (product done), `doneR` (reviews done), `low` (show warning), `startSyn` (synthesis starts), `finish` (run complete)
6. On `finish`: enable "Open the dashboard" button
7. "Skip animation" button: clear all timeouts, fire remaining events immediately

### Agent lane config (5 lanes)

```
Discovery   — icon: ◎  — color: default — always starts as DONE
News        — icon: ▤  — color: teal    — goes QUEUED → RUNNING → DONE
Product     — icon: ⬡  — color: violet  — goes QUEUED → RUNNING → DONE
Reviews     — icon: ❝  — color: rose    — goes QUEUED → RUNNING → DONE
Strategist  — icon: ✦  — color: blue    — starts WAITING → RUNNING → DONE (late start)
```

Per the Phase 0B mapping above: News=`text-success`, Product=`text-primary`, Reviews=`text-destructive`, Strategist=`text-chart-4` (blue already exists as chart-4, no new token needed).

### Agent color mapping for ledger lines

```
[discovery] → gold    [news] → teal    [product] → violet
[reviews]   → rose    [strategist] → blue
```

`AgentLedger` is a fixed-dark panel regardless of app theme (like a terminal), so its label colors should use the **`.dark`-mode chart values** even when the app is in light mode — don't reference the theme-reactive `chart-1..4`/`success`/`watch` utilities directly inside the ledger, since in light mode those resolve to colors tuned for a light background and will wash out on the panel's dark backdrop. Pull the dark-mode hex values as fixed constants scoped to this component, same way a code/syntax-highlighting theme stays independent of the app chrome.

---

## Phase 4 — Dashboard View (screen 04)

Location: `src/components/dashboard-view/DashboardView.tsx`

Use `dashboard-view/` (not existing `dashboard/`) to avoid collision with existing components.

### Layout

Executive summary banner → 2-col grid (H2H table + SWOT) → 2-col grid (sentiment + opportunities) → CTA.

### Sub-components in `src/components/dashboard-view/`

| Component                | What it does                                                                                                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DashboardView.tsx`      | Orchestrator with back button                                                                                                                                                            |
| `ExecSummary.tsx`        | Wide banner: left threat-level block (large gold text + run metadata) + right rows (top threat, biggest opportunity, recommended action). Each row has an evidence chip. Gradient border |
| `HeadToHead.tsx`         | Table: rows = price, AI positioning, recent move, top complaint. Columns = You (teal highlight) + each rival. Cells may contain evidence chips + inline badges (NEW, High risk)          |
| `SwotGrid.tsx`           | 2×2 grid wrapper                                                                                                                                                                         |
| `SwotQuadrant.tsx`       | Single S/W/O/T box: colored label + bullet list. Colors: S=teal, W=rose, O=gold, T=violet                                                                                                |
| `SentimentPanel.tsx`     | Panel with per-rival sentiment rows + explainer footer                                                                                                                                   |
| `SentimentRow.tsx`       | Name (86px) + horizontal bar (color by score: ≥0.65 teal, ≥0.50 gold, <0.50 rose) + label + score                                                                                        |
| `OpportunitiesPanel.tsx` | Numbered opportunity list: bold lead + claim text (clickable for evidence) + evidence chips. Source category chips at bottom                                                             |

### Behavior

- Every claim span dispatches `openEvidence(id)` on click
- `EvidenceChip` components (from Phase 0) appear inline throughout
- Threat level uses `Record<Level, { color, label }>` config pattern (match `ScoreBadge`'s `STATUS_CONFIG`)
- "See the recommendations" CTA advances to next step

### Reuse from existing codebase

- **`ScoreBadge`** — reuse for threat-level and inline badges via `STATUS_CONFIG` pattern
- `Table` from `ui/table` for H2H
- `Card` from `ui/card` for panels
- `Badge` from `ui/badge` for "New" and "High risk" labels

---

## Phase 5 — Recommendations View (screen 05)

Location: `src/components/recommendations/RecommendationsView.tsx`

### Layout

Title + subtitle → 3-column card grid → confidence explanation note → action button row.

### Sub-components in `src/components/recommendations/`

| Component                 | What it does                                                                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RecommendationsView.tsx` | Orchestrator with back button                                                                                                                                          |
| `RecCard.tsx`             | Card: header row (title + confidence ring), body paragraph, evidence chip row, "why" footer (mono text with confidence breakdown)                                      |
| `ConfidenceRing.tsx`      | SVG donut ring (radius 24, stroke-width 5). Animates `stroke-dashoffset` on mount (1s ease). Color: ≥70% teal, ≥55% gold, <55% rose. Percentage number centered inside |
| `ConfidenceNote.tsx`      | Dashed-border explainer: "Why can confidence be 42%?" with formula explanation                                                                                         |

### Behavior

- Confidence rings animate from 0 to final value on mount
- Each card's evidence chips open the drawer
- Footer buttons: Export (PDF/MD), Compare side-by-side, Ask the intelligence, Re-run
- Low-confidence cards (like 42% Slite) visually flagged with rose color — this is intentional, not a bug

### Reuse

- Check existing `ConfidenceMeter` — if it's an SVG donut, extend it. If different, build `ConfidenceRing` fresh
- Check existing `RecommendationCard` — prototype layout is: title+ring header, body, evidence row, why footer. Adapt or build fresh
- `Card` from `ui/card`
- `Button` for action row

---

## Phase 6 — Evidence Drawer Polish

By this phase, the drawer (built in Phase 0) should be wired end-to-end. Verify:

- Clicking any `EvidenceChip` in views 04 and 05 opens the correct evidence
- Drawer shows: claim text in quotes, source cards, confidence formula footer
- Close on ✕, scrim click, or Escape key
- Slide-in animation: `translateX(102%)` → `translateX(0)`, 0.3s cubic-bezier

---

## Phase 7 — Stretch Features (P1, if time permits)

### 7A. Compare View (screen 06)

Location: `src/components/compare/CompareView.tsx`

| Component           | What it does                                                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `CompareView.tsx`   | Orchestrator with back button                                                                                                             |
| `RivalPicker.tsx`   | Pill toggle row. "Notion · you" fixed in teal. Max 2 rivals selectable (oldest deselected if 3rd added)                                   |
| `CompareColumn.tsx` | Card per entity. 6 rows: entry price, AI positioning, recent move, top complaint, sentiment, your angle. Each row can have evidence chips |
| `Verdict.tsx`       | Violet-gradient-bordered summary box. Dynamic text based on which rivals are selected                                                     |

Grid columns adjust dynamically based on selection count.

### 7B. Workspace View (screen 07)

Location: `src/components/workspace/WorkspaceView.tsx`

| Component             | What it does                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| `WorkspaceView.tsx`   | Split grid: left docs (45%) + right chat (55%)                                                            |
| `DocDropzone.tsx`     | Dashed-border upload area. Click adds a mock doc entry                                                    |
| `DocRow.tsx`          | Doc icon + filename + status ("indexed · 14 chunks · 2.1 MB")                                             |
| `ChatBox.tsx`         | Container: scrollable message log + suggestion chips + input bar                                          |
| `ChatMessage.tsx`     | Bubble: user (right-aligned) or AI (left-aligned + citation chips). AI "not found" variant in gold border |
| `SuggestionChips.tsx` | Pre-built question buttons below chat log                                                                 |

Chat is **keyword-matched** for hackathon (regex → canned answers, same as prototype). No match → "not found in sources" message.

### 7C. History View (screen 08)

Location: `src/components/history/HistoryView.tsx`

| Component         | What it does                                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `HistoryView.tsx` | Title + subtitle + row list                                                                                             |
| `HistoryRow.tsx`  | Company name + run metadata + threat badge (HIGH=gold, MEDIUM=violet, LOW=teal) + confidence score + open/cached button |

"Open" on Notion → unlocks all steps + navigates to dashboard. Others show "cached" disabled.

---

## Phase 8 — Polish (P2, final hours)

- **Splash screen:** Full-viewport overlay with Argus logo, iris gradient glow, tagline, stats strip, "Click to enter". Pure CSS animation, dismisses on click
- **Page transitions:** Each view animates in: `translateY(14px)` + `opacity: 0` → normal (0.5s cubic-bezier). Match prototype's `rise` keyframe
- **Responsive:** All grids collapse to single column at ≤960px
- **Reduced motion:** Respect `prefers-reduced-motion` — disable all animations
- **Favicon:** Add `favicon.svg` to `public/` or remove the `<link>` from `index.html`

---

## Target Component File Tree

```
src/components/
├── ui/                          # shadcn — don't touch
├── charts/                      # recharts wrappers — don't touch
├── layout/
│   ├── AppShell.tsx             # existing — keep
│   ├── Header.tsx               # existing — may simplify for wizard flow
│   ├── Sidebar.tsx              # existing — hidden during wizard flow
│   └── StepBar.tsx              # NEW (Phase 0)
│
├── evidence/                    # NEW (Phase 0) — shared across all views
│   ├── EvidenceDrawer.tsx
│   ├── EvidenceChip.tsx
│   └── SourceCard.tsx
│
├── brief/                       # NEW (Phase 1)
│   ├── BriefView.tsx
│   ├── InputCard.tsx
│   ├── ModeSwitch.tsx
│   ├── ExampleChip.tsx
│   ├── HeroViz.tsx
│   ├── StatStrip.tsx
│   └── HowItWorks.tsx
│
├── discovery/                   # NEW (Phase 2)
│   ├── DiscoveryView.tsx
│   ├── CompetitorRadar.tsx
│   ├── RadarNode.tsx
│   ├── CenterNode.tsx
│   ├── CompetitorList.tsx
│   └── CompetitorRow.tsx
│
├── run/                         # NEW (Phase 3)
│   ├── LiveRunView.tsx
│   ├── TelemetryBar.tsx
│   ├── TelemetryCell.tsx
│   ├── AgentLane.tsx
│   ├── AgentLedger.tsx
│   ├── LedgerLine.tsx
│   └── LowSignalWarning.tsx
│
├── dashboard-view/              # NEW (Phase 4)
│   ├── DashboardView.tsx
│   ├── ExecSummary.tsx
│   ├── HeadToHead.tsx
│   ├── SwotGrid.tsx
│   ├── SwotQuadrant.tsx
│   ├── SentimentPanel.tsx
│   ├── SentimentRow.tsx
│   └── OpportunitiesPanel.tsx
│
├── recommendations/             # NEW (Phase 5)
│   ├── RecommendationsView.tsx
│   ├── RecCard.tsx
│   ├── ConfidenceRing.tsx
│   └── ConfidenceNote.tsx
│
├── compare/                     # NEW (Phase 7A, stretch)
│   ├── CompareView.tsx
│   ├── RivalPicker.tsx
│   ├── CompareColumn.tsx
│   └── Verdict.tsx
│
├── workspace/                   # NEW (Phase 7B, stretch)
│   ├── WorkspaceView.tsx
│   ├── DocDropzone.tsx
│   ├── DocRow.tsx
│   ├── ChatBox.tsx
│   ├── ChatMessage.tsx
│   └── SuggestionChips.tsx
│
├── history/                     # NEW (Phase 7C, stretch)
│   ├── HistoryView.tsx
│   └── HistoryRow.tsx
│
└── dashboard/                   # EXISTING — keep, some parts reusable
    ├── CompetitorCard.tsx
    ├── ScoreBadge.tsx
    ├── ConfidenceMeter.tsx
    └── RecommendationCard.tsx
```

---

## New Files Outside Components

```
src/pages/AnalysisFlow.tsx              # NEW (Phase 0) — new main page
src/store/slices/analysisSlice.ts       # NEW (Phase 0)
src/hooks/useRunSimulation.ts           # NEW (Phase 3)
src/types/analysis.ts                   # NEW (Phase 0)
src/data/evidence.ts                    # NEW (Phase 0)
src/data/runScript.ts                   # NEW (Phase 3)
src/data/compareData.ts                 # NEW (Phase 7A)
src/data/historyData.ts                 # NEW (Phase 7C)
```

Existing files to extend (don't replace — add fields):

```
src/types/competitor.ts                 # add category, rationale, domain
src/types/recommendation.ts            # add confidence, evidenceIds, agentCount
src/data/competitors.ts                 # add prototype's competitor data
```

---

## Task Parallelization Guide

After Phase 0 is merged, work can split across parallel tracks:

| Track            | Phases                                | Can start after      | Est. effort    |
| ---------------- | ------------------------------------- | -------------------- | -------------- |
| **Foundation**   | Phase 0 (0A–0F)                       | Immediately          | 1–2 hours      |
| **Input flow**   | Phase 1 (Brief) + Phase 2 (Discovery) | Phase 0 merged       | 2–3 hours      |
| **Run engine**   | Phase 3 (Live Run)                    | Phase 0 merged       | 2–3 hours      |
| **Output views** | Phase 4 (Dashboard) + Phase 5 (Recs)  | Phase 0 merged       | 3–4 hours      |
| **Stretch**      | Phases 7A, 7B, 7C                     | Core (0–5) solid     | 1–2 hours each |
| **Polish**       | Phase 8                               | Everything else done | 1 hour         |

---

## Quick Reference: Prototype CSS → Component

When building a component, find its prototype equivalent:

| Prototype CSS class                                 | React component                                   | Phase |
| --------------------------------------------------- | ------------------------------------------------- | ----- |
| `.brief-wrap`, `.brief-copy`                        | `BriefView`                                       | 1     |
| `.inputcard`, `.modeswitch`, `.field`               | `InputCard`, `ModeSwitch`                         | 1     |
| `.examples .ex`                                     | `ExampleChip`                                     | 1     |
| `.heroviz`, `.sweep`                                | `HeroViz`                                         | 1     |
| `.statstrip .stat`                                  | `StatStrip`                                       | 1     |
| `.howsteps .hstep`, `.audrow .aud`                  | `HowItWorks`                                      | 1     |
| `.radar`, `.rnode`, `.center-node`                  | `CompetitorRadar`, `RadarNode`, `CenterNode`      | 2     |
| `.comp-row`                                         | `CompetitorRow`                                   | 2     |
| `.telemetry .tcell`                                 | `TelemetryBar`, `TelemetryCell`                   | 3     |
| `.lane`, `.lane.running`, `.lane.done`              | `AgentLane`                                       | 3     |
| `.ledger .ln`                                       | `AgentLedger`, `LedgerLine`                       | 3     |
| `.lowsig`                                           | `LowSignalWarning`                                | 3     |
| `.execsum`, `.exr`                                  | `ExecSummary`                                     | 4     |
| `table.h2h`                                         | `HeadToHead`                                      | 4     |
| `.swot .sq`                                         | `SwotGrid`, `SwotQuadrant`                        | 4     |
| `.sentrow`                                          | `SentimentPanel`, `SentimentRow`                  | 4     |
| `.opps li`                                          | `OpportunitiesPanel`                              | 4     |
| `.rec`, `.ring`                                     | `RecCard`, `ConfidenceRing`                       | 5     |
| `.confnote`                                         | `ConfidenceNote`                                  | 5     |
| `.evchip`                                           | `EvidenceChip` (shared, Phase 0)                  | 0     |
| `.drawer`, `.scrim`, `.src`                         | `EvidenceDrawer`, `SourceCard` (shared, Phase 0)  | 0     |
| `.pick`, `.cmp-col`, `.verdict`                     | `RivalPicker`, `CompareColumn`, `Verdict`         | 7A    |
| `.chatbox`, `.msg`, `.dropzone`, `.doc`             | `ChatBox`, `ChatMessage`, `DocDropzone`, `DocRow` | 7B    |
| `.hist-row`, `.tbadge`                              | `HistoryRow`                                      | 7C    |
| `.splash`                                           | Splash screen                                     | 8     |
| `.step`, `.step.active`, `.step.done`, `.step.lock` | `StepBar`                                         | 0     |
