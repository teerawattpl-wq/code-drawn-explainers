# The looks, and how one is chosen

A look is how every surface in the film is drawn. Each look has a style file in this folder
and, for films built on `stage.js`, a `scripts/look-*.js` file. This file is the menu.

## The menu

| Look | Style file | Code | Status | Suits |
|---|---|---|---|---|
| Sketchbook | `style-sketchbook.md` | `kit.js` (`P`, `makePaper`) | **Proven**: four one-minute stories | Nature, science, anything that builds itself from construction lines; no people on screen |
| Cut paper, vivid | `style-cut-paper.md` | `look-paper.js` | **Proven**: one three-minute film, 48 shots | Stories with characters acting, many places, a young audience |
| Cut paper, soft | `style-cut-paper.md`, "Soft palette" | `look-paper.js` | **Seen only**: read from stills of a reference film | Formal subjects, an organisation introducing itself |
| Flat ink | `style-flat-ink.md` | `look-ink.js` | **Used, then replaced**: two acts were made in it and remade in cut paper | A quick draft; a deliberately plain cartoon |
| Fine line, bright | `style-fine-bright.md` | `look-paper.js` + `stage.js` | **Proven**: three stories | Science and maths stories for a young audience; anything with a diagram that should pop |
| Crayon layers | `style-crayon-layers.md` | `look-crayon.js` | **Tried once**: one five-second shot | One place for the whole film, a character drawn by code |

Status means what it says. "Proven" looks have been through a whole film and the user's
viewing. "Tried once" means a test shot exists and its problems are written down, not
solved. "Seen only" means nobody has built it here. Before promising a film in a look that
is not proven, make a test shot.

## Choosing: once per series, with a comparison shot

Ask before the storyboard, once for a series of films; later stories keep the look without
asking again. Do it in this order:

1. Recommend one look from the "Suits" column, in a sentence that says why.
2. Do not let the user choose from descriptions. Twice in one day a look chosen from words
   was changed after the user saw it, and the second time two finished acts had to be
   remade. Build one shot of about five seconds, the same shot, in the two looks nearest to
   what they want, join the two takes into one clip with a label in the corner saying which
   is which, and let them choose from that. It takes about ten minutes.
3. Record the choice and the rejected alternative in the project's decision notes.

Making the comparison is cheap because of how `stage.js` is built: everything that draws a
surface calls `cut(fill, o)`, and the look file defines `cut`. A shot written with `cut`,
`cutRect`, `cutBlob`, `keyword`, `bubble`, `paperCloud` and `paperTree` changes look by
changing `"look"` in `film.json` and nothing else. A look's richer features (the crayon
look's layers, the paper look's grain) still have to be drawn for it; the switch gives the
user an honest first impression, not the finished look.

Things the comparison showed that descriptions had not:

- Whether the character belongs to the scene. A sticker with a white die-cut border sits
  naturally on cut paper and looks pasted onto a crayon drawing.
- How much the scenery competes with the text. More layers and outlines mean labels and
  subtitles stand out less.
- Whether "vivid" survives. Texture that is lovely on muted colours can turn bright ones
  muddy.

## Adding a look from a reference film

When the user sends a film and says "look at how this one is drawn":

1. Get the film and make a contact sheet (`ffmpeg -vf "fps=2,scale=480:-2,tile=5x4"`), then
   three or four full-size frames. Say plainly that stills are all you can judge: not the
   motion, not the sound.
2. Read these off the frames, and write them under the same headings as the other style
   files:
   - **Layers**: list them from far to near. Count them. What frames the picture in front?
   - **Edges**: is there an outline? On everything, or only on near things? Is the edge of a
     shape straight, wobbly, torn?
   - **Surface**: flat, grained, hatched? Does a shape cast a shadow on the one below?
   - **Colour**: how many hues, how saturated, what is the one accent? Does the palette
     change during the film (time of day, mood)?
   - **Light**: anything that glows or is added on top (stars, sparkles, rings)?
   - **The character**: drawn by the same hand as the scenery, or a different material?
   - **Structure**: one place for the whole film or many? Cuts or one continuous camera?
3. If a remake or a second version of the same idea exists, compare them: the difference
   between a rich original and a flat remake names the technique that carries the look.
   (In one such pair the scenes were identical and only the pencil texture and grain were
   missing from the flat one.)
4. Say which parts fit the current project and which contradict what the user already
   decided (a pastel palette against a request for vivid colour).
5. Add the look to the menu as "Seen only". It moves to "Tried once" after a test shot and
   to "Proven" after a whole film the user has watched. Write the style file when the
   first test shot is made, with what went wrong in it.

A reference film is for learning technique. Do not copy its character, its scene or its
text.
