# Win95 Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A static Win95-desktop portfolio for Huynh Thai Duong, deployed on GitHub Pages at `https://tduong04.github.io`.

**Architecture:** A Vite + React + TypeScript single page. All content lives in one typed data module. Window state is a pure reducer (open/close/focus/move) wrapped in a context; the URL hash mirrors the focused window. Win95 look is hand-written CSS, no UI library.

**Tech Stack:** Vite, React 18, TypeScript, Vitest + @testing-library/react + jsdom, plain CSS, GitHub Actions to Pages.

**Spec:** `docs/superpowers/specs/2026-10-31-win95-portfolio-design.md`

## Global Constraints

- Static site only; no backend, analytics, database, sound.
- Repo root is `D:\[github] - projects\TDuong04.github.io`; Vite `base: '/'`.
- **No phone number or home address anywhere** in source, tests fixtures, or built output. No PDF resume.
- Contact email `thaiduong.works@gmail.com`; Tuturuuu and data-engineering work (Spark, Iceberg, lakehouse, ClickHouse, Superset, Dataflow) must not appear.
- Content wording adapted from `https://raw.githubusercontent.com/TDuong04/TDuong04/main/README.md`; invent no facts.
- Keyboard operable (Enter opens, Esc closes focused window), visible focus states, honours `prefers-reduced-motion`; Lighthouse accessibility 90+.
- Boot screen: ~3 s, skippable by click/key, once per session via `sessionStorage`, skipped under reduced motion.
- No Microsoft assets; original or free-licence pixel art and fonts only.
- Phones (≤700px wide): windows full-screen, no drag; Welcome is an icon, not auto-opened.

## Review Focus

1. Unknown or malformed hash (`#/projects/nope`, `#%E0%A4%A`) → desktop loads, no crash, no window.
2. Opening an already-open window focuses it, never duplicates.
3. Dragging a window can't push its title bar fully off-screen.
4. `sessionStorage` throwing (private mode) must not break boot.
5. External links carry `rel="noopener noreferrer"` and `target="_blank"`.

---

## File Structure

```
package.json, vite.config.ts, tsconfig.json, index.html
.github/workflows/deploy.yml
src/main.tsx                      mounts <App/>
src/App.tsx                       boot gate + <Desktop/>
src/content/types.ts              content types
src/content/data.ts               all site content
src/content/data.test.ts
src/wm/windowReducer.ts           pure state logic
src/wm/windowReducer.test.ts
src/wm/route.ts                   hash <-> window id
src/wm/route.test.ts
src/wm/WindowManager.tsx          context + provider + hash sync
src/ui/Desktop.tsx, Icon.tsx, Window.tsx, Taskbar.tsx, StartMenu.tsx, BootScreen.tsx
src/apps/registry.tsx             window id -> title + component
src/apps/Welcome.tsx, Projects.tsx, ProjectDetail.tsx, Experience.tsx, Skills.tsx, Resume.tsx, Contact.tsx
src/styles/win95.css
src/test/setup.ts
```

---

### Task 1: Scaffold, test setup, deploy workflow

**Files:**
- Create: all config files above, `src/main.tsx`, `src/App.tsx` (renders `<h1>Win95</h1>` placeholder), `src/test/setup.ts`, `.gitignore` (node_modules, dist, `.superpowers/`), `.github/workflows/deploy.yml`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: `npm test` (vitest run), `npm run build`, `npm run dev`.

- [ ] **Step 1:** `git init -b main`; scaffold Vite react-ts in place; add vitest, @testing-library/react, @testing-library/jest-dom, jsdom; configure vitest `environment: 'jsdom'`, `setupFiles: ['src/test/setup.ts']`.
- [ ] **Step 2: Write failing test** `App.test.tsx`: `renders without crashing` asserts `screen.getByRole('heading', { name: /win95/i })`.
- [ ] **Step 3:** Run `npm test` → FAIL before App exists, then implement placeholder App → PASS.
- [ ] **Step 4:** Write `deploy.yml`: on push to `main`, `npm ci`, `npm test`, `npm run build`, upload `dist` with `actions/upload-pages-artifact`, deploy with `actions/deploy-pages` (permissions `pages: write`, `id-token: write`).
- [ ] **Step 5:** Run `npm run build` → exits 0. Commit `chore: scaffold vite react ts with vitest and pages workflow`.

### Task 2: Content data

**Files:**
- Create: `src/content/types.ts`, `src/content/data.ts`
- Test: `src/content/data.test.ts`

