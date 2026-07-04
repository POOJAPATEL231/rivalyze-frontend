# CLAUDE.md — Rivalyze Frontend

> Competitive-intelligence "war room" dashboard. React + Vite + Tailwind v4 + shadcn.
> Everything runs on static mock data today — no backend, no API calls, no routing.

---

## What Exists vs What Doesn't

This distinction matters. Do NOT import from or reference things that are empty scaffolds.

**Working and in use:**

- `src/pages/Dashboard.tsx` — the only real page, demonstrates every established pattern
- `src/components/ui/*` — shadcn primitives (button, badge, card, dialog, input, table, tabs, chart)
- `src/components/charts/*` — thin recharts wrappers (BarChart, LineChart, RadarChart)
- `src/components/dashboard/*` — CompetitorCard, ScoreBadge, ConfidenceMeter, RecommendationCard
- `src/components/layout/*` — AppShell, Header, Sidebar (sidebar nav items are visual-only, no routes)
- `src/store/` — Redux store with one slice (`uiSlice`: theme + sidebarOpen)
- `src/data/*.ts` + `src/types/*.ts` — static mock data and domain types
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `src/index.css` — ALL design tokens (colors, radius, spacing, shadows, fonts)

**Empty scaffolds (installed but not wired):**

- `src/Router/` — empty, `react-router` v8.1 is installed but App.tsx hardcodes `<Dashboard/>`
- `src/services/` — empty, `axios` is installed but no API layer exists, no `.env` file
- `src/hooks/` — empty
- `src/utils/` — empty (distinct from `lib/utils.ts`)
- `src/assets/` — empty
- No test infrastructure (no Vitest, no Testing Library)

---

## Critical Rules

These will break the build, the design system, or other people's work if violated.

**Colors — never hardcode hex/rgb.** Use semantic tokens only: `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`, `bg-primary`, `text-success`, `text-destructive`, `text-watch`. Chart series use `--chart-1` through `--chart-5` exclusively. Per-competitor identity colors come from `src/data/*.ts` via `competitorColor[id]` — never invent a one-off entity color.

**Charts — use the wrappers.** Import from `@/components/charts/*`, never from `recharts` directly.

**shadcn — don't hand-roll.** Need a new primitive? Run `npx shadcn add <component>`. Never hand-build what shadcn provides. Never edit generated `components/ui/*` files for one-off styling — override via `className`/`cn()` or add a proper `cva` variant.

**Redux hooks — use the typed versions.** Import `useAppDispatch` / `useAppSelector` from `@/store/hooks`, never raw `useDispatch`/`useSelector` from react-redux.

**Class merging — always `cn()`.** Import from `@/lib/utils`. Never concatenate className strings.

**Imports — always `@/` alias.** Never relative paths like `../../..`. External packages first, blank line, then `@/` internals.

**Shared files need coordination.** Before modifying `store/`, `lib/utils.ts`, `components/ui/*`, or `index.css`, flag it — these affect every page.

---

## Tech Stack (versions matter)

| Layer       | Tech                                                                  | Version                    | Notes                                                          |
| ----------- | --------------------------------------------------------------------- | -------------------------- | -------------------------------------------------------------- |
| Framework   | React                                                                 | 19.2.6                     |                                                                |
| Language    | TypeScript                                                            | ~6.0.2                     | `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` |
| Build       | Vite                                                                  | 8.0.12                     | Path alias `@/*` → `src/*`                                     |
| Styling     | Tailwind CSS                                                          | 4.3.1                      | CSS-first config in `index.css`, NO `tailwind.config.js`       |
| Components  | shadcn                                                                | 4.12                       | Style: `radix-nova`, built on radix-ui + cva                   |
| State       | Redux Toolkit                                                         | 2.12                       | + react-redux 9.3                                              |
| Routing     | react-router                                                          | 8.1.0                      | Installed, NOT wired                                           |
| HTTP        | axios                                                                 | 1.18                       | Installed, NOT used                                            |
| Charts      | recharts                                                              | 3.8                        | Use through chart wrappers only                                |
| Icons       | lucide-react                                                          |                            |                                                                |
| Fonts       | Space Grotesk (headings), IBM Plex Sans (body), JetBrains Mono (data) | via `@fontsource-variable` |                                                                |
| Linting     | ESLint 10 (flat config) + Prettier 3.8                                |                            | Pre-commit runs Prettier only, NOT ESLint or tsc               |
| Package mgr | npm                                                                   |                            | Do not introduce yarn/pnpm                                     |

