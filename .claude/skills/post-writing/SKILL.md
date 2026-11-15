---
name: post-writing
description: Write or finish a blog post or music review for this Hugo site from freeform dictated thoughts. Use when the user wants to draft a post, dictate thoughts for a post, finish a draft, add a music review, or fetch/replace album cover art. Covers front matter format, the review layout contract, high-res cover art sourcing, Austin's prose voice, and the dictation-to-structure workflow.
---

# Writing posts for austinatchley.xyz

This site has two post shapes with **different front matter syntax**. Check which
you are writing before touching anything.

| | Music review | Regular post |
| --- | --- | --- |
| Front matter | **YAML** (`---`) | **TOML** (`+++`) |
| `layout` | `"review"` | omitted |
| Example | `content/posts/the_low_end_theory_tribe_called_quest.md` | `content/posts/mcluhan.md` |

The archetype at `archetypes/posts.md` emits YAML, but every existing regular
post uses TOML. Match the neighboring posts, not the archetype.

**Release announcements** (my own music or productions, e.g. `arboretum.md`,
`echoes.md`, `live_at_the_party_vol_5.md`) are regular TOML posts with:

- `title = "Release: <release title>"`. The prefix groups them in post lists.
- `tags = ["music", "release"]`.
- An explicit `url` front matter field. Permalinks are built from the title,
  so without it the `Release: ` prefix (and characters like `@`) end up in
  the URL. For a new post use `/posts/<yyyy>/<mm>/<slug>/`. Never change the
  `url` of a published post.
- Full-size cover art, a short details list (release date, type, lineup),
  the HyperFollow link, and any Instagram clips via `{{</* instagram ID */>}}`.

Filename convention: `snake_case.md`. Reviews are `<album>_<artist>.md`
(`midnight_marauders_tribe_called_quest.md`).

## The dictation workflow

This is the main way posts get written here. The user talks, you structure.

1. **Read the two or three most similar existing posts first.** For a review,
   always read the most recent review in full — it is the voice reference.
2. **Before they dictate, surface decisions the post will need.** For reviews
   this is usually: how the record sounds different from related albums
   already reviewed, which section headings he wants, and who gets the
   closing teaser. Asking up front beats inventing later.
3. **Invite genuinely loose input.** Tell them repetition, jumping around, and
   self-contradiction are fine. The point of dictation is that they do not have
   to self-edit while talking.
4. **Structure, do not embellish.** Reorder into the canonical arc, merge
   repeated points, cut filler, convert speech to prose rhythm. Keep their
   actual words and opinions wherever they survive the edit.
5. **Flag inventions rather than committing them.** When the arc wants a beat
   they never dictated (a weakness paragraph, a comparison, a transition
   claim), say so explicitly instead of writing a plausible opinion in their
   voice. Inventing opinions is the main failure mode of this workflow.
6. **Keep `draft: true` until they say otherwise**, then commit.

## Austin's prose voice

Confirmed by reading `the_low_end_theory_tribe_called_quest.md` and `mcluhan.md`:

- **First person, personal history over criticism.** What the record meant to
  him, when he listened to it, how it shaped his own production and mixing.
  Not what it meant to hip-hop at large.
- **Review bodies use section headings** (from *Midnight Marauders* onward,
  decided 2026-11-15. *The Low End Theory* predates this and is unheaded
  prose). He names the headings. Do not invent them. Use `##` headings,
  since the layout already renders the album as the `<h1>`. Prose under each
  heading follows the same voice rules below.
- **No semicolons and no em-dashes.** The Low End Theory body has zero of each
  across seven paragraphs. Comma splices and long run-ons are the house style
  and are deliberate. Do not "fix" them into tighter sentences.
- **Album titles in `*italics*`.** Artist and song names plain, songs in
  `'single quotes'` or `"double quotes"` as they appear in credits.
