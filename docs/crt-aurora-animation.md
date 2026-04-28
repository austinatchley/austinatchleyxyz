# CRT Aurora Animation — Implementation Notes

## Overview

The site uses two canvas-based JS animations loaded on a `<canvas>` element fixed behind all page content. The aurora/scanline effect runs only on the homepage; cursor effects run sitewide.

## File Structure

| File | Purpose |
|------|---------|
| `themes/hello-friend-ng/static/js/crt-aurora.js` | Aurora bands + CRT scanlines (home only) |
| `themes/hello-friend-ng/static/js/cursor-fx.js` | Cursor halo div + rings + click ripples (all pages) |
| `themes/hello-friend-ng/assets/scss/_crt-aurora.scss` | CSS for canvas, body transparency, halo, cursor-fx |
| `themes/hello-friend-ng/layouts/partials/extra-head.html` | Script loading via `<script defer>` |
| `layouts/index.html` (main site) | Canvas element + `crt-page` body class |

## How It Works

### Background Canvas (`crt-aurora.js`)

Runs a `requestAnimationFrame` loop on `#crt-aurora`, a `position: fixed; z-index: -1` canvas:

1. **Base fill** — fills `#15202b` each frame (matches dark theme background)
2. **Aurora bands** — three `globalCompositeOperation: 'screen'` horizontal gradient strips, each with independent hue, drift speed, and vertical oscillation
3. **Scanlines** — `globalCompositeOperation: 'multiply'` black `rgba(0,0,0,0.55)` fills every 3px row, darkening alternate rows without overpainting the aurora colors
4. **Roll band** — a faint white gradient drifting downward at ~38px/s, simulating CRT vertical roll
5. **Glitch** — occasional horizontal `getImageData`/`putImageData` slice shifts (every 3.5–8.5s)

The canvas is visually softened with `filter: blur(2px); opacity: 0.6` in CSS.

### Transparency Stack

The key insight for making the canvas visible behind content:

```
html { background-color: #15202b; }        /* visible through transparent body */
body.crt-page { background-color: transparent !important; }
#crt-aurora { position: fixed; z-index: -1; }  /* sits below all normal flow */
```

**Why `html` not `body`**: browsers paint `body`'s background as the page background even when scrolling past content. Setting background on `html` instead means `body` can be transparent and the canvas behind it shows through without any whitespace flash.

### Cursor Effects (`cursor-fx.js`)

Injects two elements into `<body>` dynamically (no HTML needed in templates):

- **`#cursor-halo`** — a CSS `div` with a radial gradient (`mix-blend-mode: hard-light`), lerped toward the mouse at rate 0.12 per frame for smooth following
- **`#cursor-fx` canvas** — draws three concentric rings that pulse outward from the cursor, plus click ripples that expand to 90px radius over 1.4s

Both share a single `rAF` loop. The halo and canvas are positioned `z-index: 9999/9998` above all content.

### Hugo Template Notes

- **Static JS files required**: Hugo parses `{}` inside `<script>` blocks in templates as Go template syntax. All JS must live in `static/js/` and be loaded via `src=`.
- **`defer` required**: Scripts in `<head>` with `defer` run after DOM is parsed, so `document.body` is available.
- **Layout precedence**: `layouts/index.html` in the main site overrides the theme's version entirely. The canvas element and `crt-page` body class live in the main site's `layouts/index.html`, not the theme.

## Known Issues / Design Decisions

- **CSS linter** keeps normalizing blur values to integers (e.g. `0.6px` → `2px`). The settled value of `filter: blur(2px)` was linter-enforced, not intentional.
- **`mix-blend-mode: hard-light`** on `#cursor-halo` was changed from `screen` by the linter. It produces a slightly brighter center point — could tune center alpha from `0.08` → `0.06` if too bright.
- **`cursor-halo.js`** in `static/js/` is a leftover from an earlier iteration and can be deleted.
