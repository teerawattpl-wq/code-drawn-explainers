# The crayon-layers look

A landscape coloured in pencil: every surface is flat colour with short strokes over it,
near things have a dark outline and far things have none, and the scene is eight layers
deep. Learned from stills of a reference film and tried here on **one five-second shot**.
The problems that shot showed are listed below and are not solved. Code:
`scripts/stage.js` with `scripts/look-crayon.js`.

## Layers, far to near

The look is the layering. A scene with fewer than six of these reads as a flat cartoon.

| # | Layer | How |
|---|---|---|
| 1 | Sky | vertical gradient of three stops, a few white specks, light strokes (`{ tex: 0.3 }`) |
| 2 | Sun or moon, clouds, birds | no outline; clouds get a shaded lower edge by clipping a pale band into them |
| 3 | Two ranges of mountains | no outline; the far range paler; strokes down the slopes; white caps |
| 4 | A row of small trees | simple circles and triangles, thin outline (`{ ink: 2.5 }`) |
| 5 | A lake | one band, the mountains again upside down at low opacity, short wave lines |
| 6 | Grass | gradient light to dark, a wobbly outlined edge, a dashed rise, tufts, daisies, stones, mushrooms |
| 7 | The subject and tall flowers beside it | medium outline (`{ ink: 4 }` to 5), a shadow on the ground |
| 8 | In front of the camera | big leaves at the bottom corners and a branch across a top corner, thick outline (`{ ink: 7 }`); small glowing lights added on top |

## Surface

- `crayon(fill, { ink, tex, shift, turn })` fills the path, lays the stroke pattern over it,
  and outlines it if `ink` is given. `cut()` in this look is `crayon` with a 5 px outline,
  so labels and bubbles join in.
- Paper grain (`PGRAIN`) on top of everything, as in the cut-paper look.
- Lights are drawn last with `globalCompositeOperation = "lighter"`: soft radial dots that
  drift, the sun's reflection on the lake.

## Line

Outline width is distance: none for sky and mountains, thin for the far trees, medium for
the subject, thick for what is nearest the camera. This is what separates the layers; do
not give everything the same line.

## Colour

The reference used a muted pastel set that shifts with the time of day (dawn pink, day
blue, night indigo), with the character as the one warm colour. The test here used vivid
colours because the project asked for them, and the look survived it. A palette that
changes during the film is the reference's main event: all objects stay where they are
and only the colours move.

## What the test shot showed

- **The strokes read as rain.** One direction and one length over grass and mountains
  look like weather. Reduced on the sky; still visible elsewhere. To fix: shorter strokes,
  two or three directions, a different `turn` for each surface.
- **A sticker character does not belong.** A die-cut white border beside outlined,
  hatched scenery looks pasted on. The reference's character was drawn by code in the same
  crayon. Use this look with code-drawn characters, or draw the puppet without its border
  and with the strokes over it.
- **It is busy.** Flowers, stones, leaves and lights all compete with labels and
  subtitles. Keep text large and give it a plain bubble.
- **It costs more.** The shot rendered about 35% slower than the same shot in cut paper,
  and took several times as long to draw: every layer is hand-placed.

## When it is the right choice

One place for the whole film, a small cast drawn by code, a calm subject. It is a poor fit
for a film with many locations: eight layers per location is most of the work of the film.
