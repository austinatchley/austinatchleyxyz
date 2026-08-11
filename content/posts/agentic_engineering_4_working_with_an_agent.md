+++
title = "Agentic Engineering in Practice, Part 4: Working With an Agent"
date = "2026-08-11"
draft = true
series = "Agentic Engineering in Practice"
tags = ["agentic", "hugo", "canvas", "performance"]
+++

*This is Part 4 of [Agentic Engineering in Practice]({{< relref "agentic_engineering_1_setting_the_table" >}}). [Part 1]({{< relref "agentic_engineering_1_setting_the_table" >}}) covered the setup and deploy loop, [Part 2]({{< relref "agentic_engineering_2_measure_before_you_move" >}}) the instrumentation and measurement, and [Part 3]({{< relref "agentic_engineering_3_making_it_testable" >}}) the testability. This one is the honest part: what it's actually like to work this closely with an AI agent.*

The honest part: the agent is not a code generator you point at a problem. It's a co-engineer with three hard deficiencies, no eyes, no sustained taste, and no memory across sessions.

## No eyes

It cannot look at the screen. When a change *looks* wrong, a smeared scanline, an asymmetric blur, a band that reads as a hard stripe, I describe it, and it proposes and we iterate. A couple of times we measured pixels in a headless browser to quantify exactly how asymmetric a blur edge was. Eye-plus-measurement works where either alone stalls.

## No sustained taste

"Soft" decisions are mine. The amber-gold ghost trail it cleverly added to the cursor halo? Removed, by me, because it competed with the aurora's palette. The final aesthetic calls are a human hammer.

You can't encode taste into a checklist, and you shouldn't try. You *can* encode it into git history. Every rejected idea, the gold trail, the jitter experiments, the flirtations with dithering, is recorded as a commit that was tried and reverted, often with the reason attached. The next session doesn't have to rediscover why amber is banned.

## No memory across sessions

This is the part worth stealing even without an agent. The docs, `docs/ts-migration-plan.md`, `docs/crt-aurora-animation.md`, `CLAUDE.md`, survive the context-window reset. When a session ends, the rationale goes into a markdown file. The `crt-aurora-animation.md` note carries a hard-won warning that both ordered Bayer and Floyd-Steinberg dithering were tried and removed for visual artifacts, so no future session has to rediscover that.

That last point is the quiet superpower: **the git history and the docs make the collaboration durable.** A decision made in May survives a June window reset because its rationale is committed next to the code.

## The loop, summarized

Twelve weeks, roughly, from first commit to the version you're reading on. The pattern that kept recurring:

1. Instrument the thing (`FrameMeter`, `window.__auroraMeter`).
2. Microbenchmark the hot path (`node --expose-gc bench.mjs`).
3. Unit-test the pure logic (49 tests on `src/lib/`).
4. Expose every knob as a URL param, then let numbers and eyes argue.
5. Commit small; revert without ego; write down why.

The agent accelerates the iteration; the loop closes on two things it never had on its own: numbers it generated itself, and taste it can't replicate.

If you want to poke at the controls, load any page on this site with `?perfhud=1&scanlines=pattern` in a non-pattern browser, or open the [theme repo](https://github.com/austinatchley/hugo-theme-hello-friend-ng) and see whether your cursor disagrees with mine about the halo.

That's the series. The theme repo, the docs, and the 600 commits in its history are all still there, and they're the better part of the answer to how a static blog grew its own aurora.