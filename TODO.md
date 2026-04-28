# TODO

1. Performance testing for JS animations. Measure page load latency, client memory utilization, and client CPU utilization in an A/B test.

# DONE

1. Add music to Projects page
1. Finish lambda@edge post
1. ~~Remove theme switcher, lock to dark mode~~ (done 2026-04-28)
1. ~~Implement particle field behind CRT Aurora~~ (done 2026-04-28)

## Performance

- [ ] Canvas animation performance audit: measure page load impact, CPU/memory usage during aurora + cursor animations using Chrome DevTools Performance tab and `performance.now()` frame timing. Compare idle vs. active mouse movement. Document findings in `docs/`.
- [ ] Potential optimization: cache per-column vertical gradients in aurora bands (currently 56 `createLinearGradient` calls/frame across 4 bands × 14 segments)
- [ ] Potential optimization: profile `createRadialGradient` cost for 160 particles at 60fps
