# The sketchbook look

Ink and flat colour on warm paper, as if a naturalist's notebook came alive. This is the
look of `examples/honeycomb/`. A different look is a different file in this folder with the
same headings; the workflow in SKILL.md does not change.

## Surface

- **Paper** `#f3e9d2` with fine specks and faint fibres (`makePaper()`), a soft warm
  vignette (`vignette(1)`), and print grain drawn over every frame last.
- **Blueprint night** `#10142c` with a faint 60 px grid, used only for the opening seconds,
  while the subject is still construction lines in chalk blue (`LAV`). It turns into paper
  as the subject is inked. Do not use the dark background for diagrams.

## Colour

| Role | Value |
|---|---|
| Ink (outlines, text) | `#2b2622` |
| Main fill, three tones | `#f3bf4a`, `#eaa426`, `#dc8e12` |
| Emphasis in text, "walls", measures | `#b8580b` |
| Winner, highlight | `#f2a516` to `#c9760a` |
| The one alarm colour (gaps, errors) | `#e8437f`, text `#d81b60` |
| Stamp | `#c0392b` |
| Light marks over a dark or busy picture | `#fff8e6` |

One warm family plus ink, and a single contrasting colour reserved for "this is the
problem". Derive the main fill from the story's subject (honey here; leaf green, sea blue).

## Line

- Outlines 2 to 3 px in ink for subjects, 5 to 6 px for diagram shapes seen from afar.
- Every outline comes from `P()`, so it wobbles slightly. Never a perfect CSS shape.
- Flat fills are offset 4 to 5 px from their outline, like a print slightly off register.
- Shading is ink: short hatching lines and stippled dots, seeded. Gradients only inside a
  subject (a ball of fur, a pool of honey), never as a background.
- Detail in numbers: hundreds of short seeded strokes for fur, a dozen veins in a wing,
  three bubbles and a highlight in a cell.

## Motion

- Lines draw themselves (`stroke` with a growing fraction), then colour arrives, then
  detail. 0.5 to 0.8 s for an outline, 0.3 s for a fill.
- Things arrive with `back()` (a small overshoot) and leave by falling or fading, never by
  popping off.
- Patterns spread from a point: delay each element by its distance from the source.
- Camera moves ease in and out and take 0.5 to 1 s; a slow drift continues between moves.
- Something on screen is always moving a little: a sway, a shiver, a pulse on the item
  being discussed.

## Diagram devices that worked

- **Squeeze**: one shape interpolates into another (hexagon to circle) as a radius
  function of angle.
- **Fail first**: before showing the shapes that work, let shapes that do not work try and
  fall away, with the alarm colour showing the gaps.
- **Unroll**: a perimeter leaves the shape and becomes a bar whose length is the number.
- **Counter riding the camera**: a year or a total in screen space, computed from the same
  eased value that moves the camera along a timeline.
- **Stamp**: a rotated red frame and word that lands at 1.7 times size and settles.
- **Showdown**: contenders orbit the winner and drop one by one; rays behind what is left.
- **Measuring marks**: thin light lines, ticks and an angle arc drawn over the real thing
  make it feel observed.

## Type

Pridi 700 for words, Kanit 900 for numerals and Latin display. Labels are paper tags with
a 3 px ink border; headings may be bare text on paper. Sizes on a 1080 px wide frame: 46
to 60 for labels, 96 for a key phrase, 200 for a counter.
