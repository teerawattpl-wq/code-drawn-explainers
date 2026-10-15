# Writing the film

`film.js` defines `render(t)`: given a time in seconds, draw that frame on the canvas, from
nothing, every time. The renderer asks for frames in any order, so a frame may depend only
on `t` and on values fixed while the page loaded.

## Contents

1. The rules that keep frames repeatable
2. Structure of a film
3. Timing idiom
4. The kit
5. Camera
6. Text and labels
7. Sound
8. Mistakes that cost the most time

## 1. The rules that keep frames repeatable

- No state carried from one frame to the next. No counters, no "previous position".
- No `Math.random()`, no clocks. Call `seed(n)` once at the top of the story's first file,
  then use `rnd()` **only at load**: decide every hair, speck and jitter once, store it in
  an array, and draw from the array in `render`.
- Reset the canvas state at the top of `render`: transform, alpha **and line style**:
  `ctx.setTransform(1,0,0,1,0,0); ctx.globalAlpha = 1; ctx.lineCap = "round";
  ctx.lineJoin = "round"; ctx.setLineDash([]); ctx.lineDashOffset = 0;`
  Canvas state survives from one call of `render` to the next, so a line cap or dash set
  while drawing second 20 changes how second 58 looks, depending on which frames were
  drawn before it. Balance every `ctx.save()` with a `ctx.restore()`.
- Test it: snapshot one late frame on its own, then the same frame after a list of
  earlier ones, and compare the two pictures. They must be identical.
- Images (only the narrator uses them) must be loaded before the first frame; `host.js`
  registers a promise on `window.__hf.buildReady` for that.

## 2. Structure of a film

Split the film into **worlds**. A world is one continuous space with one camera: the real
place (a honeycomb) or the page of diagrams. Inside a world the camera travels and never
cuts. Between worlds, cross-fade while both show the same shape at the same place and size
(the camera ends on one hexagonal cell; the page begins on a hexagon of that size), so the
change reads as the thing turning into its own drawing.

```js
const T = window.T, l2 = T.l2, p2 = T.p2 /* ... */;

function drawPlace(t) { /* background; ctx.save(); camApply(cam); world; ctx.restore(); screen marks */ }
function drawPage(t)  { /* paper; camera; sceneA(t); sceneB(t); ...; screen marks */ }

const layer = offscreen(), layerCtx = layer.getContext("2d");
function render(t) {
  t = Math.max(0, Math.min(T.dur, t));
  ctx = mainCtx; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  if (t < IN2) drawPlace(t);
  if (t >= IN1) { /* draw the page into `layer` while fading, straight to the canvas after */ }
  window.__lastT = t;
  if (typeof drawNarrator === "function") drawNarrator(t);
  ctx.drawImage(grain, 0, 0);                 // print grain over everything, last
}
```

Each scene on the page is a function that returns early outside its time window, draws in
world coordinates around its own centre, and is placed far enough from the others (a few
thousand pixels) that they never share a frame by accident.

Keep three layers apart in your head and in the code: **world** (moves with the camera),
**screen marks** (labels, counters, arrows drawn after `ctx.restore()`, fixed to the frame),
and **overlays** (narrator, vignette, grain).

Put a reusable drawing in a function that takes where and how it is, never time-specific
logic: `beeAt(x, y, rotation, scale, now, walkAmount, gaitClock, alpha)`. Give it a build
parameter if it assembles itself: `drawBee(bt, ...)` with `bt` running from bare
construction lines at 0 to finished at about 2.6, and a large value for "finished".

## 3. Timing idiom

Everything is `ph(t, start, duration)`: 0 before, 1 after, a ramp between. Wrap it in an
ease (`io` in-out, `out` settle, `back` overshoot) and use the result as a fraction: how
much of a line is drawn, how full a cell is, how far along a path something is.

```js
const fill = io(ph(t, p3[1] + 0.1, 1.2));                  // honey rises during the phrase
stroke(outline, io(ph(t, 0.05, 0.75)), 3, color);          // an outline draws itself
const a = ph(t, start, 0.3) * (1 - ph(t, end - 0.2, 0.2)); // appear, hold, leave
```

Start times are always a cue from `T` plus a small offset: `p5[2] - 0.05`. A stagger is the
cue plus `i * step`, or plus distance divided by a speed so a pattern spreads from a point.

Idle life costs one line and matters: `Math.sin(t * 5) * 0.012` on a wing, a slow sway.

## 4. The kit (`kit.js`)

