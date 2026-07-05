# Rivalyze — Frontend

> Competitive-intelligence **war room**. Give it a company (or a raw startup idea), and a
> team of backend AI agents discovers your rivals, gathers news / pricing / review signals,
> and returns a board-ready, **fully-cited** competitive report — every number traceable to
> a source you can click.

This is the React + Vite web client. It talks to the Rivalyze FastAPI backend
([rivalyze-backend](https://github.com/POOJAPATEL231/rivalyze-backend)) over a two-phase
"start → poll → confirm → report" pipeline.

---

## The experience: a progressive-unlock wizard

```
Brief  →  Discovery  →  Live Run  →  Dashboard  →  Recommendations  →  Compare · Workspace · History
(input)   (approve      (agents     (SWOT, H2H,   (ranked actions)     (deep-dives, chat, past runs)
          rivals)       stream)     stats, …)
```

Each step unlocks the next. The user briefs a company/idea, **reviews and edits the
discovered competitors**, watches the agents run live, then lands on a cited dashboard.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | **React 19** + **Vite 8** |
| Language | **TypeScript 6** (strict: `noUnusedLocals`, `verbatimModuleSyntax`) |
| Styling | **Tailwind CSS v4** (CSS-first — tokens in `src/index.css`, no `tailwind.config.js`) |
| Components | **shadcn** (`radix-nova`, on radix-ui + cva) |
| State | **Redux Toolkit 2** + react-redux 9 |
| Routing | **react-router 8** |
| HTTP | **axios** (JWT bearer + single-flight refresh interceptor) |
| Charts | **recharts 3** (always via `@/components/charts/*` wrappers) |
| Export | **jsPDF** + **html2canvas-pro** (PDF report export) |
| Icons / Fonts | lucide-react · Space Grotesk / IBM Plex Sans / JetBrains Mono |
| Tooling | ESLint 10 (flat) · Prettier 3.8 · Husky (pre-commit: Prettier only) · npm |

---

## Quick start

```bash
# 1. Install
npm install

# 2. Configure the backend URL
cp .env.example .env
# .env → VITE_API_BASE_URL=<your backend base URL>   (default points at the deployed Azure backend)

# 3. Run
npm run dev          # Vite dev server (http://localhost:5173)
```

### Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | `tsc -b && vite build` — **run before merging** |
| `npm run lint` | ESLint — **run before merging** (pre-commit only runs Prettier) |
| `npm run preview` | Serve the production build locally |

> ⚠️ Pre-commit runs **Prettier only**. You must run `npm run lint` and `npm run build`
> yourself before opening a PR — a broken `main` blocks everyone.

---

## Environment

| Var | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the Rivalyze backend (no trailing slash). All API calls in `src/services/*` are relative to it. |

There is no other required config. Auth tokens live in Redux (`auth` slice), not in `.env`.

---

## Project layout (high level)

```
src/
├── pages/            # Route-level screens (AnalysisFlow is the wizard shell)
├── components/       # Feature UIs grouped by step: brief/ discovery/ run/
│                     #   dashboard-view/ recommendations/ compare/ workspace/
│                     #   history/ evidence/ + ui/ (shadcn) + charts/ + layout/
├── services/         # API layer — api.ts (axios+auth), analyze.ts, auth.ts, history.ts
├── hooks/            # useAnalysisRun (the poll engine), useReport
├── store/            # Redux: slices ui / analysis / auth (+ persistence)
├── types/            # api.ts = backend wire types; analysis.ts / competitor.ts = domain
├── Router/           # react-router route table (public / protected)
├── data/             # static demo data (competitors, evidence, recommendations, workspace QA)
└── index.css         # ALL design tokens (colors, radius, spacing, fonts)
```

---

## Docs

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — how it all fits together: routing, the
  wizard, Redux state + persistence, the two-phase backend lifecycle, and known gaps. **Start here.**
- **[CLAUDE.md](CLAUDE.md)** — contributor rules: design-system tokens, shadcn/chart conventions,
  import style, git workflow. Read before writing UI.
- **[docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)** — phase-by-phase build spec for the wizard.

---

## Contributing

- Branch `<initials>/<short-task>`; PR against `main` with at least one 👍.
- Never hardcode colors — use semantic tokens (`bg-background`, `text-muted-foreground`, …).
- Charts via `@/components/charts/*`; classes via `cn()`; imports via the `@/` alias.
- Run `npm run lint` **and** `npm run build` before merging.
