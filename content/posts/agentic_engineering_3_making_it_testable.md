+++
title = "Agentic Engineering in Practice, Part 3: Making It Testable"
date = "2026-08-11"
draft = true
series = "Agentic Engineering in Practice"
tags = ["agentic", "hugo", "canvas", "performance", "typescript"]
+++

*This is Part 3 of [Agentic Engineering in Practice]({{< relref "agentic_engineering_1_setting_the_table" >}}). [Part 2]({{< relref "agentic_engineering_2_measure_before_you_move" >}}) covered the instrumentation that tells the agent where to spend its effort.*

Perf measurement answers *where* to change things. Tests answer a harder, sneakier question: after the change, is anything broken? When your collaborator regenerates whole files from scratch on every iteration, you need a safety net that catches behavior drift automatically. That net is the reason this project could afford to keep moving fast.

## The lib/entries split

Canvas animations have a testing problem. jsdom, the DOM environment unit tests use, has no canvas context. Wrap rendering logic directly in `<canvas>` calls and you can't test any of it.

The [TS migration plan](https://github.com/austinatchley/hugo-theme-hello-friend-ng) solved it by splitting every animation in two:

- `src/lib/`: **pure, testable logic**. Spectrum math, particle physics, ring envelopes. No DOM, no canvas.
- `src/entries/`: **thin wiring**. Gets the canvas, starts the rAF loop, calls into `lib/`.

That split bought 49 vitest tests covering hue interpolation, drift/repulsion, and ring lifecycles. It also bought freedom: performance work landed *with tests proving byte-equivalent behavior*, so refactors scared nobody. In [Part 2]({{< relref "agentic_engineering_2_measure_before_you_move" >}}), the allocation win on the particle loop carried a test that proved the output didn't change. That's the deal: measure, change, prove it's still the same animation.

The same separation made the Adobe-style "improve the rendering" temptation safe. When the agent proposed blending tweaks or envelope changes, we could run the tests and see a hard pass/fail on whether the pure math still held, even when the visual result demanded a human eye.

## The seamlessness nobody asked for

A blog has many pages. Vaulting from one post to another means a fresh page load, which means a fresh animation, unless your frame clock knows better.

The aurora persists its state to `localStorage` on `pagehide` and restores it on the next load. The trick that makes it *seamless*: alongside the state, we save a wall-clock `savedAt` timestamp, and on load the animation clock advances by the elapsed real time. You scroll into a post and the aurora is where it logically should have been, not reset to frame zero. The quality tier is persisted too, so a tab that earned a downgrade keeps it.

Persistence sits squarely on the other side of the lib/entries line from the testable logic. The serialization, the wall-clock math, the resume-envelope calculations, those belong in `src/lib/`. The `localStorage` reads and writes stay in the entry so they're exercised against a real browser instead of a stubbed one. Same pattern, applied to a different concern: keep the reasoning testable, keep the plumbing thin.

## The quality gate that makes it all stick

The tests live in the theme repo, but the gate that keeps them green lives in CI. I covered the [GitHub Actions workflows in Part 1]({{< relref "agentic_engineering_1_setting_the_table" >}}): typecheck, lint, prettier, tests, and build run on every push, and a red push refuses to ship. That means the agent can't merge a change that silently breaks the animation math, no matter how confident the commit message sounds.

Between the FrameMeter instrumentation and the 49 tests, the loop is closed: the number that measures a change and the test that protects it are both checked into the repo next to the code that produced them. That's what makes iterative agent work durable instead of a flurry of one-off experiments.

Next up: [Part 4]({{< relref "agentic_engineering_4_working_with_an_agent" >}}), the collaboration part. What it's actually like to work this closely with an agent, including the things it fundamentally can't do.