# The flat-ink look

Flat colour with one dark outline of the same width round everything. No shadows, no
grain. Two acts of a film were made in this look and then remade in cut paper after the
user saw both side by side, so treat it as a draft look or a deliberately plain one. Code:
`scripts/stage.js` with `scripts/look-ink.js`.

## Surface

- `cut(fill)` fills the path and outlines it in `#2b2233`, 6 px by default
  (`{ ink: 8 }` for large things, `{ flat: true }` for no outline).
- The outline is drawn behind the fill at twice the width. A shape made of several
  overlapping circles (a cloud, a treetop) then has one outline round the whole instead of
  a line through every overlap.
- Leave `PGRAIN` out of `render`: grain belongs to the paper and crayon looks.

## Colour

The vivid set of the cut-paper look works unchanged. Because every edge is dark, colours
can sit next to each other without a tone between them.

## Line

One width for everything is what makes this look flat. The scenery has the same weight of
line as the character, so the character no longer stands out by being the only outlined
thing; give it the brightest colour on screen and keep the space round it clear.

## What the comparison showed

Against the same shot in cut paper, the user chose paper. In ink the sticker character and
the scenery are both outlined, so the scenery competes with it; in paper the character is
the one outlined thing. Depth is also missing: with no shadow and no change of line weight
everything sits on one plane. If this look is wanted, borrow the crayon look's rule and
vary the outline with distance (`{ ink: 3 }` far, `{ ink: 8 }` near).

## When it is the right choice

- A first pass to agree on layout and timing before the surfaces are worked up: the same
  shot code runs in paper afterwards by changing `"look"` in `film.json`.
- A film meant to look like a simple cartoon, with characters drawn by code in the same
  line.