| Group | Names |
|---|---|
| Frame | `W`, `H`, `ctx` (current target), `mainCtx`, `offscreen(fn)` |
| Random, at load only | `seed(n)`, `rnd()` |
| Maths | `cl` clamp 0..1, `lerp`, `ph`, `io`, `out`, `back`, `R3`, `TAU` |
| Colour | `INK`, `LAV`, `rgb([r,g,b], a)`, `mix(c1, c2, m)` |
| Ink | `P(svgPath, step)` path string to a slightly unsteady point list; `trace(pts, frac)`; `stroke(pts, frac, width, color)`; `clipTo(pts)`; `polyPath(pts)`; `polyFrac(pts, f0, f1)` part of an outline, for unrolling a perimeter; `hexPath(cx, cy, R)` |
| Surface | `makePaper()`, `paper`, `grain`, `vignette(a)` |
| Text | `txt(s, x, y, size, color, {align, font, stroke, sw})`, `tag(parts, cx, y, p, size)`, `leader(x1, y1, x2, y2, p)`, `FONT`, `NUM` |
| Camera | `camChain(cam0, keys, t)`, `camApply(cam)`, `camMix`, `w2s(cam, x, y)` |
| Events | `eventTimes(storyEvents(T))` (see section 7) |
| Globe, optional (`globe.js`) | `drawGlobe(R, {lon, lat}, {now})`, `globePoint(lon, lat, view, R)` to pin a place on it |

`P()` is how shapes get their hand-drawn look: write the outline as an SVG path string,
get back points with a small smooth wobble, and `stroke` any fraction of it. Design a
subject as a handful of such outlines around its own origin, plus arrays of seeded detail
clipped to them.

Draw order for a subject that assembles itself: guides (fading out) -> shadow -> parts
under the body -> body fill, pattern, detail, outline -> parts on top. Let one number `m`
(0 blueprint, 1 inked) drive line colour, fill opacity and guide opacity together.

## 5. Camera

A camera is `[zoom, worldX, worldY, screenX, screenY]`: that world point sits at that
screen point. `screenX, screenY` is how you keep the subject out from under labels or the
narrator without moving anything in the world.

```js
const KEYS = [
  { t: T.b - 0.15, d: 2.9, cam: [1, 540, 960, 540, 960] },        // pull back while the comb spreads
  { t: T.q - 0.1,  d: 0.6, cam: [6.2, cell.cx, cell.cy, 540, 900] } // dive into one cell
];
const cam = camChain(CAM0, KEYS, t);
ctx.save(); camApply(cam); /* world */ ctx.restore();
```

