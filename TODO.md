# TODO

1. Performance testing for JS animations. Measure page load latency, client memory utilization, and client CPU utilization in an A/B test.

## DONE

1. Add music to Projects page
1. Finish lambda@edge post
1. ~~Remove theme switcher, lock to dark mode~~ (done 2026-04-28)
1. ~~Implement particle field behind CRT Aurora~~ (done 2026-04-28)
1. ~~Port theme JS to TypeScript with esbuild/vitest~~ (done 2026-04-28)

## Performance

- [ ] Canvas animation performance audit: measure page load impact, CPU/memory usage during aurora + cursor animations using Chrome DevTools Performance tab and `performance.now()` frame timing. Compare idle vs. active mouse movement. Document findings in `docs/`.
- [x] Particle hot loop allocation removal (done 2026-04-28): `drift`/`repel`/`particleStyle` now write into reused scratch objects instead of allocating per particle. Measured ~40% faster in the isolated JS loop (`themes/hello-friend-ng/bench.mjs`); avoids ~28,800 object allocations/sec at 60fps.
- [x] Scanline render (done 2026-04-28): replaced the per-frame `fillRect`-per-row loop (up to 720 calls/frame at 4K) with a single cached repeating-pattern fill.
- [ ] ~~Cache per-column aurora vertical gradients~~ — not viable: the per-column colours animate every frame and `CanvasGradient` stops are immutable after creation, so the 56 gradients/frame can't be cached without changing the visuals. Deduplicated the colour-stop string building instead (`auroraColumn` in `src/lib/spectrum.ts`).
- [ ] Potential optimization: profile `createRadialGradient` cost for 160 particles at 60fps
