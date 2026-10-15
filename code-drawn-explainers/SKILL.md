---
name: code-drawn-explainers
description: Make narrated explainer or documentary videos, one minute to several, vertical or landscape, with the picture drawn by code on a canvas (no AI video model): topic and fact check, script, TTS narration, a soundtrack synthesized in code, the animated film, an MP4 in one or more languages. Has a menu of looks (sketchbook ink, cut paper, flat ink, crayon layers) and a way to add a look from a reference film. Optional: the user's cut-out narrator in a corner, or a sticker puppet with a supporting cast and prop stickers acting in the scenes. Use whenever the user wants an animated explainer, a short documentary, a "how does X work" video, a math or science story, motion graphics in code, the next story in such a series, another language version, a longer film made act by act, a different look, or an analysis of how a reference film's scenes are drawn - even if they only say "ทำสารคดี", "สารคดีเล่าเรื่อง", "ทำเรื่องต่อไป", "ทำคลิปอธิบาย", "ทำพากย์อังกฤษ", "เปลี่ยนแนวภาพ", or "make an explainer about bees".
compatibility: Needs a shell, Python 3.10+ (numpy, scipy; pillow for narrator pictures; faster-whisper to check narration), ffmpeg, and Node.js 18+ with the HyperFrames CLI (npx hyperframes). Needs a text-to-speech service - the bundled script uses the Gemini API; any TTS that returns audio files works.
---

# Code-drawn explainers

A film where the whole picture is one function of time: `render(t)` draws frame `t` on a
canvas, a headless browser captures every frame, ffmpeg joins them. Because nothing is a
finished image, everything can move: a subject builds itself from construction lines,
shapes turn into other shapes, the camera never has to cut.

Two kinds of film are made this way, and most of this file describes the first:

| | One-minute story | Longer film with characters |
|---|---|---|
| Length | 45 to 60 seconds | two to four minutes, in acts |
| Picture | all code | scenery and effects in code; people and some props are stickers |
| Narration | generated line by line for the film | one finished recording; the film follows its clock |
| Built with | `kit/build.py`, `story.json` | `kit/build_film.py`, `film.json`, `events.json` |
| Read | this file, `references/film-craft.md` | this file to step 2, then `references/long-films.md` and `references/puppets.md` |

Either kind can be drawn in any look on the menu in `references/looks.md`.

Who does what:

| Job | Who |
|---|---|
| Topic, fact check, script | agent, approved by the user |
| Narration | agent, through a TTS service |
| Every drawing and all motion | agent, as code |
| Music and sound effects | agent, synthesized in code |
| Pictures of a narrator, a puppet, its cast and prop stickers (all optional) | **the user**, in an image generator, from prompts the agent writes |
| Watching and listening to the result | **the user** |

The last row matters. You can inspect still frames and transcripts, and nothing more. You
cannot see motion or hear audio. Say so every time you deliver a file, and list what the
user should check with their own eyes and ears, most important first.

Work in the user's language. Ask one question at a time, with lettered options and a
recommendation. Do not build a new story before the script is approved.

## Project layout

```
project/
  .env                      TTS key. Never open it, print it, or copy it anywhere.
  kit/                      copy of this skill's scripts/ folder, made once
  narrator/                 optional: poses.js + pictures, made by kit/prep_narrator.py
  story01/
    story.json              size, script list, phrase cues, named moments
    lines.th.json           narration script per language
    audio/th/narration-raw.wav, audio/th/lines/01.wav ...
    subject.js              what this story draws (a bee, a planet, a gear)
    film.js                 render(t): the film
    events.js               the moments picture and sound share (optional, preferred)
    sound.py                sound that needs more than events.js can say (optional)
    storyboard-th.jpg       the storyboard shown for approval
    build/th/               generated; never edit
  Story-Title-v1.mp4
```

Set up once: copy `scripts/` to `project/kit/`. Check the tools: `python --version`,
`ffmpeg -version`, `node -v`, `npx hyperframes --version`. If plain `python` is missing, use
`uv run --no-project --with numpy --with scipy python ...` everywhere below.

A finished story is in `examples/honeycomb/` (two languages, with a narrator plan). Read its
`film.js` before writing your first film; it is the best description of how the pieces fit.

## The workflow for one story

