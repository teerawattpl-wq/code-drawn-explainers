# The narrator in the corner

Optional. A cut-out character who stands in the bottom-left corner for the whole film, mouth
moving with the narration, blinking, changing pose with the script. Viewers read the voice
as this character's. The pictures are the only generated images in the film and the user
makes them; everything else here is code.

Decide with the user before the first story: whether there is a narrator at all, and whether
the character's voice here matches its voice elsewhere (a different voice in another series
is noticeable once the mouth moves).

## 1. The picture set

Per pose, three pictures that differ **only** in the face:

| File | Picture |
|---|---|
| `<name>-<pose>.png` | mouth closed |
| `<name>-<pose>-open.png` | mouth open, mid-speech |
| `<name>-<pose>-blink.png` | eyes closed |

The standing pose has no pose word: `<name>.png`, `<name>-open.png`, `<name>-blink.png`.
If a pose was first drawn with the mouth open, add `<name>-<pose>-closed.png` and the
plain file is used as the open mouth.

A useful first set is five poses: stand, point, think, thumbs-up, wave. Four more cover
most scripts: shrug (a question, a problem), surprise (a striking fact), counting on
fingers, an open hand presenting. Full body, transparent background, one consistent
outline style. Poses with a direction should face the **viewer's right**, toward the middle
of the frame.

## 2. Prompts for the user

The user generates the mouth-closed picture of each pose from their character reference,
then edits that picture twice. Write the prompts in English.

New pose (attach the character's reference picture):

```text
The same <character> as the attached image, identical face, hair and clothes, same
<material and outline style>, fully transparent background. New POSE: full body, standing,
<what the body and hands do>, <which way it turns>. EXPRESSION: <...>, eyes open, mouth
CLOSED <in a small smile>.
```

Mouth open (attach the pose just made):

```text
Edit the attached image in place. Change ONLY the mouth: open it as if in the middle of
speaking in a friendly way. Everything else must stay pixel-for-pixel the same: outline,
pose, hands, head position, eyes, hair, clothes, transparent background. Do not move,
resize or redraw anything else.
```

Eyes closed (attach the mouth-closed pose again):

```text
Edit the attached image in place. Change ONLY the eyes: close them, as two short gentle
curves exactly where the eyes were. The mouth stays exactly as it is. Everything else must
stay pixel-for-pixel the same: outline, pose, hands, head position, eyebrows, hair,
clothes, transparent background. Do not move, resize or redraw anything else.
```

Fix phrases to give with them:

- Checkerboard instead of transparency: `The background must be real transparency (alpha), not a checkerboard pattern and not white.`
- The edit moved: `The outline moved. Keep the exact same outline and position as the attached image. Only the <mouth / eyes> change.`
- The face drifted in a new pose: `The face must be identical to the attached image.`
- Wrong number of fingers: say exactly which fingers are up and which is held down.

## 3. Check and prepare

Look at every picture before using it: same face as the reference, the pose asked for, the
whole figure inside the frame, real transparency. Then:

```
python kit/prep_narrator.py <folder with the pictures> <name> --flip <poses facing left>
```

It pastes only the mouth area of each open picture and the eye areas of each blink picture
onto the mouth-closed base, scales every pose to one height, and writes `narrator/`. Read
its output:

- `offset 0 0` for each variant means the edit kept the drawing in place. A large offset
  prints a warning: that picture is a different drawing and has to be redone.
- `changed areas ... -> keep 1` for a mouth and `keep 2` or `3` for eyes is normal.

Haze or stray marks outside the figure in an edited picture do not matter; only the mouth
or eye area is taken from it. Preview each prepared pose next to its variants on a dark
background before building.

Keep the character's pictures out of anything shared, including this skill's folder.

## 4. The pose plan

In `film.js`, after everything else:

```js
const NARRATOR_PLAN = [
  [0, "wave"],
  [T.q, "shrug", "think"],        // the question
  [l2, "present", "stand"],       // a new subject
  [p2[1], "surprise", "stand"],   // a striking fact
  [p5[1], "three", "point"],      // "there are only three"
  [p6[4], "thumb"],               // the answer
];
```

Each row is a time, a pose, and a pose to fall back on if the first has not been drawn, so
a film works while the picture set is still growing. Change pose on the phrase that
motivates it, at most every second or two. Use the neutral standing pose for long stretches
of plain explanation. End on a positive pose with the title.

`film.js` calls `drawNarrator(t)` after the picture and before the grain.

## 5. Laying the film out around the corner

By default the feet stand at x 195, at the bottom edge, and the figure is 520 px tall on a
1080 x 1920 frame: clear of the like and share buttons on the right. Change it with
`window.NARRATOR_AT = { x, y, height }` in a story file.

Keep roughly x under 400 and y from 1380 down free in every scene:

- Move the subject with the camera's screen point, not by rearranging the world.
- Centre diagrams a little right of centre and above the middle.
- Put bottom labels to the right (x around 700), not centred.
- App captions cover the very bottom of the frame, so the legs may be hidden on some
  platforms; the face and mouth stay visible. A short caption on the post keeps it small.

A cut-out character and code-drawn ink are two different looks. It works because the
narrator sits in screen space with a soft shadow, as a sticker on top of the film, and
never enters the world.

## 6. How the mouth works

`build.py` measures the loudness of the narration fifteen times a second and writes one
character per step in `T.mouth`: open when the voice is clearly above silence and near the
local peak. It follows syllables, not mouth shapes, which is enough at this size. The
blink is a fixed rhythm, 0.14 s every 3.7 s, skipped while the mouth is open.
