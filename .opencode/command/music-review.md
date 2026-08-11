---
description: Draft a music review post using the review layout (modeled on the 1983 Flying Lotus review).
agent: build
---

Draft a music review post. Perform these steps:

1. Create a blog post at `content/posts/<slug>.md` as a **draft** (`draft = true`), modeled on `content/posts/the_low_end_theory_tribe_called_quest.md`. Derive `<slug>` from the album/artist (e.g. "Music Review: The Low End Theory — A Tribe Called Quest" → `the_low_end_theory_tribe_called_quest`). **The title must start with "Music Review: "** to distinguish it from regular blog posts. Use this frontmatter shape (YAML, NOT TOML — the review layout requires `---` delimiters):

```
---
title: "Music Review: <ALBUM> — <ARTIST>"
date: "<YYYY-MM-DD>"
draft: true
layout: "review"
tags: ["music", ...]

artist: "<ARTIST>"
album: "<ALBUM>"
cover: "/images/<filename>.jpg"
tracks: <N>
length: "<MM:SS>"
label: "<LABEL>"
released: "<YYYY | YYYY-MM-DD>"
genre: ["<Genre>", ...]

score: <0-10, one decimal>

blurb: "<one-sentence hook ...>"

credits:
  - role: "<Role>"
    name: "<Name>"
  ...
---
```

   - The review layout (`layouts/posts/review.html`) renders header, stats, credits, score, blurb, and body automatically. Fill every field that apply; set `cover` to an image in `/static/images/` if it exists (download the album cover to `static/images/` if the user provides the artwork). Leave unknown fields out rather than guessing.
   - Write the actual review prose in the **body** (below the frontmatter): track-by-track highlights, context, standout moments. Use the author's voice, keep paragraphs tight, link out to the artist/album where relevant.

2. **Do NOT touch `content/projects.md`** — that file only tracks releases/credits, not reviews (see `/music-release`).

3. Verify locally with `./scripts/run_local.sh` (or `hugo server start -D`), confirm the review renders with the review layout (check the page uses `.review-single` structure in the output).

Unless the user asks otherwise, leave the post as a draft (remove `draft = true` only when publishing).