Three points need the user's approval: the script, the storyboard, and the final viewing.
Outside those, keep going.

### 1. Topic and facts

Offer three or four topics in a short list, each with what the pictures would be, and
recommend one. Good topics follow **one thing** from start to end, contain a real question,
and include something that turns into a diagram (a comparison, a count, a timeline).

Check every fact you will say or show before writing: search for dates, names and numbers,
and compute the numbers you can compute. Tell the user which facts you verified, which you
calculated, and which you left vague on purpose because sources disagree. A wrong year in a
finished film costs a re-render in every language.

### 1b. The look

Once per series, before the storyboard: recommend a look from the menu in
`references/looks.md` and settle it with a five-second comparison shot of the two nearest
looks, not with a description. Later stories in the series keep the look. A user who has
already chosen from a finished film does not need to be asked again.

### 2. Work order

Write a short work order and show it to the user before any narration or code:
`references/work-order.md` has the three parts (concept and continuity rule, banned list,
narration with a drawing list per line) and why it stays short. Six to nine lines, about
70-90 seconds. Shape: a question in the first line; one idea per line; the payoff in the
last line turns back to the opening. Put no times in it; they come from the recording.
Wait for approval.

### 3. Narration

Write `lines.<lang>.json` (format in `kit/make_voice.py`) and generate the whole script in
one request, after telling the user it uses one request of their quota:

```
python kit/make_voice.py story01/lines.th.json story01/audio/th/narration-raw.wav
python kit/words.py story01/audio/th/narration-raw.wav th
```

`words.py` prints each word with its time and lists the long pauses. Compare with the
script, then cut the recording into one file per line, in the middle of the pauses:

```
ffmpeg -ss 0.00 -to 7.52 -i narration-raw.wav lines/01.wav
```

TTS adds things: a stray "hmm" after the last line, a repeated line, a word before the
first. Keep only what matches the script. Tell the user every word the transcript heard
differently, because short words and words that differ only by tone cannot be checked this
way - they have to listen. The narration must be approved before the film is built on it,
since every time in the film comes from it.

