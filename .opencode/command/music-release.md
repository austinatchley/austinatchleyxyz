---
description: Add a music release — create a blog post and update the projects list.
agent: build
---

Announce a new music release. Perform these steps:

1. Create a blog post at `content/posts/<slug>.md` as a **draft** (`draft = true`), modeled on `content/posts/arboretum.md`. Use this structure:

```
++++
title = "<ALBUM TITLE>"
date = "<YYYY-MM-DD>"
draft = true
++++

I'm excited to announce [<ALBUM TITLE> by <ARTIST>](<hyperfollow-or-distrokid-link>), produced by os.10. Go check it out!

If you don't have access to a streaming service, [you can listen to the full release on YouTube Music](<youtube-music-link>):
```

   - If a cover image exists, add it near the top with `{{< image src="/images/<filename>.jpg" ...>}}`.
   - If the user provides a blurb (personal story, collaborators, production notes), include it after the intro.

2. Update the running list of releases in `content/projects.md`:
   - If the release is from the postbag project, add it to the "Music Projects" list with the pattern `* [NAME by postbag](<distrokid-hyperfollow-url>) (type) MM/DD/YYYY`.
   - If it's credit for another artist (e.g. produced/mixed/mastered by os.10), add it to the "credits" list: `* [TITLE by ARTIST](<stream-url>) (produced by os.10/ep) MM/DD/YYYY`.

3. Verify locally with `./scripts/run_local.sh` (or `hugo server start -D`), confirm the post renders and the projects list looks right.

Unless the user asks otherwise, leave the post as a draft (remove `draft = true` only when publishing).