**Interfaces:**
- Produces:
  - `type Link = { label: string; url: string }`
  - `type Project = { id: string; title: string; period?: string; summary: string; tags: string[]; links: Link[] }`
  - `type Job = { id: string; role: string; org: string; period: string; summary: string }`
  - `type SkillGroup = { name: string; items: string[] }`
  - `export const profile: { name: string; role: string; email: string; github: string; linkedin: string; highlights: string[]; education: string }`
  - `export const projects: Project[]` (order per spec: vital-agent, plantos, can-safety, fish-detection, scootr, devision, rentmate, travista, guess-your-paddy, clock-watch, pyman)
  - `export const jobs: Job[]` (bosch, oucru, naver, neo-culture), `export const skillGroups: SkillGroup[]` (4 groups per spec)

- [ ] **Step 1: Write failing tests** in `data.test.ts`:
  - `project ids are unique and in spec order`
  - `every link url starts with https://`
  - `no phone number anywhere`: `JSON.stringify` of all exports must not match `/\+?\d[\d\s().-]{8,}\d/` (fixtures with years like `2026` do not match since that rule needs ≥10 digits/separators)
  - `forbidden topics absent`: stringified content must not match `/tuturuuu|nova|spark|iceberg|lakehouse|clickhouse|superset|dataflow/i`
  - `profile.email equals thaiduong.works@gmail.com` and `profile.highlights.length === 4`
  - `jobs[0].org` is Bosch Vietnam, `jobs.length === 4`
- [ ] **Step 2:** Run `npm test` → FAIL (module missing).
- [ ] **Step 3:** Fetch the README, write types and data adapted from it. Use the exact numbers there (e.g. OUCRU 11 FastAPI modules, 32.1% → 0%, 81.7% → 97.4%).
- [ ] **Step 4:** Run `npm test` → PASS. Commit `feat: add typed portfolio content`.

### Task 3: Window reducer and hash routing

**Files:**
- Create: `src/wm/windowReducer.ts`, `src/wm/route.ts`, `src/wm/WindowManager.tsx`
- Test: `src/wm/windowReducer.test.ts`, `src/wm/route.test.ts`

**Interfaces:**
- Produces:
  - `type WinState = { id: string; x: number; y: number; z: number; minimized: boolean }`
  - `type WmState = { windows: WinState[]; topZ: number }`
  - `type WmAction = { type: 'open'; id: string } | { type: 'close'; id: string } | { type: 'focus'; id: string } | { type: 'move'; id: string; x: number; y: number; viewport: { w: number; h: number } } | { type: 'toggleMinimize'; id: string }`
  - `windowReducer(state: WmState, action: WmAction): WmState`, `initialWm: WmState`
  - `parseHash(hash: string): string | null` (`#/projects/vital-agent` → `projects/vital-agent`; invalid/malformed → `null`, never throws)
  - `toHash(id: string | null): string`
  - `useWindowManager(): { state: WmState; dispatch: React.Dispatch<WmAction>; focusedId: string | null }`; `<WindowManager>` provider syncs `location.hash` ↔ focused window on load and on `hashchange`.

- [ ] **Step 1: Write failing tests:** `open adds a window at highest z`; `open on an existing id focuses instead of duplicating`; `close removes and leaves others`; `focus raises z above all`; `move clamps so title bar stays on screen` (x/y outside viewport clamp so at least 40px of the title bar stays visible); `toggleMinimize flips minimized`; `parseHash returns null for #/projects/nope-style garbage handled by caller, malformed percent-encoding returns null`; `toHash(null) returns '#/'`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement reducer, route helpers, provider (unknown ids from the hash are ignored by validating against the registry ids passed as a prop). **Step 4:** Run → PASS. Commit `feat: window manager reducer and hash routing`.

### Task 4: Win95 shell

**Files:**
- Create: `src/ui/Desktop.tsx`, `Icon.tsx`, `Window.tsx`, `Taskbar.tsx`, `StartMenu.tsx`, `src/styles/win95.css`; modify `src/App.tsx`
- Test: `src/ui/Desktop.test.tsx`

**Interfaces:**
- Consumes: `useWindowManager` (Task 3).
- Produces: `Icon` props `{ id: string; label: string; glyph: string }` (opens `id` on double-click, on Enter, or single tap when `(pointer: coarse)`); `Window` props `{ id: string; title: string; children: React.ReactNode }` (draggable by title bar via pointer events, close button, `Esc` closes when focused, `role="dialog"` with `aria-label`); `Taskbar` (Start button, one button per open window, `HH:MM` clock); `StartMenu` (same sections as icons).
- Styling: teal `#008080` desktop, `#c0c0c0` surfaces, outset/inset 2px borders, title bar gradient `#000080` → `#1084d0`; `@media (max-width: 700px)` windows `position: fixed; inset: 0 0 28px 0`, drag disabled.

