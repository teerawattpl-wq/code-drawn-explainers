# Films longer than a minute: acts on one clock

A three-minute film is not three one-minute stories. It has one narration recording, one
music track and thirty to fifty shots, and the user cannot judge it in one sitting. Build
it in acts, each approved on its own, all on the clock of the recording.

Use `kit/build_film.py` (not `build.py`) and the files `stage.js` and one `look-*.js`.
`examples/mathless/` is one act of such a film.

## Layout

```
project/
  kit/                       this skill's scripts/
  audio/narration.mp3        the finished narration: the film's clock
  audio/music.wav            optional
  character/raw/             sheets from the user (references/puppets.md)
  character/parts/, cast/    cut by kit/prep_parts.py, kit/prep_cast.py
  docs/agreements.md         what was decided, and what changed later and why
  docs/storyboard.md         every shot: time, words, picture, the character's role
  film/
    film.json                size, voice, music, look, scripts
    events.json              named moments and the sounds on them
    who.js, subs.js          the cast table; the subtitles
    act1.js ... act8.js      one file per act, one function per shot
    film.js                  render(t): picks the act, wipes, grain, subtitle
    build/<name>/            generated; never edit
  Act3-v1.mp4, Film-v1.mp4
```

## Order of work

1. **Agree the frame before anything is drawn**, one question at a time: what is drawn and
   what is a sticker; how the character works; the frame shape; whether the script and
   voice exist already; the character's look; the look of the scenery
   (`references/looks.md`); what text is on screen. Write the answers down.
2. **A ten-second test of the riskiest new thing** (a puppet rig, a new look) before the
   storyboard. Show it and wait.
3. **The storyboard as a table**, every shot of the film: start time, the words spoken,
   what is seen, the character's role, the words on screen. Give each act its own places
   and main colours. Count the roles (below) so the character is not in the middle of
   every shot. List the shots where the picture could say something false, and how each
   will avoid it. Wait for approval.
4. **Act 1 as the pilot.** It settles colour, level of detail and how the character acts.
   Everything after it goes faster.
5. **Each act**: write, check stills, render the act alone, deliver, wait. An act of thirty
   seconds with ten shots took about fifteen minutes once the tools existed.
6. **The whole film**: build from 0 to the end and render once. Then check the joins.

### The character's role in a shot

| Role | What it does |
|---|---|
| Actor | in the scene at full size, doing the thing itself |
| Watcher | smaller, at an edge, looking and reacting |
| Absent | no character: a diagram or an event |

About a third each kept a three-minute film from becoming a figure standing in front of
backdrops. A watcher still needs two or three poses in a shot, timed to what it sees.

## Time

Every time in the film is a second of the narration recording ("film time"). A part being
built starts at `T.offset`, and `render(t)` begins with `const now = t + T.offset`.

**Named moments.** `events.json` holds every moment the film cares about and the sounds
placed on them:

```json
{"moments": {"wake": 1.55, "clock": 3.5, "price": 25.25},
 "sounds": [{"at": "clock", "plus": 0.1, "sfx": "rustle", "gain": 0.3},
            {"at": "price", "plus": 0.75, "sfx": "pop", "gain": 0.3}]}
```

The picture reads the moments as `EV` (`EV.clock + 0.4`), and the soundtrack is built from
the same file, so a sound cannot drift from its action. Never type a time into an act that
is not an `EV` name plus a small offset. A sound is any function of `kit/synth.py`, with
`args` if it takes them.

**Finding the moments.** Sentence starts come from the transcript of the recording. Phrase
starts inside a sentence come from the short silences:

```
python kit/pauses.py audio/narration.mp3 31 63.5
```

A fast TTS voice rarely pauses longer than 0.1 s, so `words.py` finds nothing to split;
this lists pauses down to 0.06 s. Match them to the script by counting. Where two phrases
run together with no silence, a rough transcript in half-second windows shows which
half second the second phrase starts in.

