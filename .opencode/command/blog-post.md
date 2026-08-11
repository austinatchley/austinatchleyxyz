---
description: Draft a non-music blog post — create content/posts/<slug>.md as a draft.
agent: build
---

Draft a new blog post (not a music release). Perform these steps:

1. Create a blog post at `content/posts/<slug>.md` as a **draft** (`draft = true`), modeled on an existing non-music post (e.g. `content/posts/le_guin.md`, `content/posts/bluesky.md`, or `content/posts/lambda_edge.md`). Derive `<slug>` from the title using lowercase snake_case (e.g. "Car Travel 2023" → `car_travel_2023`). Use this frontmatter shape:

```
+++
title = "<POST TITLE>"
date = "<YYYY-MM-DD>"
draft = true
+++
```

   - Add `tags = ["...", "..."]` (required — at least one) using only the canonical vocabulary in the "Tag vocabulary" section of `CLAUDE.md`. Never invent new tags; if none fit pick the closest and mention the gap to the user. Add `toc = true` if the post is long or would benefit from a table of contents.
   - Write the body in the author's voice: personal, conversational first-person where the subject is experience/opinion, or structured prose (sections, quotes, links) for essays and how-tos.
   - Link out generously to sources, references, and related posts using inline markdown links. The site already has full-blown posts on related topics (Lambda@Edge, robots.txt, remix, centering images) — link to those where relevant instead of re-explaining.
   - If images are needed, reference files in `/static/images/` via `{{< image src="/images/<filename>.jpg" alt="..." position="center" >}}` or `![alt text](/images/<filename>.jpg "")`.

2. **Do NOT touch `content/projects.md`** — that file only tracks music releases and credits (see `/music-release`).

3. Verify locally with `./scripts/run_local.sh` (or `hugo server start -D`), confirm the post renders.

Unless the user asks otherwise, leave the post as a draft (remove `draft = true` only when publishing).