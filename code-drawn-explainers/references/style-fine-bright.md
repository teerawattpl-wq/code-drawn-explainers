# Look: fine line, bright

Thin ink lines and layered surfaces, on bright coloured grounds. It came from studying a
detailed reference animation: its detail came from thin outlines and many layers per object,
not from 3D. The user kept the detail but not the reference's muted colours, and later asked
for scenes that "look bright and pull the viewer in", which added the coloured grounds and
the rainbow strokes.

Status: **proven** on three one-and-a-half-minute stories (`look-paper.js`, `stage.js`).

## The surface rules

- Outlines 1.7-1.8 px in a dark warm ink. Never thicker except for the drawn line that is
  the story itself (a pen's trace: 5-7 px).
- Every object has layers: flat colour, a gradient, thin hatching on the shaded side,
  small marks (screws, scratches, stitching, wood grain), one highlight.
- One layer of paper grain over the whole frame at about 0.5 opacity (`PGRAIN` from
  `stage.js`). Not two: colours go grey.

## The bright additions

1. **A ground per scene.** Two colours top to bottom, a white grid at low opacity over it,
   soft darker corners. Each scene a different pair (sky blue, mint to yellow, deep violet
   for space, peach, lilac, pink, pale yellow). A dark ground only where the story is at
   night or in space.
2. **Colour on the subject.** Circles, rings and diagram pieces each in their own colour
   (step the hue by about 37 degrees); a pen line whose colour runs through the rainbow as it
   is drawn; a finished shape filled with a solid colour.
3. **Props that suit the scene, at the edges.** Clouds and leaves for a bird, flowers for a
   garden, planets for space, fish under a wave, paw prints and yarn for a cat. Lighter than
   the subject, kept to the edges and the lower half, moving slowly. They fill the empty lower
   half that the narrator's corner otherwise leaves.

No glow and no sparkle effects: props are drawn objects.

## Mistakes seen with this look

- A prop or label set with `ctx.globalAlpha = a` inside a scene ignores the scene's fade
  when scenes cross: it stays fully visible for several frames. Always multiply:
  `ctx.globalAlpha *= a`.
- Long English labels run off the right edge where the Thai ones fit; split them into two
  lines or move them for that language.
