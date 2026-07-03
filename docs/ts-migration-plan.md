# TypeScript Migration Plan — Theme JS Modules

Status: **implemented** (2026-04-28)
Owner: Austin
Scope decided: animation modules + `main.js`/`menu.js`; `prism.js` stays vendored JS.
Toolchain decided: esbuild (bundle/watch) + `tsc --noEmit` (typecheck) + vitest/jsdom (tests).
Artifact policy decided: built JS is committed to the theme repo; CI stays Hugo-only.

## Goals

- Port hand-written theme JS to TypeScript with strict typing.
- Separate pure logic from DOM/canvas wiring so the math is unit-testable
  (also unblocks the perf-audit item in `TODO.md`).
- Fast local loop: TS watcher + `hugo server` with live reload.
- Zero changes to the deploy pipeline (`deploy.yml` installs Hugo only).

## Non-Goals

- Porting `prism.js` (vendored third-party).
- Changing visual behavior. Output must be pixel/behavior-identical.
- Adding a JS runtime dependency to production pages (output stays dependency-free IIFEs).

## Current State

| File | Lines | Loaded via | Pages |
| ---- | ----- | ---------- | ----- |
| `static/js/crt-aurora.js` | 172 | `extra-head.html` `<script defer>` | home |
| `static/js/particles.js` | 172 | `extra-head.html` `<script defer>` | home |
| `static/js/cursor-fx.js` | 121 | `extra-head.html` `<script defer>` | all |
| `assets/js/main.js` | 7 | Hugo Pipes concat+minify+fingerprint (`javascript.html`) | all |
| `assets/js/menu.js` | 22 | Hugo Pipes (same bundle) | all |
| `assets/js/prism.js` | 90 | Hugo Pipes (same bundle) — **not ported** | all |

## Target Layout (inside `themes/hello-friend-ng/`)

```
src/
  lib/                     # pure, testable logic (no DOM access)
    math.ts                # lerp, clamp, oscillators
    spectrum.ts            # SPECTRUM stops + sampleSpectrum()
    particles-core.ts      # drift/repulsion/return physics
    rings.ts               # ring phase/alpha/hue math, ripple lifecycle
  entries/                 # thin DOM/canvas wiring, one per output file
    crt-aurora.ts          # -> static/js/crt-aurora.js
    particles.ts           # -> static/js/particles.js
    cursor-fx.ts           # -> static/js/cursor-fx.js
    main.ts                # -> assets/js/main.js
    menu.ts                # -> assets/js/menu.js
  test/
    *.test.ts              # vitest, jsdom environment
package.json
tsconfig.json
build.mjs                  # esbuild script (build + --watch flag)
```

Key constraints honored:

- Hugo templates cannot hold inline JS (`{}` is Go template syntax), so
  compiled files land exactly where the current files live. No template
  changes required.
- `main.js`/`menu.js` outputs keep their `assets/js/` paths and names so the
  Hugo Pipes bundle in `javascript.html` (concat with `prism.js`, minify,
  fingerprint) continues to work untouched.
- Outputs are IIFE format, ES2020 target, with a `// GENERATED from src/ —
  do not edit` banner.

## Toolchain

- **esbuild**: five entry points, `format: iife`, `target: es2020`,
  no minification for `static/js` outputs (Hugo `--minify` and the Pipes
  bundle handle that), sourcemaps off in committed output.
- **typecheck**: `tsc --noEmit` with `strict: true`, `lib: ["ES2020", "DOM"]`.
- **vitest**: jsdom environment. Canvas contexts are not implemented in
  jsdom — this is why pure logic lives in `src/lib/` and gets tested
  directly; entry files get smoke tests only (element injection, listener
  registration) with a stubbed `getContext`.

### npm scripts (theme `package.json`)

| Script | Command | Purpose |
| ------ | ------- | ------- |
| `build` | `node build.mjs` | one-shot compile of all entries |
| `watch` | `node build.mjs --watch` | rebuild on change |
| `test` | `vitest run` | unit tests |
| `test:watch` | `vitest` | test watch mode |
| `typecheck` | `tsc --noEmit` | strict type checking |
| `check` | typecheck + test + build | pre-commit gate |

### Dev loop (main repo)

`scripts/run_local.sh` gains an optional TS watch: run esbuild `--watch`
in the theme (background) + `hugo server -D`. Hugo watches `static/` and
`assets/`, so esbuild writes trigger browser live reload automatically.

## Migration Steps

1. **Scaffold** — `package.json`, `tsconfig.json`, `build.mjs`, vitest
   config, `.gitignore` (`node_modules/`) in the theme submodule.
2. **Port `cursor-fx.js`** (smallest, loads on all pages). Extract lerp +
   ring/ripple math to `lib/`. Verify byte-equivalent behavior manually.
3. **Port `particles.js`**. Extract physics to `lib/particles-core.ts`.
4. **Port `crt-aurora.js`**. Extract `sampleSpectrum` + band math to
   `lib/spectrum.ts`.
5. **Port `main.js` + `menu.js`** into `entries/`, output to `assets/js/`.
6. **Tests** — unit-test `lib/` modules (spectrum interpolation/wrapping,
   lerp, particle repulsion radius/clamping, ring phase/alpha/hue, ripple
   expiry). Smoke-test entries under jsdom.
7. **Wire dev loop** — update `scripts/run_local.sh`; document the
   `npm run check` gate in `CLAUDE.md` theme-workflow section.
8. **Docs cleanup** — update `docs/crt-aurora-animation.md` file table to
   point at `src/` sources; note generated-file policy.

Each step ends with: `npm run check` green + `hugo` builds + manual visual
check on `hugo server`.

## Verification Checklist (per step and final)

- [ ] `npm run typecheck` clean
- [ ] `npm run test` green
- [ ] `npm run build` produces committed outputs with banner
- [ ] `hugo` builds without errors
- [ ] Home page: aurora + particles + cursor FX visually unchanged
- [ ] Non-home page: cursor FX only, no console errors
- [ ] Halo does not appear at top-left on load (regression check for the
      recent `translate(-9999px)` fix — carry it into the TS port)

## Risks & Gotchas

- **Generated-file drift**: someone edits `static/js/*.js` directly and the
  edit is clobbered by the next build. Mitigations: banner comment, docs,
  and (optional follow-up) a CI freshness check that rebuilds and diffs.
- **Hugo Pipes bundle**: `javascript.html` concats `main.js + menu.js +
  prism.js`. Output must remain plain ES2020 script (no `export`), or the
  concat bundle breaks. esbuild IIFE format guarantees this.
- **jsdom has no canvas**: keep all `ctx.*` calls in entry files; never in
  `lib/`. If deeper render tests are wanted later, add `vitest-canvas-mock`
  as a follow-up.
- **Submodule flow**: all of this lives in the theme fork. Commit sequence
  per CLAUDE.md: commit in `themes/hello-friend-ng`, push, then bump the
  submodule ref in the main repo.
- **Behavior parity**: the port is 1:1 — no refactors of timing constants,
  blend modes, or z-indices while porting. Perf optimizations from
  `TODO.md` (gradient caching) come after the port, behind tests.

## Follow-Ups (out of scope)

- CI freshness check for generated JS.
- Perf audit + gradient caching (`TODO.md` items) on top of `lib/` modules.
- Consider porting the SCSS build or `prism.js` replacement later.
