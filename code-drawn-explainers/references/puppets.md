# Sticker puppets, a supporting cast, and prop stickers (optional)

A character that acts in the scenes for the whole film: its head, body, hands and shoes are
pictures the user generates; its arms and legs are lines the code draws, so a hand can
reach any point and the feet can walk. Other people in the story are the same rig with
other heads and bodies. Objects with an organic shape are stickers too.

Use this when the story needs someone to do things: wake up, buy lunch, kick a ball. A
story that is all diagrams does not need it, and a narrator who only talks from a corner
is `references/narrator.md`.

Who does what: you write the prompts and cut the sheets; **the user generates every
picture**. Never put a real person's likeness, or a character the user has not agreed to
share, into anything that will be shared, including this skill's folder.

## What to make a sticker and what to draw

| Sticker (a generated picture) | Code |
|---|---|
| People | Scenery, buildings, furniture, sky |
| Things with an organic shape or much detail: food, vehicles, instruments, animals, tools | Anything that must break, bend, fill, empty or disappear on screen: numbers, price tags, ticks on a ruler, candles, a lock that opens, a bridge that sags |
| | Anything that carries a number: generate the object blank (a banknote with an empty oval, a cup with no scale) and draw the digits on it in code, so they can melt or fall |

A sticker is one rigid picture. If the shot needs part of it to move, it has to be code.

## The sheets

All sheets: 16:9, parts on a flat magenta background `#FF00FF` (the code removes it; white
fails because the head is white, and a "transparent" background usually arrives as a
checkerboard), no white sticker border and no drop shadow on any part (the code draws one
border round the assembled figure; parts with their own border show seams at the neck and
shoulders), no magenta or pink-purple on the character, the largest image size offered.

| Sheet | File | Contents |
|---|---|---|
| Master | `master.png` | the character whole, front view, arms away from the body. Generated first, as often as it takes; the chosen one is attached to every later prompt |
| Heads | `heads.png` | 12 heads, 4 x 3: calm, calm talking, happy, happy talking, confused, confused talking, shock, thinking, sad, overjoyed, amazed, blink |
| Parts | `parts.png` | the body, six hands (open, point, palm up, fist, grip, wave), three shoes (left, right, front) |
| Cast heads | `cast-kids.png`, `cast-adults.png` | 3 people x 4 faces per sheet: calm, happy, confused, shock |
| Cast bodies | `cast-bodies.png` | 8 bodies, 4 x 2: plain colours and uniforms |
| Wear | `cast-wear.png` | 8 things, 4 x 2: hats, a stethoscope, a microphone, a rolled plan |
| Props | `props-1.png` ... | 8 objects per sheet, 4 x 2 |

Six cast heads go a long way: a head plays several parts by changing its body and hat
(the same man is a clerk, a friend, a drummer and a builder). Give the supporting cast
something the lead does not have, or the reverse (the lead wears round glasses; nobody
else does), so the audience always knows who the lead is.

Limbs must be plain lines of even width in the master, because that is what the code
draws. A master with sleeves or jointed arms will not match its puppet.

## Prompts

Fill the bracketed parts. Keep the wording about the background, the border and the grid:
each line is there because a sheet failed without it.

**Master**

```text
A full-body character design of [a friendly cartoon stick-figure mascot], front view, standing straight, centered, the whole figure visible from head to shoes with empty space all around.

THE CHARACTER:
- HEAD: [a large, perfectly round white paper head with a soft pencil-shaded outline. Big round thick black glasses. Small black oval eyes, short thick eyebrows, a tiny hook nose, pink blush on both cheeks, a small friendly smile. No hair, no ears, no hat.]
- BODY: [a simple sleeveless tunic in bright mustard yellow, a plain trapezoid slightly wider at the bottom, no pockets, no pattern.]
- ARMS AND LEGS: thin plain black lines of even thickness, like a stick figure, with no clothing on them. Both arms hang down and are held clearly AWAY from the body, not touching it. Legs straight and slightly apart.
- HANDS: white cartoon glove hands with a black outline, open and relaxed.
- SHOES: [chunky teal ankle boots with a darker sole.]
- PROPORTIONS: the head is very big, about as wide as the body is tall. Short legs.

STYLE: [hand-made children's book illustration, watercolor wash with visible paper grain and soft pencil lines, clean bright colors, flat front lighting.]

BACKGROUND: one solid flat pure magenta color, hex #FF00FF, filling the whole image edge to edge. No gradient, no texture, no floor, no shadow.

DO NOT add a white sticker border or outline around the figure. DO NOT add a drop shadow. No text, no numbers, no props. Do not use magenta or pink-purple anywhere on the character.

Vertical image, 3:4.
```

**Heads** (attach the master)