- **Concrete specifics as evidence.** Named players (Ron Carter), engineers
  (Bob Power), label context, sample sources, listening situations ("from
  another room or from car speakers"). Specifics carry the argument.
- **Earned criticism, stated plainly.** Weaknesses get their own paragraph and
  are tied to the score. No hedging, no "your mileage may vary."
- **Compare by sound, not by score.** Scores sit next to each other on the
  site, but reviews do not argue the gap head to head ("this beats that by
  0.4 because..."). When a related album is already reviewed, talk about how
  the two records *sound* different from each other. Do not write a score
  justification he did not dictate.

## Review body arc

The layout renders a lot for you. The body is prose under his `##` section
headings. The beats below are what the body should cover, not a fixed
heading list. Map them onto whatever headings he chooses.

1. Opening hook. Often picks up the thread from the previous review's teaser.
2. What the record is and why it mattered to him personally.
3. Craft and production. Samples, mixing, the players, how it influences his
   own work.
4. The listening experience. When and how he plays it now.
5. The knock. What keeps it off a 10.0.
6. Close that names the score, then a one-line teaser for the next review.

The teaser matters: each review ends by naming the next album, which makes the
series chain together. Candidates for the next album live in
`docs/review-queue.md` (unpublished). Offer them when asking who gets the
teaser, add albums there whenever the user mentions one they want to review,
and move an album to "Reviewed" with its score once its review is written. Low End Theory closes with "Next in the series is
another formative favorite, Midnight Marauders...."

## Review layout contract

`layouts/posts/review.html` renders these front matter fields automatically.
**Do not repeat any of them in the body.**

- `cover` as a hero image, `score` as a number plus 10 pips
- `genre` joined with `·`, `artist`, `album` as the `<h1>`
- `tracks`, `length`, `label`, `released` as a stats list
- `blurb` as a pull quote above the body
- `credits` as a role/name table below the body
- date and an "All posts" back link in the footer

So: no `# Album Name` heading, no score callout, no credits list, no
tracklist in the markdown. The body is only the essay.

`score` is a float rendered verbatim, and the pip count is `int score`, so 9.7
fills 9 pips. Keep one decimal place.

## Album cover art

The cover renders 600px wide (`.review-cover` in the theme's
`_reviews.scss`), so it needs a **1200×1200 square** for 2x displays. Small
web-scraped covers (~300px) look soft and stretched. Get covers from the
Cover Art Archive, which serves real scans with no API key:

```bash
D=<scratchpad>/covers && mkdir -p "$D"   # downloads go in their own dir
UA="cover-fetch/1.0"                      # generic UA, no personal details

# 1. Find the release-group MBID (MusicBrainz rate-limits to ~1 req/s and
#    sometimes answers "server is currently busy": retry after a few seconds)
curl -s -A "$UA" 'https://musicbrainz.org/ws/2/release-group/?query=releasegroup:%22ALBUM%22%20AND%20artist:%22ARTIST%22&fmt=json&limit=3'

# 2. Download the front cover for that release group
curl -sL -A "$UA" -o "$D/front.jpg" https://coverartarchive.org/release-group/<MBID>/front

# 3. Resize to 1200x1200 (ffmpeg is installed, ImageMagick and Pillow are not)
ffmpeg -loglevel error -y -i "$D/front.jpg" -vf scale=1200:1200:flags=lanczos \
  -q:v 3 -map_metadata -1 static/images/<album>_album_cover.jpg
```

- **Look at the downloaded image before using it** (Read it). Confirm it is
  the right album and the original front cover, not a reissue or back cover.
- Check it is square (`file` prints dimensions). If the source is not square,
  crop rather than scale, or the art distorts.
- If the archive's scan is under 1200px, use it at native size rather than
  upscaling.
- Name it `<album>_album_cover.jpg` and record the MusicBrainz release ID in
  the commit message so the source is traceable.

## Tags

Every post needs at least one tag from the canonical vocabulary in
`CLAUDE.md`. Do not invent tags; if nothing fits, pick the closest and say so.

Reviews carry `["music", "music-reviews", <genre tags>]` where genre tags are
per-review and lowercase-hyphenated (`hip-hop`, `jazz-rap`, `electronic`).

## Shortcodes available

- `{{< image src="/images/x.jpg" alt="..." position="center" >}}`
- `{{< youtube VIDEOID >}}`
- `{{< rawhtml >}}` for raw HTML

Images live in `static/images/` and are referenced as `/images/filename.jpg`.

## Before finishing

- Verify the image referenced by `cover` actually exists in `static/images/`
  and is 1200×1200 (see "Album cover art").
- Preview with `./scripts/run_local.sh` (serves drafts) if the user wants to
  see it rendered.
- Commit the markdown and any new image together. Drafts are safe to push to
  `main`: `draft: true` keeps them out of the built site.
- Do not deploy unless asked. `./scripts/deploy.sh` publishes live.