- [ ] **Step 1: Failing tests:** `double-clicking an icon opens its window`; `opening the same icon twice leaves one window`; `Escape closes the focused window`; `taskbar shows a button per open window and clicking it focuses`; `Start menu lists every icon label`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement components and CSS. **Step 4:** Run → PASS. Commit `feat: win95 desktop shell`.

### Task 5: App windows

**Files:**
- Create: `src/apps/registry.tsx`, `Welcome.tsx`, `Projects.tsx`, `ProjectDetail.tsx`, `Experience.tsx`, `Skills.tsx`, `Resume.tsx`, `Contact.tsx`; modify `Desktop.tsx` to read the registry
- Test: `src/apps/apps.test.tsx`

**Interfaces:**
- Consumes: content (Task 2), window manager (Task 3).
- Produces: `registry: { id: string; title: string; glyph: string; Component: React.FC; showIcon: boolean }[]` for `welcome`, `projects`, `experience`, `skills`, `resume`, `contact`; project detail windows use ids `projects/<project.id>` and are resolved dynamically. `ExternalLink` helper renders `target="_blank" rel="noopener noreferrer"`.
- Behaviour: Welcome auto-opens on desktop widths (>700px) after boot; Projects lists each project, clicking opens its detail window; Resume is text only (education, jobs, highlights, links), no PDF link; Contact shows email, GitHub, LinkedIn only.

- [ ] **Step 1: Failing tests:** `projects window lists 11 projects in order`; `clicking a project opens projects/<id> detail with its links`; `all external links have rel noopener noreferrer`; `resume window contains no tel: link and no pdf link`; `contact shows exactly email, github, linkedin`; `welcome shows 4 highlights`; `hash #/projects/vital-agent opens that detail on load`; `hash #/projects/nope opens nothing and does not throw`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS. Commit `feat: portfolio app windows`.

### Task 6: Boot screen

**Files:**
- Create: `src/ui/BootScreen.tsx`; modify `src/App.tsx`
- Test: `src/ui/BootScreen.test.tsx`

**Interfaces:**
- Produces: `BootScreen` props `{ onDone: () => void }`; `shouldBoot(): boolean` (false if `sessionStorage` flag set, or `matchMedia('(prefers-reduced-motion: reduce)').matches`, or storage throws → treated as "boot once, don't crash"); `markBooted(): void` (swallows storage errors).

- [ ] **Step 1: Failing tests (fake timers):** `calls onDone after about 3 seconds`; `click skips immediately`; `any keydown skips`; `shouldBoot is false after markBooted`; `shouldBoot is false under reduced motion`; `shouldBoot and markBooted do not throw when sessionStorage throws`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement BIOS-style text lines revealed in sequence, then a "Starting Windows 95" progress bar. **Step 4:** Run → PASS. Commit `feat: skippable boot screen`.

### Task 7: Meta, accessibility, mobile pass, release check

**Files:**
- Modify: `index.html` (title, description, Open Graph tags, favicon), `win95.css` (focus outlines, contrast, reduced-motion), as needed
- Test: `src/a11y.test.tsx`

- [ ] **Step 1: Failing tests:** `index.html has title, meta description and og:title`; `every icon is keyboard focusable and activates on Enter`; `focus-visible styles exist in win95.css`.
- [ ] **Step 2:** Run → FAIL; implement; run → PASS.
- [ ] **Step 3:** Run `npm run build`; grep `dist/` for the phone-number regex from Task 2 and for `tuturuuu|spark|iceberg`; expect no matches.
- [ ] **Step 4:** Run `npm run dev`, load `http://localhost:5173` at desktop and 390px widths and confirm: boot → desktop → Welcome opens; open Projects → Vital Agent; mobile windows full-screen. Report anything not verified.
- [ ] **Step 5:** Commit `feat: meta tags, accessibility and mobile polish`.
- [ ] **Step 6 (needs owner OK, outward-facing):** create GitHub repo `TDuong04/TDuong04.github.io`, push `main`, enable Pages source "GitHub Actions". Do not do this step without asking.

---

## Self-review notes

- Spec coverage: layout A (T4–5), boot (T6), text resume/no phone (T2, T5, T7), stack and Pages (T1), Welcome/deep-link/OG calls (T3, T5, T7), mobile (T4, T7), accessibility (T4, T7), omissions (T2).
- Types used across tasks (`WmAction`, `registry`, `Project`) match their definitions.
