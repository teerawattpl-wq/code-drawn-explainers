# The cut-paper look

Sheets of coloured paper, cut by hand and laid on one another. No outlines anywhere in the
scenery; depth comes from a thin shadow under every piece. Proven on a three-minute film
with a sticker puppet as the lead (`examples/mathless/`). Code: `scripts/stage.js` with
`scripts/look-paper.js`.

## Surface

- **Every shape is a piece of paper**: `cut(fill)` fills the current path with a soft
  shadow below it (`PSH`, blur 12, offset 3 right and 6 down). A piece lying on another
  piece gets a smaller shadow (`{ blur: 6, dy: 3 }`); a piece far above gets a larger one.
- **Edges wander**: build shapes with `cutRect`, `cutBlob` and `roughLoop`, which move each
  edge a pixel or two from true, as scissors do. The last argument before the options is a
  seed; give every shape its own number so no two edges match.
- **Grain over the whole picture**: draw `PGRAIN` (soft mottling and short fibres) after
  everything else and before the subtitle. It does not dull the colours.
- **Large flat areas need a second tone**: stripes on a wall, bands on a floor, dots on a
  plain background. Without them a big sheet reads as an empty rectangle.
- **The floor meets the wall under a strip**: a white skirting strip with its shadow falling
  on the floor, instead of a drawn line.

## Colour

| Role | Value |
|---|---|
| Vivid set, used in order for anything that comes in a row | `#ff3d5a` `#ff8a1f` `#ffd21f` `#2fd3a6` `#3aa0ff` `#7a4cff` `#ff5c8a` |
| Paper white | `#fffdf6` |
| Dark, for text and the few lines there are | `#2b2233` |
| Night and space | `#141a4d`, `#1c2a6b`, `#221a2e` |

- Full, unmixed colours. Each place has its own main colour (a bank mint green, a factory
  purple, a clinic light green), so the viewer knows the place has changed before reading
  anything.
- The lead character's colour must not be the background's. Put a yellow character in
  front of blue, green or purple.
- **Do not blend the sky from day blue to evening orange.** The mixture passes through
  grey, and grain makes it worse. Keep the sky one colour and tell the time with the sun's
  position and the length of the shadows.
- When something stops working in the story, drain its colour for a moment (mix towards
  `#b0b2be`, or `sticker(..., { sat })`), and bring the full colour back for the answer.

### Soft palette (seen in a reference, not built here)

The same construction with calm colours suits formal subjects: four greens for hills, a
pale sky, and four accents used in every scene (deep blue, coral, yellow, teal). People
are a circle and a rounded bar with no face. One stage (hills and a sun) serves the whole
film and only the props on the right change; a seedling in the first scene has grown into
a tree in the last. Text types itself on and the key word gets a highlighter stroke.

## Line

There are no outlines in the scenery. The only dark lines are inside the stickers (the
character, the props) and the few things that are lines by nature: clock hands, strings, a
flag pole, a dashed stitch round a rug. That is why the character stands out: it is the one
outlined thing on screen.

Anything that must look like a sticker gets a white die-cut border and the paper shadow:
the puppet does this itself, `sticker()` does it for props, and loose symbols take
`{ stroke: PAPERC }` in `txt`.

## Depth

Three or more layers in every scene, and something in front of the camera:

- far: the wall or sky with its second tone, and something hung on it (a string of flags,
  a sign, clouds);
- middle: the furniture or buildings, then the people;
- near: one thing at a corner of the frame that overlaps the scene (a pot plant, bushes,
  a counter). Keep it out of the subtitle's place.

## Motion

- Pieces arrive by growing from their middle with a small overshoot (`back`), or by
  dropping from above with one bounce (`drop`).
- Things that are lost fall out of what held them: digits off a clock face, ticks off a
  ruler, numbers out of a price tag (`meltText` for text that turns to dashes in place).
- Scenes change behind a slanted band of colour that crosses the frame (`wipe`), 0.4 s,
  centred on the moment the new sentence starts.
- Something always moves a little: flags sway, clouds drift, steam rises, the sun's rays
  turn.

## Devices that worked

- **Number on a blank sticker**: generate the banknote, the scoreboard, the measuring cup
  without any digits, draw the digits in code on top, then melt or drop them.
- **Split into wedges**: clip the same drawing into pieces around an off-centre point and
  move each piece along its own middle line (a pizza cut unfairly, a clock breaking).
- **Cards rubbed out**: an eraser crosses a card and a clip rectangle follows it.
- **Three panels**: three things in a row, each arriving on its own word and losing its
  marks half a second later; a question mark on each at the end.
- **Four dark cards that light up** one by one as each is named.
- **A model as a box**: icons flow into a machine, it shakes, a card comes out.
- **A heap that sits in its bowl**: a dome whose lower edge is the front half of the rim's
  ellipse, drawn after the bowl. A blob drawn behind the bowl looks as if it were outside.

## Type

Pridi 700 for words, Kanit 900 for numerals. Key words are bright cards (`keyword`), tilted
a few degrees, 60 to 84 px on a 1920 px frame. Spoken words are white bubbles with blue
text (`bubble`). Subtitles sit in a dark rounded bar at the bottom, 46 px, one phrase at a
time. Check that the font has every glyph you draw: the baht sign is in the Thai font and
not in the numeral font, where it comes out as a letter B.
