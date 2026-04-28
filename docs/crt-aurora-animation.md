# CRT Aurora Animation — Implementation Notes

## Overview

The site uses canvas-based JS animations on the home page only. Three canvases layer on top of each other:

| Layer | Element | z-index | File |
| ----- | ------- | ------- | ---- |
| Background | `#crt-aurora` (in HTML) | -1 | `crt-aurora.js` |
| Particles | `#particle-field` (injected by JS) | 0 | `particles.js` |
| Cursor FX | `#cursor-fx` + `#cursor-halo` (injected) | 9998/9999 | `cursor-fx.js` |

Aurora and particles load only on the home page; cursor FX loads on every page.

## File Structure

| File | Purpose |
| ---- | ------- |
| `themes/hello-friend-ng/static/js/crt-aurora.js` | Aurora bands + CRT scanlines (home only) |
| `themes/hello-friend-ng/static/js/particles.js` | Magnetic particle field (home only) |
| `themes/hello-friend-ng/static/js/cursor-fx.js` | Cursor halo div + rings + click ripples (all pages) |
| `themes/hello-friend-ng/assets/scss/_crt-aurora.scss` | CSS for all three canvases, body transparency, halo |
| `themes/hello-friend-ng/layouts/partials/extra-head.html` | Script loading via `<script defer>` |
| `layouts/index.html` (main site) | `#crt-aurora` canvas element + `crt-page` body class |

## Aurora Bands (`crt-aurora.js`)

### Transparency stack

```css
html { background-color: #15202b; }
body.crt-page { background-color: transparent !important; }
#crt-aurora { position: fixed; z-index: -1; }
```

`html` carries the background so `body` can be transparent and the canvas shows through.

### Band structure

Four bands defined in `BANDS[]`, each with:

- `speed` — vertical oscillation rate
- `xSpeed` — horizontal colour scroll rate (independent of vertical)
- `yFrac` — home vertical position as fraction of viewport height (0.10 / 0.37 / 0.63 / 0.88)
- `amp` — vertical drift amplitude
- `offset` — random value assigned at page load; determines where in the shared spectrum this band starts

Bands are 36% of viewport height (`bandH = H * 0.36`) and centred ~27% apart, so adjacent bands overlap by ~9%.

### Shared colour spectrum

All bands sample from a single `SPECTRUM` array rather than having per-band hues:

```js
var SPECTRUM = [168, 188, 210, 240, 315, 38, 42, 168];
//              teal  cyan  blue  violet  magenta  amber  gold  (wrap)
```

`sampleSpectrum(pos)` linearly interpolates between adjacent stops. Each band uses `phase * 0.18 / (2π) + band.offset` as its position, so they all drift through the same palette but at different starting points and speeds.

### Vertical edge blending

Each band is drawn as 14 column strips, each with a vertical `createLinearGradient` that fades transparent → full → full → transparent (stops at 0 / 0.35 / 0.65 / 1). This softens the top and bottom edges so overlapping bands blend smoothly rather than stacking with hard cuts.

### Blend modes

- Aurora bands: `globalCompositeOperation = 'screen'` — additive, keeps colours bright on dark background
- Scanlines: `globalCompositeOperation = 'multiply'` — darkens alternate rows without overpainting aurora colours

### Colour survival on screen blend

Screen blend against a dark base heavily favors high-luminance channels. Pure red (hue 0°) and deep purple (280°) are too dark to show through. Colours that survive well: teal/cyan (high green+blue), amber/gold (high red+green), magenta-pink (315°, high red+blue). The spectrum is tuned around these.

### Other effects

- **Scanlines**: `rgba(0,0,0,0.55)` fill every 3rd row via multiply
- **Roll band**: faint white gradient drifting down at ~38px/s
- **Glitch**: horizontal `getImageData`/`putImageData` slice shift every 3.5–8.5s

## Particle Field (`particles.js`)

160 particles, each with a random home position, drift oscillators (independent sin/cos on x and y), and radius 0.6–2.0px.

Each frame:

1. Compute drift position around home using `sin`/`cos` oscillators
2. If cursor is within 110px repel radius, push particle outward up to 60px
3. Lerp toward target — flee rate 0.18, return rate 0.1 (lazy drift back)
4. Draw as radial gradient: gold core (`hsla(48,100%,78%)`) → teal/blue body → transparent edge
5. Gold alpha and radius scale up on proximity, giving a pulse as particles scatter

## Cursor FX (`cursor-fx.js`)

- **Halo div**: CSS radial gradient (`mix-blend-mode: hard-light`), lerped at rate 0.12 toward cursor
- **Rings**: 3 concentric rings pulsing outward from cursor over 1.8s period. Stroke lerps gold (hue 48°) when born → teal (hue 185°) as they expand and fade
- **Click ripples**: expand to 90px radius over 1.4s, teal stroke fading to transparent

## Hugo Template Notes

- **Static JS required**: `{}` inside `<script>` blocks in Hugo templates is parsed as Go template syntax. All JS lives in `static/js/` and loads via `src=`.
- **`defer` required**: scripts in `<head>` run after DOM is parsed.
- **Layout precedence**: main site's `layouts/index.html` overrides the theme's version entirely. The `#crt-aurora` canvas element and `crt-page` body class live there.
- `cursor-halo.js` was an earlier iteration of the cursor glow, superseded by `cursor-fx.js`. It has been deleted.

## Known Issues / Gotchas

- CSS linter normalizes sub-pixel blur to integers. Settled at `filter: blur(2px); opacity: 0.5` on `#crt-aurora`.
- Linter changed `mix-blend-mode: screen` → `hard-light` on `#cursor-halo`. Center alpha is `0.06`; nudge to `0.04` if too bright.
- `createRadialGradient` per particle per frame is moderately expensive. 160 particles at 60fps is fine on modern hardware but worth watching in a perf audit.
- The vertical edge fade uses 14 `createLinearGradient` calls per band per frame (4 bands = 56 gradients/frame). If perf is tight, reduce `segments` or cache gradients by column index.
