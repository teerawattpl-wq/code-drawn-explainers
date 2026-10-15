# Eight rules of animation, and the numbers that worked here

The classic beginner's course in animation has eight exercises. Each one names a way that
stiff motion goes wrong. This file says what each rule means for a film made of pictures
moved by code, which numbers were tried, and how far each has been tested.

Status words: **passed** = used in a clip the user watched and accepted. **tested** = built
and checked in stills, motion not judged by a person. **not tried** = an idea only.

Stills cannot show motion. Whatever this file says, a new move is not finished until a
person has watched it. Tell them which seconds to watch.

## The rules at a glance

| # | Rule | What goes wrong without it | Status here |
|---|---|---|---|
| 1 | Bouncing ball: squash and stretch | A jump or a landing looks like a picture sliding | Passed, on sticker poses |
| 2 | The wave: follow-through | Ears, tails, tags and cloth move as one block with the body | Not tried (needs separate pieces) |
| 3 | Walk and run | Legs flicker, feet slide on the ground | Tested on a jointed puppet |
| 4 | Weight | A heavy thing is lifted like an empty box | Not tried |
| 5 | The take | Surprise is a single jump of the arms | Passed |
| 6 | Dialogue | A mouth that only opens and shuts | Two shapes passed; more shapes not tried |
| 7 | Four-legged walk | Legs move in the wrong order | Not tried |
| 8 | Effects | Splashes and smoke appear and vanish at one size | Partly: thrown crumbs on arcs passed |

## Rule 1: squash and stretch

Before it leaves the ground a body sinks; in the air it is long; on landing it is short and
wide, then recovers. Keep the volume: when the height changes by `s`, change the width the
other way by about `0.6 * s`.

Numbers that worked for a jump on a jointed puppet (tested): crouch for 0.28 s before
take-off; longest at take-off and just before landing, +13% tall; on landing -20% tall, then
a small rebound over 0.42 s.

For a sticker that is one whole picture (passed), the same rule becomes three small moves
around every change of pose:

- **Sink before the change.** For the last 0.17 s of the old pose its height drops by 7%
  (16% for a big reaction).
- **Arrive stretched, then settle.** The new pose starts 10% too tall (16% for a big
  reaction) and rings down: `1 + a * cos(17 * e) * exp(-6.5 * e)` for `e` seconds after
  the change, about 0.7 s in all.
- **A hop** of 26 to 44 pixels over 0.3 s for an excited pose.

A pose that is hit by something arrives squashed instead: use a negative `a`.

Scale about the feet, not the middle, or the character floats.

## Rule 2: the wave (follow-through)

A loose part starts late and stops late. On a puppet with a drawn arm, letting the hand lag
the shoulder by 0.07 of a walk cycle was enough to read as a swing (tested).

A sticker that is one picture has no loose parts. To give it follow-through, the part must
be its own piece on a pivot (see `moving-parts.md` in the paper-cutout-shorts skill). Not tried in this style.

## Rule 3: walk and run

A normal walk is about two steps a second (12 or 13 frames a step at 25 frames a second). A
run is about seven frames a step. The first walks made here ran at six steps a second, three
times too fast, which is why they flickered.

What made the walk read (tested on a jointed puppet):

- Two steps a second.
- **The step length comes from the speed**, not the other way round: one cycle of two steps
  moves the body exactly two step lengths. Then a planted foot stays where it is planted.
- The body is lowest just after a foot lands and highest as the other leg passes: 9 pixels
  on a figure 330 pixels tall.
- The arms swing against the legs.

A character drawn facing the camera looks cross-legged when it walks sideways. Walks need a
side or three-quarter view.

## Rule 4: weight

Before a heavy lift the body and head rise first, the feet stand close to the load, and the
steps afterwards are quick so the weight is never long on one leg. A drag moves in short
pulls. Not tried here. If a story needs it, make a five-second test first.

## Rule 5: the take

Surprise has four keys, not one:

1. **Sees it** (0.16 s): a small lean away.
2. **Squashes down, eyes shut** (0.17 s): 16% shorter.
3. **Shoots up** (0.1 s): the surprised pose, 16% too tall, with a hop.
4. **Settles** (0.35 s).

With stickers, keys 1 and 2 are done on the old pose (a small turn, then the sink) and the
picture is swapped at key 3. A tremble of 1.6 pixels while the character is being stared at
holds the moment. Passed.

## Rule 6: dialogue

Two mouths, closed and open, switched by the loudness of the voice, pass at short-film
length. Two details matter:

- A mouth held open through a long loud stretch reads as a shout. Shut it for one frame in
  every five.
- The open and closed pictures must lie exactly on each other, or the whole body shimmers
  with every syllable. `pose-sheets.md` in the paper-cutout-shorts skill says how to get that from an image tool.

More mouth shapes (a wide one, a round one) are the next step. Not tried.

## Rule 7: four-legged walk

Know the animal first. Hoofed animals and pawed animals are built differently, and camels
are said to pace (both legs of one side move together) rather than walk like a horse. That
has not been checked here; check it against real footage before animating a camel walking.
The one four-legged walk made so far was two whole pictures flipped, with only the legs
changed between them.

## Rule 8: effects

Things thrown or splashed have phases: they burst out fast, hang, and fall. For crumbs flying
off a plate (passed): each bit has its own start time and its own arc, a straight line from
start to end with `sin(pi * u)` of height added, 0.55 to 0.75 s long; in a sticker film each
bit gets a white edge so it belongs with the stickers. Water, smoke and fire in phases have
not been tried.

## Where the numbers come from

A twelve-second before-and-after clip (the old way on the left, the rule on the right) for
rules 1, 3 and 5, and one finished thirty-second episode with two sticker characters and a
machine. Make such a clip again whenever a rule is used in a new way: it costs minutes and
it is the only way the user can judge a number.