---

## Folder Map (current state)

```
src/
├── App.tsx                  # AppShell wrapping <Dashboard/> (no router yet)
├── main.tsx                 # StrictMode + Redux <Provider>
├── index.css                # Design tokens (@theme inline)
├── lib/utils.ts             # cn() — don't touch
│
├── components/
│   ├── ui/                  # shadcn primitives — generated, don't hand-edit
│   ├── charts/              # recharts wrappers — use these, not recharts
│   ├── layout/              # AppShell, Header, Sidebar
│   └── dashboard/           # Feature components (CompetitorCard, ScoreBadge, etc.)
│
├── pages/                   # Route-level. Only Dashboard.tsx exists.
├── Router/                  # EMPTY — route config goes here once routing is wired up
├── store/
│   ├── index.ts             # Redux store setup
│   ├── hooks.ts             # useAppDispatch / useAppSelector
│   └── slices/uiSlice.ts    # theme + sidebarOpen
│
├── types/                   # competitor.ts, recommendation.ts
├── data/                    # Static mock data
├── services/                # EMPTY — future axios calls
├── hooks/                   # EMPTY — future custom hooks
└── utils/                   # EMPTY — future helpers
```

---

## Conventions

**Components:** Named exports (`export function Foo()`), PascalCase filenames. Pages use default export.

**Props:** `interface FooProps { ... }` directly above the component, destructured in the signature. Reusable components take optional `className?: string`, merged via `cn()`.

**Non-component files:** camelCase (`uiSlice.ts`, `utils.ts`).

**Comments:** None by default. A one-line `/** ... */` only when the _why_ isn't obvious. Reference `ConfidenceMeter`, `ScoreBadge`, and the chart wrappers for the bar to match.

**Status/variant mapping:** Use `Record<Status, {...}>` config objects (see `ScoreBadge`'s `STATUS_CONFIG`), not if/else chains.

**Redux slices:** Follow `uiSlice.ts` exactly — `createSlice` with typed `initialState` interface, named action exports, default-export the reducer.

**Fonts:** `font-heading` for headings/nav, default `font-sans` for body, `font-mono` for any numeric value (scores, %, $) — tabular-nums is already enabled.

**Spacing tokens:** Use `h-(--spacing-header)`, `w-(--spacing-sidebar)`, etc. Don't hardcode layout dimensions.

**Radius:** Use the `radius-sm`…`radius-4xl` scale derived from `--radius`. Don't hardcode px.

**Theme:** Dark is primary (default in `index.html`). Light is secondary, toggled via `uiSlice.theme`.

---

## Implementation Roadmap

The hackathon build is a progressive-unlock wizard (Brief → Discovery → Live Run → Dashboard → Recommendations → Compare/Workspace/History), replacing the current sidebar-nav dashboard. Full phase-by-phase specs, component tables, mock data shape, and the prototype CSS → component mapping live in **[docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)** — read that doc before starting work on any wizard step, Redux `analysisSlice`, or the evidence drawer. Don't pull its full contents into context unless you're actively planning or building a specific phase.

---

## How to Run

```bash
npm install
npm run dev          # Vite dev server
npm run build        # tsc -b && vite build (run before merging!)
npm run lint         # ESLint (run before merging!)
npm run preview      # Preview production build
```

Pre-commit only runs Prettier. You must manually run `lint` and `build` before merging.

---

## Known Issues

- `index.html` references `/favicon.svg` but `public/` only has `.gitkeep`
- Sidebar nav items (`Competitors`, `Reports`, `Settings`) are non-functional static placeholders
- No `.env` or `.env.example` — create when first API call is added
- `README.md` is a stub (`# Template`) — this file is the real onboarding doc

---

## Git Workflow

- Branch: `<initials>/<short-task>` (e.g., `ac/phase-0-foundation`, `jd/brief-view`)
- Commits: short, imperative (`add analysis slice`, `wire evidence drawer`, `build brief input card`)
- PR against `main` using the existing template, get at least one 👍 before merging
- Merge, don't force-push — never force-push a shared branch
- Pull `main` frequently — conflicts compound fast in a small shared codebase
- A broken `main` blocks everyone. If `npm run build` fails, don't merge.
