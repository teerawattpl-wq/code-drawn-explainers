# Example: why honeycomb is hexagonal

A complete story in two languages (Thai, English), about one minute each.

| File | What it is |
|---|---|
| `story.json` | frame size, script list, English phrase cues, three named moments |
| `lines.th.json`, `lines.en.json` | the narration scripts |
| `bee.js` | the story's own drawings: a bee that assembles itself, and the comb |
| `film.js` | the film: two worlds (the comb, the sketchbook page), the word tables, the narrator plan |
| `sound.py` | sound effects placed on the timeline |

The narration audio is not included. To build it, generate and cut the narration as in
steps 3 and 4 of SKILL.md into `audio/th/lines/01.wav` to `08.wav`. Phrase cues in
`story.json` belong to the take they were measured on; a new English take needs new ones.

Things to look at in `film.js`: the `WORDS` table per language; the camera key lists
`KEYS_A`, `KEYS_P`, `KEYS_B`; how each scene function returns early outside its window; the
cross-fade between worlds in `render`; and `NARRATOR_PLAN` at the end.
