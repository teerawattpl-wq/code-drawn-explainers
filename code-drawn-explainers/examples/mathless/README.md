# Example: one act of "If the world had no mathematics"

Act 3 (31.4 s to 63.04 s) of a three-minute film in the cut-paper look, with a sticker
puppet as the lead and a supporting cast. Eleven shots: a banknote that loses its number, a
bank, a pay day, a shop, a clock that breaks, three cards rubbed out, two friends and the
sun, a skyline, three measuring tools, a building site, a tower built by guesswork.

| File | What it is |
|---|---|
| `film.json` | what the film is made of: size, voice, music, look, scripts, pictures |
| `events.json` | every named moment of the whole film, and its sounds |
| `subs.js` | the subtitles of the whole film, one phrase each |
| `who.js` | the size of the puppets and the cast table `WHO` |
| `act3.js` | the act: one function per shot, and `act3(now)` that picks by time |
| `film.js` | `render(t)` for a build that contains this act only |

**It does not run as it is.** The narration, the music and all pictures (the puppet's
parts, the cast, the props) belong to the film's owner and are not included. Read it for
how a shot is written; to run it, make your own sheets from the prompts in
`references/puppets.md`, name the cast and props as `act3.js` expects or change the
names, and supply a narration of your own with its own `events.json`.

Things to look at in `act3.js`:

- `A3` at the top: every random layout is made once, with the seeded `rnd()`.
- `a3Bank`: a shot written only with `cut`, `cutRect`, `sticker`, `keyword` and puppets.
  It runs unchanged in the ink and crayon looks.
- `a3Viewer`: the lead as a watcher, small, at the edge, with two timed poses.
- `a3Clock` and `a3ClockFace`: one drawing clipped into wedges that fly apart.
- `a3Cards`: an eraser crossing a card, with a clip rectangle that follows it.
- `a3Field`: the hand that follows the sun, limited so the arm does not cross the face; the
  mouth that moves only during the two quoted sentences; a figure that walks out of frame.
- `a3Loose` and `a3Tools`: marks that sit in place until their word, then fall.
- `a3Site`: three events in one place, and the lead in a vest and hard hat
  (`WHO.engineer` has no `head`, so it is the lead's own).
- `a3Tower`: each floor rotates a little more than the one below by nesting transforms,
  and cast heads are drawn straight into the windows.
- `act3`: the shot boundaries and the wipes, all from `EV`.
