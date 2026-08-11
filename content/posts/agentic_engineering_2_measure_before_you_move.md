+++
title = "Agentic Engineering in Practice, Part 2: Measure Before You Move"
date = "2026-08-11"
draft = true
series = "Agentic Engineering in Practice"
tags = ["agentic", "hugo", "canvas", "performance"]
+++

*This is Part 2 of [Agentic Engineering in Practice]({{< relref "agentic_engineering_1_setting_the_table" >}}). [Part 1]({{< relref "agentic_engineering_1_setting_the_table" >}}) set up the architecture, the deploy pipeline, and the tooling.*

An agent can generate a lot of code very fast. That's the problem in disguise. The harder problem is knowing which code the page actually needs, because nothing teaches a model about your machine's render budget. The answer, it turns out, is to instrument everything and let the numbers do the arguing.

## Instrument first, then optimize

The first CRT aurora shipped as a single hand-written JavaScript file that painted animated gradient strips onto a `<canvas>`. It looked good. I had no idea how expensive it was. Frames could be dropping and I'd have no way to know.

The fix was to instrument everything. Each animation now carries a **FrameMeter**, a rolling 240-sample window that records how long every animation frame takes to render, exposed as structured data on `window`:

- `window.__auroraMeter`: aurora frame timing
- `window.__particleMeter`: particle field frame timing
- `window.__cursorMeter`: cursor halo and click ripples
- `window.__scanlineMode`: active scanline strategy

Machine-readable JSON instead of DOM scraping, because a bot or a human can read the numbers either way. A configurable perf HUD is a `?perfhud` away on any page.

Once the meter existed, the first optimization was almost boring. Scanlines are a signature CRT effect. The naive version drew up to 720 `fillRect` calls per frame at 4K. The meter said this was the obvious hotspot, so the agent replaced it with a single cached `CanvasPattern` fill. It wasn't about being clever. It was what the numbers pointed at.

## A lab for measuring: microbenchmarks and A/B

Not everything can be measured on the page. Allocation pressure and GC pauses need a cleaner environment.

The particle field is 250 points, each with a drift oscillator, a repel radius around the cursor, and a lazy lerp back home. The naive version allocates several objects per particle per frame. At 60fps that's on the order of **28,800 object allocations per second**, all landing in the garbage collector's lap.

A microbenchmark run with `node --expose-gc` quantified exactly that:

```bash
node --expose-gc bench.mjs
```

The fix was mechanical: `drift`, `repel`, and `particleStyle` now write into caller-provided scratch objects instead of allocating. ~40% faster in the isolated loop, and there's a test proving the refactor didn't change behavior. (That testability safety net is the subject of [Part 3]({{< relref "agentic_engineering_3_making_it_testable" >}}).)

Then there's the A/B angle. Every tunable knob in the aurora is centralized at the top of the config block, bands, render scale, blur, scanline opacity, glitch timing, y-jitter, and **every knob is overridable via URL parameters**:

```
?perfhud=1
?scanlines=rows|pattern
?quality=high|medium|low
?bands=3&segments=20
```

That makes the browser a live experimentation rig: change a parameter, read the frametimes, decide. No rebuild, no redeploy. When we had to choose between two scanline renderers, the numbers settled it. The `rows` strategy measured 0.30ms median / 0.40ms p95 on the desktop GPU, while `pattern` had a ~50ms tail spike. `Rows` became the default, with the measurement cited in the commit.

## Making the harness mainstream

There's a catch with headless A/B testing: the page-level numbers only tell part of the story. My [Playwright](https://playwright.dev) harness (`perf.mjs`) loads a compiled animation in headless Chromium, drains the meter over several warm-up and trial windows, and prints a comparison table. It's what measured the scanline decision above.

The harness started out aurora-only. The other two animations simply had no meter to read, and one of them, `cursor-fx`, parks its animation loop entirely when idle, so it never generates frames to sample. Generalizing it was half instrumentation, half tooling:

1. Give the particle field and cursor-fx their own `FrameMeter`, exposed with the same `window.__*Meter` convention.
2. Let the harness discover the meter from the input filename (`--meter` to override), and add a `--interact` flag that jiggles the pointer so a parked loop wakes up and draws measurable frames.

Now one command measures any of the three animations:

```bash
node perf.mjs --input static/js/particles.js
node perf.mjs --input static/js/cursor-fx.js --interact
node perf.mjs                                # default: aurora scanline A/B
```

Measured on a software renderer, the numbers read: aurora ~0.10ms median, particles ~0.60ms, cursor-fx ~0.00ms when idle. Those absolute figures don't transfer to your GPU, but they catch regressions reliably, and the insert-then-measure loop is what keeps the animations honest.

Headless Chromium falls back to a software GL renderer (SwiftShader by default), so absolute numbers will differ from your desktop GPU for the composite-heavy parts like scanlines. The *relative* comparison between two strategies is still valid for deciding which one to ship.

Next up: [Part 3]({{< relref "agentic_engineering_3_making_it_testable" >}}), on making all of this testable and keeping it that way.