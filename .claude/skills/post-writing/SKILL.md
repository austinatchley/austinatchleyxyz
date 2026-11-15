---
name: post-writing
description: Write or finish a blog post or music review for this Hugo site from freeform dictated thoughts. Use when the user wants to draft a post, dictate thoughts for a post, finish a draft, or add a music review. Covers front matter format, the review layout contract, Austin's prose voice, and the dictation-to-structure workflow.
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

Filename convention: `snake_case.md`. Reviews are `<album>_<artist>.md`
(`midnight_marauders_tribe_called_quest.md`).

## The dictation workflow

This is the main way posts get written here. The user talks, you structure.

1. **Read the two or three most similar existing posts first.** For a review,
   always read the most recent review in full — it is the voice reference.
2. **Before they dictate, surface decisions the post will need.** For reviews
   this is usually: what justifies the score relative to already-rated albums,
   and who gets the closing teaser. Asking up front beats inventing later.
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
- **No section headings in review bodies.** Continuous prose, ~5-7 paragraphs.
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
- **Scores are defended comparatively.** A 9.7 next to a 9.8 needs a stated
  reason for the gap, or the ordering reads as arbitrary.

## Review body arc

The layout renders a lot for you. The body is prose only.

1. Opening hook. Often picks up the thread from the previous review's teaser.
2. What the record is and why it mattered to him personally.
3. Craft and production. Samples, mixing, the players, how it influences his
   own work.
4. The listening experience. When and how he plays it now.
5. The knock. What keeps it off a 10.0.
6. Close that names the score, then a one-line teaser for the next review.

The teaser matters: each review ends by naming the next album, which makes the
series chain together. Low End Theory closes with "Next in the series is
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

- Verify the image referenced by `cover` actually exists in `static/images/`.
- Preview with `./scripts/run_local.sh` (serves drafts) if the user wants to
  see it rendered.
- Commit the markdown and any new image together. Drafts are safe to push to
  `main`: `draft: true` keeps them out of the built site.
- Do not deploy unless asked. `./scripts/deploy.sh` publishes live.