Each key starts moving at `t` and arrives `d` seconds later; zoom is interpolated on a log
scale so dives feel even. Start a move a little before the line it belongs to
(`l5 - 0.2`) so the picture arrives with the words. Cull what is off screen in dense
worlds (compare positions with the camera's view) or frames get slow.

Over empty paper nobody can tell the camera is moving. Draw faint marks fixed to the page
(small crosses every 240 pixels).

**Very large changes of scale** (a stick to a whole planet, a hundred times or more):

- Give the near and the far camera the same kind of focus point: a point on the surface of
  the thing. The focus is interpolated in a straight line; from a point on the surface to
  the centre of a ball, that line runs underground and the middle of the move shows the
  inside of the ball. The far view of a ball is `[zoom, topX, topY, screenX, topOfBallY]`.
- Draw things larger as the camera moves away, or they vanish:
  `const iconScale = (z) => (z < 1 ? Math.pow(z, -0.62) : 1)`, applied inside the local
  frame of each place so offsets grow with sizes. Fade small scenery out below a zoom.
- Use line widths in screen pixels: `ctx.lineWidth = px / zoom`.
- A world with a round ground needs a camera that turns, so close-ups are level. The kit's
  camera does not turn; add it in the film (see story 2 of the series this skill came from):

```js
const camRot = (cam) => -Math.asin(cam[1] / R) * cl((cam[0] - 0.4) / 0.8);   // level when close, upright when far
function camApplyR(cam) { ctx.translate(cam[3], cam[4]); ctx.rotate(camRot(cam)); ctx.scale(cam[0], cam[0]); ctx.translate(-cam[1], -cam[2]); }
```

  and a matching world-to-screen function for labels. Anything that computes what is in
  view (culling, rays that fill the frame) needs a margin once the camera can turn.

**True scale and exaggeration.** Keep the world physically true where you can: compute a
shadow from the angle of the light instead of drawing one. When the true picture is too
subtle to read (a 7 degree tilt), show the idea on a separate card that is openly
exaggerated and says so, and leave the world true.

## 6. Text and labels

- All on-screen words live in one table per language, chosen by `T.lang`.
- `tag()` draws a paper label with an ink border; pass parts with their own colour to
  stress one word. Labels are screen marks: they do not scale with the camera.
- The canvas can only use a font the page has already used. `page.html` warms both fonts
  with hidden text; if you add a font, add a hidden span for it.
- Numbers that count (years, lengths) are computed from the same eased value that moves
  the picture, so number and picture cannot disagree.
- On vertical video keep text out of the top 140 px, the bottom 260 px, and the right
  120 px, where apps put their own buttons and captions.

## 7. Sound

**Preferred: one list of moments for picture and sound.** Put `events.js` in the story
folder. It holds one function and nothing else, because it runs in the page and in the
build:

```js
function storyEvents(T) {
  return [
    { name: "stamp", t: T.p3[1] + 0.2, sfx: "thud", gain: 0.5 },
    { name: "travel", t: T.l4 - 0.3, sfx: "swish", args: [0.5, 500, 3600], gain: 0.16 },
  ];
}
```

In `film.js`: `const EV = eventTimes(storyEvents(T));` then time the action from
`EV.stamp`. The build plays each `sfx` (a function of `synth.py`) at the same `t`. A time
typed once cannot drift; when the same offset is typed in `film.js` and again in
`sound.py`, sooner or later one of them is edited and the other is not.

For sound that a list cannot express (a run of ticks, a custom sweep, different music),
`sound.py` in the story folder defines `cues(T, S, p)`. One call per event, at the same cue
the picture uses:

```python
def cues(T, S, p):
    for k in range(6):                                   # a flake of wax pressed onto the wall
        p(T["l2"] + 1.1 + k * 0.72, S.tap(), 0.26)
    p(T["l5"] - 0.2, S.swish(0.45, 600, 3800), 0.16)     # the camera travelling
```

`synth.py` has pop, tap, thud, boing, swish, rustle, whistle, bell, sparkle, and `sweep`,
`env`, `filt`, `noise` for custom sounds. Music defaults to a calm pad about 21 dB under
the voice; define `music(T, S)` in `sound.py` to change it. Give repeated events falling
gain so a burst does not turn into a rattle. Sounds added together must be the same length.

## 8. Mistakes that cost the most time

- **A still opening.** The first draft opened on a slow zoom over a fine illustration and
  the user's verdict was "a still picture is not interesting". Motion from frame zero.
- **Slides.** Diagrams on a dark background, each appearing in place and then cut to the
  next, read as a slide deck. One page, ink on paper, shapes turning into each other, a
  travelling camera.
- **Drawing with SVG and tweens.** It works for a few shapes and cannot carry hundreds of
  hairs or cells. Draw on the canvas from the start.
- **Pictures from an image generator as the subject.** They look richer than code and can
  only slide and zoom. If the subject must do something, draw it in code.
- **Timing from guessed seconds.** Anything not derived from `T` breaks on the next take
  and in the next language.
- **Phrases in another language.** Automatic phrase starts come from pauses; another
  language pauses elsewhere, and cues then fire on the wrong word. List them explicitly.
- **Fallback font on the first text frame.** See section 6.
- **Scripts that register the timeline from an external file.** The linter looks for
  `window.__timelines` in the page itself; keep that registration in `page.html`.
- **Order of random draws.** Inserting an `rnd()` call early changes every later random
  detail in the film. Add new seeded detail after existing detail, or give it its own
  generator: `const r2 = mulberry32(99)`.
- **Things under the narrator or the app's buttons.** Decide the free areas before laying
  out any scene; moving ten scenes afterwards is slow.
- **Line style leaking between frames.** A frame looked different depending on which
  frames were drawn before it, because `lineCap` was set by a label twenty seconds earlier.
  See section 1.
- **A camera path through the inside of the subject.** See section 5.
- **Elements that should be gone.** A scene function that does not return early outside
  its window leaves its last state on the page; the travelling camera will pass over it.
- **A name the kit already uses.** `INK`, `P`, `talking` and `pop` are taken by `kit.js`,
  `stage.js` or `host.js`; reusing one breaks the page with "render is not defined". Before
  the first build, search the kit files for each new top-level name.
- **`synth.swish(d, lo, hi)` needs lo < hi**, or the build stops with
  "Wn[0] must be less than Wn[1]".
- **Fading inside a scene: multiply, do not set.** `ctx.globalAlpha *= a`, never
  `ctx.globalAlpha = a`, or the thing ignores the scene's own fade.