```text
Use the attached image as the exact character reference. Draw ONLY THE HEAD of this character, twelve times, as a character expression sheet.

LAYOUT: one wide image, 16:9. A neat grid of 4 columns and 3 rows. Twelve heads, one per cell, all EXACTLY the same size, same round shape, same position inside their cell, all facing straight to the front, no tilt. Wide empty space between heads. No neck, no body, no shoulders, no hands, no text, no labels, no numbers, no grid lines.

THE HEAD (identical in all twelve): [repeat the HEAD line of the master].

ONLY the eyes, eyebrows and mouth change:
Row 1: (1) calm, small closed smile. (2) the same calm face, mouth open mid-speech. (3) happy, big closed smile. (4) the same happy face, mouth open in a wide talking smile.
Row 2: (5) confused, one eyebrow raised, small closed mouth pushed to one side. (6) the same confused face, mouth open mid-speech. (7) shocked, eyes wide, eyebrows high, mouth wide open. (8) thinking, both eyes looking up to the upper right, mouth pressed flat.
Row 3: (9) tired and sad, eyebrows drooping, eyes half closed, small frown. (10) overjoyed, eyes closed as two happy upward arcs, mouth wide open laughing. (11) amazed, looking straight up, eyebrows raised, small round open mouth. (12) the calm face of number 1 with both eyes closed as two short flat lines, small closed smile.

BACKGROUND: one solid flat pure magenta color, hex #FF00FF, filling the whole image edge to edge. No gradient, no texture, no shadows on the background.

DO NOT add a white sticker border or outline around the heads. DO NOT add drop shadows. Do not use magenta or pink-purple anywhere on the heads.
```

**Parts** (attach the master)

```text
Use the attached image as the exact character reference. Draw the SEPARATE BODY PARTS of this character as a parts sheet for a cut-out puppet. The parts must NOT touch each other. Wide empty space between all parts.

LAYOUT: one wide image, 16:9. No arms, no legs, no head anywhere in this image. No text, no labels, no numbers.

PARTS, in the same look as the reference:
1. THE BODY, large, on the left: [the tunic], front view, flat, with nothing attached to it.
2. SIX HANDS in a row at the top right, each cut off cleanly at the wrist, all about the same size: (a) relaxed open hand hanging down, (b) index finger pointing, (c) open palm facing up as in a shrug, (d) closed fist, (e) hand gripping an invisible thin object, (f) open hand with all fingers spread wide as in a wave.
3. THREE SHOES in a row at the bottom right: (a) side view pointing left, (b) side view pointing right, (c) front view.

BACKGROUND and DO NOT lines as in the heads prompt.
```

**Cast heads** (attach the master as a style reference)

```text
Use the attached image as the exact STYLE reference (the same look, the same round head). Draw ONLY HEADS, twelve of them, as an expression sheet for three NEW characters. These are different people from the reference character: [none of them wears glasses].

LAYOUT: one wide image, 16:9. A neat grid of 4 columns and 3 rows. One head per cell, all EXACTLY the same size, each centered in its cell, all facing straight to the front, no tilt. Wide empty space between heads. No neck, no body, no hands, no text, no labels, no grid lines.

EVERY HEAD: [the head of the master without what marks the lead]. The hair is small and stays close to the head.

Row 1, [a boy with short spiky black hair].
Row 2, [a girl with two small pigtails tied with red bands].
Row 3, [a boy with short curly brown hair].

The four columns are the same person with four expressions:
Column 1: calm, small closed smile. Column 2: happy, big open smile. Column 3: confused, one eyebrow raised, small mouth pushed to one side. Column 4: shocked, eyes wide, eyebrows high, mouth wide open.

BACKGROUND and DO NOT lines as in the heads prompt.
```