Things TTS has added here: "Long pause." read aloud at the end, a closing line that is not
in the script ("Try it!"), a silence of nearly a second in the middle of a number. In an
English script write every number as words ("thirty-two thousand, seven hundred and
sixty-eight") so it is read the way you mean.

### 4. Timeline

Write `story.json` and build once, before any drawing exists (use a `film.js` that only
fills the background):

```
python kit/build.py story01 th
```

It shortens long pauses inside lines, lays the lines end to end, and writes `window.T`:
`T.l3` is where line 3 starts, `T.p3[1]` where its second phrase starts, plus any named
moment you defined. The docstring of `kit/build.py` has the details. Print the phrase list
it reports and note which words each phrase starts with; those are your cues.

Never write a number of seconds into the film that is not derived from `T`. Then a new take
or another language moves everything with it.

### 5. The film: storyboard first, then motion

**Storyboard.** Draw the things the story needs and lay out every scene as it looks when
its line ends: shapes, colours, positions, labels, the narrator's corner left free. Things
may simply be there; motion comes later. Then make one picture with a frame per line:

```
python kit/build.py story01 th
python kit/storyboard.py story01 th
```

Look at `storyboard-th.jpg` yourself first and fix what is plainly wrong, once. Then show
it to the user and wait. This is where the look is decided: what users asked to change
after seeing a finished film was almost always how it looked (a still opening, dull
colours, a circle that did not read as the Earth), and all of that is visible in stills.
Changing it here costs minutes; after the motion is built it costs half the film.

**Motion.** After approval, make everything arrive, change and leave. Keep the approved
end states: the storyboard frames should still match the film at those times.

Write the story's drawings and `film.js`. Read `references/film-craft.md` first: it has the
kit's functions, the structure that worked, and the mistakes that cost the most time. Read
the style file of the chosen look (`references/looks.md` lists them).

What makes these films worth watching, in order of effect:

1. **The subject builds itself in the first two seconds.** Construction lines are on screen
   at frame zero, then outline, then colour, then detail, then it moves. Never open on a
   still picture or an empty frame.
2. **The story's subject changes state on screen.** Cells fill, walls go up, a circle is
   squeezed into a hexagon, a perimeter unrolls into a bar. Things do not "appear".
3. **The camera keeps moving and never cuts inside a world.** Lay all diagrams out on one
   large page and travel between them.
4. **A change of scale every few seconds**: whole comb, one cell, one wall.
5. **Detail that code is good at**: six hundred hairs, each a seeded line; paper grain.
6. **Bright grounds and props that suit the scene** (`references/style-fine-bright.md`).
   Asked for by the user after a first set of stills on plain paper looked tidy but dull.

### 6. Verify with stills

```
cd story01/build/th
npx hyperframes lint
npx hyperframes snapshot --at 0.5,2.4,6.6,... --no-end -o <temp folder>
```

Take a frame near the **end** of every line (that is when everything for that line should be
on screen) plus the frames just after each change of scene. Open the contact sheets and
check each frame against the script table. Look for: text in a fallback font, things that
should have appeared and have not, labels over the subject, anything in the narrator's
corner, anything cut by the frame edge. Fix and re-snapshot only the affected times. Once, also check that a frame does not depend on
the frames drawn before it (film-craft.md, section 1).

Show the user the contact sheets when the look is new or the layout is uncertain; a wrong
direction is far cheaper to catch here than after a render.

After the render, check **every frame**: `python kit/frame_sheets.py Story-v1.mp4
story01/frame-check` makes one numbered sheet per two seconds. Read them all before you
deliver. In practice this found faults that stills at line ends never show: labels that
stayed at full strength while their scene faded out, a jump at a scene change, a narrator
blinking on the frame chosen for a cover. A second language of the same picture can be
checked at 6 frames per second.

### 7. Render and deliver

```
npx hyperframes render --fps 30 --output <temp>/raw.mp4
ffmpeg -i raw.mp4 -c:v libx264 -crf 19 -preset slow -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "Story-Title-v1.mp4"
ffmpeg -i "Story-Title-v1.mp4" -af loudnorm=print_format=summary -f null -
```

A one-minute film renders in about four minutes; run it in the background. Aim near
-16 LUFS. Tell the user where the file is, its length, a table of what happens when, what
you verified and what you could not, and what to watch and listen for. Keep every earlier
version: write `-v2`, never overwrite a file the user may have open.

Then a cover (a frame of the film under the series' title band, chosen when the narrator's
eyes are open: the kit blinks when `t % 3.7 > 3.56`) and a post text, one `.txt` file per
story in a `posts/` folder, named after the video it goes with. The post opens with the
question and does not give the answer away.

### 8. Another language

The film is the same file; only words and timing change.

1. Translate the script for the ear, not word for word, and convert what the audience
   expects converted (units, calendar eras). Generate, check and cut as in step 3.
2. Wrap every on-screen word in `L(thai, english)` with
   `const L = (a, b) => (T.lang === "en" ? b : a);` near the top of `film.js`. Long strings
   in the second language often need their own line breaks or position: check every label.
3. Phrases fall in different places in another language. Take phrase starts from
   `words.py` and list them under `"phrases"` in `story.json`, so `T.p5[2]` still means
   "the moment the third thing is named".
4. Build, snapshot, and re-check the first language too: it must not have changed.
5. If the second language's line has fewer phrases than the film uses, `build.py` stops
   with "list index out of range": give that line's phrase starts in `story.json`.

## The narrator (optional)

A cut-out character in the bottom-left corner whose mouth moves with the narration. A story
works without one; nothing in `film.js` has to change except leaving the corner free. If the
user has a character, read `references/narrator.md`: picture set, prompts, preparation, the
pose plan, and how to lay the film out around the corner.

## Characters that act, and longer films (optional)

When the story needs someone to do things in the scenes, or runs past a minute and a half:

- `references/puppets.md` - a sticker puppet (head, body, hands and shoes are pictures;
  arms and legs are drawn), a supporting cast that shares its rig, prop stickers, the
  prompts for every sheet, how the sheets are cut, and the rule for what is a sticker and
  what is code: **anything that must break, change or disappear on screen is code.**
- `references/long-films.md` - one narration recording as the film's clock, named moments
  shared by picture and sound, a storyboard of every shot, acts approved one at a time,
  and assembling the whole.

The approvals change: the frame agreement, a short test of anything new, the storyboard
table, then each act, then the assembled film. The rule that you cannot see motion or hear
audio applies to every one of them.

## Series work

- Keep a glossary of the project's own terms and record decisions that are hard to undo
  (the look, the voice, where the narrator stands) with the alternatives that were rejected.
- Reuse drawings across stories by moving them from a story file into a shared file.
- After each approved story, add what you learned to a notes file, and keep a handoff file
  current so a fresh session can continue without the conversation.
- A series title: put it in front of each story as its own file. Do not make one long
  compilation of several stories unless asked.
- Keep the source of a title (picture and sound separately), so it can be joined to the
  next story even if the joined files are moved away.

## Care with keys, quotas and other people's work

- The TTS key stays in the environment or `.env`. Never read it into the conversation, and
  remind the user to leave `.env` out when they share or zip the project.
- Free TTS tiers have small daily quotas and may use submitted text to improve the
  provider's products. Say what each generation costs before running it.
- A reference video is for learning structure and pacing. Write original scripts and draw
  original pictures.
- Never put a real person's likeness, such as the user's narrator pictures, into anything
  that will be shared, including this skill's folder. The same goes for a character the
  user designed: bundle prompts and code, not their pictures.

## Bundled files

- `scripts/kit.js` - maths, easing, ink lines, paper and grain, text and labels, camera.
- `scripts/host.js` - the narrator: pose plan, mouth from loudness, blinking.
- `scripts/page.html` - the page the renderer opens; filled in by the build.
- `scripts/build.py` - narration to timeline (`window.T`), mouth track, soundtrack, page.
- `scripts/make_voice.py` - whole-script TTS in one request (Gemini API).
- `scripts/words.py` - word times and pauses of a recording.
- `scripts/prep_narrator.py` - narrator pictures to pose assets.
- `scripts/synth.py` - synthesized music and effects.
- `scripts/storyboard.py` - one captioned frame per narration line, for the storyboard approval.
- `scripts/globe.js` with `scripts/data/land-110m.js` - the Earth as a globe with real
  coastlines (Natural Earth, public domain). Optional: list both in a story's `scripts`.
  Use real map data for anything geographic; never trace or scrape a map image, and do not
  sketch continents by hand when the user wants the Earth to look like the Earth.
- `scripts/fonts/` - Pridi 700 (Thai and Latin text) and Kanit 900 (Latin numerals), both
  under the SIL Open Font License. Replace them for another script and rename in
  `page.html` and `kit.js`.
- `scripts/stage.js` - for films with scenes and people: hand-cut shapes, grain, arrivals
  and falls, key words, subtitles, bubbles, prop stickers, wipes. Calls `cut()`, which one
  look file defines.
- `scripts/look-paper.js`, `look-ink.js`, `look-crayon.js` - the looks; load one.
- `scripts/puppet.js` - the sticker puppet and its cast.
- `scripts/prep_parts.py`, `scripts/prep_cast.py` - part sheets to puppet, cast and prop
  pictures.
- `scripts/build_film.py` with `scripts/film_page.html` - one act or a whole longer film,
  on the clock of one narration recording.
- `scripts/pauses.py` - the short silences in a recording, for phrase starts.
- `scripts/frame_sheets.py` - every frame of a film on numbered contact sheets.
- `references/work-order.md` - the short work order.
- `references/style-fine-bright.md` - the fine line, bright look.
- `references/film-craft.md` - how to write `film.js`, the kit's functions, pitfalls.
- `references/looks.md` - the menu of looks, how one is chosen, how to add one from a
  reference film.
- `references/style-sketchbook.md`, `style-cut-paper.md`, `style-flat-ink.md`,
  `style-crayon-layers.md` - one file per look, each saying how far it has been proven.
- `references/narrator.md` - everything about the optional narrator.
- `references/puppets.md` - sticker puppets, cast, props and their prompts.
- `references/long-films.md` - films in acts.
- `references/animation-rules.md` - the eight classic rules of animation (squash and
  stretch, walks, the take, mouths and the rest), the numbers that worked here, and how far
  each has been tested. Read it before writing any character's motion.
- `examples/honeycomb/` - a complete one-minute story without its audio.
- `examples/mathless/` - one act of a three-minute film with puppets, without its audio
  and pictures.