**Shots change on the sentence.** A shot starts 0.05 s before its first word, behind a
0.4 s wipe. Inside a shot, each thing arrives on the word that names it.

**Subtitles** are one phrase at a time in `subs.js`: `[from, to, text]` in film time.

## Writing an act

One function per shot, and the act picks by time:

```js
function act3(now) {
  if (now < EV.bankcnt - 0.05) a3Money(now);
  else if (now < EV.salary - 0.05) a3Bank(now);
  else a3Pay(now);
  [["bankcnt", "#ffd21f"], ["salary", "#ff8a1f"]].forEach(([k, c]) => wipe(now, EV[k] - 0.05, c));
}
```

A shot function draws back to front: the far wall or sky, the furniture, the people, what
is in front of them, then key words and bubbles. Random layouts (boxes on a shelf, floors
of a tower) are made once at the top of the file with the seeded `rnd()`, never inside the
shot function.

A shot of two seconds needs one clear change. A shot of five needs three beats, usually:
it works, it stops working, somebody reacts.

## Checking, delivering, and the user's corrections

- Take a still near the end of every shot and one in the middle of every long shot, look
  at the contact sheet, fix, and re-shoot only the times you changed.
- With each act say: where the file is, its length and loudness, a table of what to look
  at in which seconds, **every place the act differs from the approved storyboard and
  why**, and what you could not judge (motion, sound). Offer to remove anything you added.
- Keep every file. A corrected act is `-v2`; the earlier one stays.
- A correction to one act often names a rule for all of them. When the user said the
  people drawn by code looked plain beside the sticker lead, the answer was to review
  every act of the storyboard for what else should be a sticker, write all the prompts in
  one go, and record the new rule, not to patch the one act.
- Keep a status table of the acts (file, time range, approved or waiting) in the
  agreements file, and bring the handoff file up to date when the film is assembled.

## Assembling

```
python kit/build_film.py film full 0 183.25
cd film/build/full && npx hyperframes lint
npx hyperframes render --fps 30 --output ../../../Film-v1.mp4
```

Three minutes at 1920 x 1080 rendered in about seven minutes; run it in the background.
The whole film is rendered from the one set of files, not joined from the act videos, so
the music runs through unbroken and fixes made after an act was approved are included.
Then check: the length equals the narration's; loudness and peak
(`ffmpeg -af ebur128=peak=true`); one frame at every act boundary (each should be mid-wipe,
none black or frozen); the last frame. Tell the user to listen at the act boundaries: the
act files had the music cut into pieces and the film does not.

## Mistakes that cost time

- **A blank frame from every still.** A `const` used by code that runs while its script is
  loading, before the line that declares it (a helper moved above the hash function it
  calls), stops the whole script. The page still renders the background. When every still
  is one flat colour, run `node --check` on each file and read the order of declarations.
- **A shot that draws half a frame.** A function missing in the loaded look, or a missing
  picture, throws in the middle of `render` and leaves what was already drawn. Compare a
  still with the shot's function line by line from the last thing that did appear.
- **A hole in a bubble.** A rounded box and its tail in one path, wound in opposite
  directions, cancel where they overlap. Fill them as two paths.
- **Outlines through a cloud.** Stroking a path made of overlapping circles draws every
  circle. Stroke first at double width and fill over it.
- **Sky from blue to orange goes grey** in the middle. Keep the sky and move the sun.
- **Piles on the character.** Things falling off a conveyor landed on the watcher's legs.
  Decide where a pile lands before deciding where the character stands.
- **A heap behind a bowl** looks outside it; see the cut-paper style file.
- **Shell here-documents** with quotes or many lines fail in odd ways, and a stray
  `python -` waits for input for ever. Write every script to a file and run the file.
- **Elapsed time.** If the user asks how long the film took, read it from the times of the
  files, say which gaps you left out, and say what the files cannot show.