**Bodies, wear and props** follow the same pattern: "a neat grid of 4 columns and 2 rows,
one object per cell, each centered, wide empty space between them", a numbered list of
the eight objects, then the background and "do not" lines. For bodies say "the same
trapezoid shape and size as the reference tunic, front view, nothing attached". For props
add "no text, no numbers, no letters on any object" and name what must be blank ("a
banknote with an empty oval in the middle and empty corner circles").

**What to tell the user to check before sending a sheet back:** every head the same size
and facing front (if one is tilted or smaller, regenerate the whole sheet); each talking
face is its partner with only the mouth changed; no white border; flat magenta everywhere;
the body has no arms or neck attached; hands end at the wrist.

## Cutting the sheets

```
python kit/prep_parts.py [project]     character/raw/heads.png, parts.png -> character/parts/
python kit/prep_cast.py [project]      character/raw/cast-*.png, props-*.png -> character/cast/
```

Each writes one PNG per piece, a table of sizes and anchor points (`parts.js`, `cast.js`),
and a picture of all pieces on a blue card. **Look at the card before going on.** The
names of the people, bodies, things to wear and props are lists at the top of
`prep_cast.py`, in reading order of each sheet; edit them to match the sheets.

How the cutting works, because each rule replaced one that failed:

- A piece is everything whose middle lies in one grid cell. Finding pieces as separate
  blobs breaks on a drum with loose sticks or a cloud with a lightning bolt.
- A head is scaled so the face is 300 px across and placed with the centre of the face at
  a fixed point, so the head does not jump when the face changes. On heads with hair the
  face is found by fitting a circle to the skin of the chin and cheeks. Measuring the width
  of the skin instead made heads whose ears touch the face come out 10% too small.
- Each later face of a person is slid a few pixels onto the first so the hair stays put.
- Thin white lines on magenta do not survive the keying: a goal's net came out as a bare
  frame. Draw such things in code behind the sticker.
- A prop is as sharp as its cell: about 380 px wide on a 1672 px sheet. A prop that will
  fill half the screen (a banknote, a pizza seen from above) should be generated alone on
  its own sheet.

## The rig: `puppet.js`

`drawPuppet(pose, x, y, scale, t, who)` draws a figure with the ground point between its
feet at `(x, y)`. Positions inside a pose are in puppet pixels (the head is 300 across)
from that ground point, y up negative.

```js
const p = pupChain([
  { t: EV.start, d: 0.01, pose: { head: "happy" } },
  { t: EV.sees + 0.2, d: 0.2, ease: back, pose: { head: "shock", hL: [-128, -418], bL: 0.9, handL: "wave" } },
  { t: EV.sees + 1.1, d: 0.3, pose: { head: "confused", hL: [-108, -240], bL: 0.5, handL: "open", tilt: 0.07 } },
], now);
p.tilt += Math.sin(now * 2.1) * 0.012;          // never perfectly still
footShadow(x, y); drawPuppet(p, x, y, SC, now);
```

- A pose is `PUP_REST` with fields changed; `pupChain` carries every earlier change
  forward, so each key lists only what is new. `hL`, `hR` are where the hands are, `bL`,
  `bR` which way the elbows bend, `frontL`, `frontR` put an arm in front of the body,
  `fL`, `fR` the ankles, `lean` the body, `tilt` the head.
- `pupWalk(phase, stride)` returns the feet, hips and swinging hands of a walk; mix it into
  a pose with `Object.assign` while the figure's `x` moves.
- Faces: calm, happy, confused, shock, think, sad, joy, amazed, blink. `mouth: true` shows
  the talking picture of calm, happy and confused. For speech set
  `p.mouth = talking(now)` only while this figure is the one speaking.
- `who` picks a member of the cast: `{ head: "girl", body: "coral", hat: "party", neck:
  "stethoscope", shoe: 60 }`. `shoe` turns the colour of the boots. With no `head` the lead's
  own head is used, so `{ body: "vest", hat: "hat-yellow" }` is the lead at work. Keep these
  in one table in the story (`WHO` in the example). Cast heads have four faces; other face
  names fall back to the nearest, and their mouths do not move.
- `sticker(name, cx, cy, w, o)` draws a prop with a white border and a shadow;
  `{ wear: true }` takes it from the wear sheet (a microphone in a hand), `{ flat: true }`
  leaves out the border, `{ sat }` drains its colour. `stickerOn(name, x, base, w)` stands
  a prop on a line (a car on a conveyor, a tree on the ground).

## Things that went wrong

- **A hand across the face.** A hand aimed at something high lands on the head, because
  the arm is short and the head is large. Limit how steeply an arm may point (about 30
  degrees above level), and check every pointing pose in a still.
- **Hats.** Where each hat sits is a table in `puppet.js` (`CAST_HAT`: width, offset from
  the centre of the face, tilt). A new hat needs a still on every head that will wear it: a
  head band placed for a bald head floated above a head with a bun.
- **A child among adults.** Children are the same rig at about 0.56 of the screen size of
  the lead (0.86). Five of them in a row need about 230 px each or their hair overlaps.
- **Someone behind a counter.** Draw the figure first and the counter over it; choose the
  ground point so the shoulders clear the counter and the head clears whatever hangs above.
- **Bubbles and labels over heads.** A speech bubble's tail should end above the head, not
  on it; a hat makes the head taller than you remember.
- **No sitting pose.** The rig stands, walks, leans and lies down (lean about -1.25 with
  the body clipped by a blanket). A shot that needs sitting has to be staged standing.
- **The largest size.** The head picture is about 280 px wide, so a figure drawn at more
  than about 1.3 times scale goes soft. A face in close-up needs its own larger picture.
- **Pictures not loaded.** `puppet.js` registers its loading with the renderer; a still
  taken with other tools before the pictures arrive shows scenery and no people.
