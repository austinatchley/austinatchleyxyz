+++
title = "Agentic Engineering in Practice, Part 1: Setting the Table"
date = "2026-08-11"
series = "Agentic Engineering in Practice"
tags = ["agentic", "hugo", "canvas", "performance"]
+++

If you visited my website, you probably saw the Aurora effect behind it: glowing bands of color that drift and blend like a CRT-suffused aurora borealis, with a halo chasing your cursor and a faint particle field that scatters as you move.

What you can't see from the outside is the process. I built the new UX over a few weeks of pair-programming with an AI coding agent. This is a series about that workflow. It's about how a static site became a small living system, and what it meant to co-build it with an agent that can generate code faster than I can review it.

- [Part 1: Setting the Table]({{< relref "agentic_engineering_1_setting_the_table" >}}) — the architecture, the deploy pipeline, and the tooling that made it all possible. You are here.
- [Part 2: Measure Before You Move]({{< relref "agentic_engineering_2_measure_before_you_move" >}}) — instrumentation, microbenchmarks, and A/B testing against a living page.
- [Part 3: Making It Testable]({{< relref "agentic_engineering_3_making_it_testable" >}}) — the TypeScript migration and the pure-logic split that made refactors safe.
- [Part 4: Working With an Agent]({{< relref "agentic_engineering_4_working_with_an_agent" >}}) — what it's actually like to co-engineer with one.

## Architecture: a theme as a forkable engine

This site runs on [Hugo](https://gohugo.io/), and its theme is a [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules) pointing at my fork of [hello-friend-ng](https://github.com/rhazdon/hugo-theme-hello-friend-ng). That split predates the aurora by years, and it turned out to be the single most useful structural decision.

Two repos with clean responsibilities:

- **Main repo** (`austinatchleyxyz`): content, layouts, config.
- **Theme repo**: all the custom JavaScript, SCSS, and partials that make the site feel like *mine*.

Because the theme is a submodule, the main repo never edits theme code directly. Every visual change follows a ritual: commit in the theme repo, then bump the submodule pointer in the main repo. The result is a bite-size changelog that's readable at a glance:

```md
4e3d18f CRT aurora for landing page
3299ac5 improve styling of CRT aurora. add twinkles
ac12360 use new and improved CRT aurora
63bdbf8 Use TypeScript theme JS toolchain
110584d Fix double-loading of animation scripts and canvases
0d94274 Remove .IsHome guard so aurora/particles load on all pages
```

This turned out to be an ideal shape for agent-assisted work: each change is small, independently reversible, and carries its own rationale. When the agent and I disagreed, the unit of disagreement was a single commit, not a sprawling diff.

## The deploy loop: an idea reaches production in about a minute

The key piece that allowed me to iterate quickly with this whole setup isn't actually the code generation. It's the release pipeline. A push to `main` and I get the result on the live site almost immediately.

The theme repo has a [GitHub Actions](https://github.com/features/actions) workflow that runs `npm run check` on every push: typecheck, lint, prettier, the 49 vitest tests, and a full esbuild build. If any of that fails, the commit is quietly rejected and nothing ships.

The main repo has its own workflow that runs on `main`: it installs Hugo, does a `hugo --minify` build, then `hugo deploy` pushes to S3 and invalidates the CloudFront CDN cache. End to end, from `git push` to the live site, is on the order of a minute.

This means the agent can try ideas locally with the dev server, and if a change is straightforward enough, the feedback loop is: commit, push, one minute, look at the real site. Cutting the lead time on a new feature down to that length changes how you choose what to try. Experiments that would feel too expensive at a day-long deploy cycle are free at a minute-long one.

The two workflows also enforce the split at the seam between repos: the theme is guarded by its own quality gates, and the main repo has a Hugo-only build that needs no Node toolchain at all because the compiled JavaScript is committed.

## The open-source setup

Worth naming the toolchain, because the pricing model shaped quite a few of these decisions. The agent runs through [opencode](https://opencode.ai), an open-source terminal coding agent, and [OpenRouter](https://openrouter.ai), which routes requests to whatever model I want and lets me hot-swap mid-session. No proprietary closed-source harness, no subscription, and if a model goes sideways mid-task I switch to another one in a keystroke.

The model that did most of this work is [DeepSeek V4 Flash 0731](https://openrouter.ai/deepseek/deepseek-v4-flash-0731), which OpenRouter lists at roughly **$0.08 per million input tokens and $0.16 per million output**, with a 1M-token context. Provider discounts and prompt caching often make the real bill smaller than the list price. For context, a single proprietary subscription runs $20 a month whether or not you touch it. Twelve weeks of this project cost pocket change measured in cents, not a recurring bill.

To put that per-token number in perspective, OpenRouter currently lists Anthropic's flagship [Claude Opus 5](https://openrouter.ai/anthropic/claude-opus-5) at **$5 per million input tokens and $25 per million output**. Claude Opus 4.8 lists at the same rate. So DeepSeek comes in around **60x cheaper on input and 150x cheaper on output**. Prompt caching narrows the gap a bit, but nowhere near enough to change the calculus.

That gap matters more for agentic work than for anything else, because agents are token-hungry by nature. Every iteration swallows the conversation history, tool calls, repo reads, and file rewrites, often with a large context window that gets re-read across turns. At Opus prices that kind of loop is an operating cost you think about. At DeepSeek prices it's noise, which changes how you work: I tried experiments constantly and let real failures happen, because the per-attempt price made every try feel free.

Next up: [Part 2: Measure Before You Move]({{< relref "agentic_engineering_2_measure_before_you_move" >}}), about the instrumentation that tells the agent where to spend its effort.