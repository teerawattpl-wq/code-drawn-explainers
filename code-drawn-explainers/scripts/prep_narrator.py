"""Turn a folder of narrator pictures into the assets host.js draws.

Usage:
    python kit/prep_narrator.py <source folder> <name> [--out narrator] [--flip pose,pose]

File names in the source folder, where <name> is the character's file prefix:
    <name>.png                 the standing pose, mouth closed
    <name>-open.png            the same picture with the mouth open
    <name>-blink.png           the same picture with the eyes closed
    <name>-<pose>.png          another pose, mouth closed       (e.g. teacher-point.png)
    <name>-<pose>-open.png     ... its mouth open
    <name>-<pose>-blink.png    ... its eyes closed
    <name>-<pose>-closed.png   use this when <name>-<pose>.png was drawn with the mouth OPEN:
                               the -closed file becomes the base and the plain file the open mouth
Open and blink pictures are optional per pose. A pose with no -open cannot talk; a pose with
no -blink does not blink.

What it does:
- The mouth-closed picture is the base. Only the mouth area of the open picture and the eye
  areas of the blink picture are pasted onto it, with a soft edge. Image generators redraw
  the whole picture a little differently every time, so swapping whole pictures makes the
  fabric or the outline shimmer; pasting only what changed does not.
- Every pose is scaled to the same figure height, and where the feet stand is recorded.
- --flip lists poses drawn facing away from the middle of the frame; host.js mirrors them.

Writes <out>/<pose>.png, <pose>-open.png, <pose>-blink.png and <out>/poses.js.
Requires: numpy, scipy, pillow.
"""
import argparse, io, json, os, sys
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
from scipy import ndimage

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("name")
ap.add_argument("--out", default=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "narrator"))
ap.add_argument("--flip", default="")
args = ap.parse_args()
SRC, OUT, FIG_H = args.src, args.out, 900       # every pose is scaled to this figure height
os.makedirs(OUT, exist_ok=True)

# ---- find the poses from the file names ----
have = {f[:-4] for f in os.listdir(SRC) if f.lower().endswith(".png")}
poses = {}
for stem in sorted(have):
    if stem != args.name and not stem.startswith(args.name + "-"):
        continue
    words = [w for w in stem[len(args.name):].split("-") if w]
    kind = words.pop() if words and words[-1] in ("open", "blink", "closed") else "plain"
    poses.setdefault("-".join(words) or "stand", {})[kind] = stem
SETS = {}
for pose, f in poses.items():
    if "closed" in f:                           # the plain picture has the mouth open
        base, files = f["closed"], {"open": f.get("plain"), "blink": f.get("blink")}
    elif "plain" in f:
        base, files = f["plain"], {"open": f.get("open"), "blink": f.get("blink")}
    else:
        print("skipped", pose, ": no mouth-closed picture")
        continue
    SETS[pose] = (base, {k: v for k, v in files.items() if v})
SETS = dict(sorted(SETS.items(), key=lambda kv: (kv[0] != "stand", kv[0])))


def load(stem):
    return Image.open(os.path.join(SRC, stem + ".png")).convert("RGBA")


def shift_of(a, b):
    """How far picture b is shifted from picture a, from their outlines."""
    fa, fb = np.fft.fft2(a), np.fft.fft2(b)
    r = fa * np.conj(fb)
    c = np.fft.ifft2(r / (np.abs(r) + 1e-9)).real
    y, x = np.unravel_index(np.argmax(c), c.shape)
    h, w = a.shape
    return (x if x < w / 2 else x - w), (y if y < h / 2 else y - h)


def changed_boxes(base, other, how_many):
    """Boxes around the largest areas that differ: one for a mouth, up to three for eyes."""
    g = lambda im: np.asarray(im.convert("L").filter(ImageFilter.GaussianBlur(4)), dtype=float)
    solid = (np.asarray(base.split()[3]) > 200) & (np.asarray(other.split()[3]) > 200)
    hot = ndimage.binary_dilation((np.abs(g(base) - g(other)) > 34) & solid, iterations=8)
    lab, n = ndimage.label(hot)
    comps = sorted(((int((lab == i + 1).sum()), sl) for i, sl in enumerate(ndimage.find_objects(lab))), key=lambda c: -c[0])
    keep = [c for k, c in enumerate(comps[:how_many]) if k == 0 or c[0] > 0.3 * comps[0][0]]
    print("     changed areas (px):", [c[0] for c in comps[:4]], "-> keep", len(keep))
    return [(sl[1].start - 18, sl[0].start - 18, sl[1].stop + 18, sl[0].stop + 18) for _, sl in keep]


info, flips = {}, set(filter(None, args.flip.split(",")))
for pose, (base_name, files) in SETS.items():
    base = load(base_name)
    pad = 24
    canvas = Image.new("RGBA", (base.width + 2 * pad, base.height + 2 * pad), (0, 0, 0, 0))
    frames = {"closed": base}
    for v in ["open", "blink"]:
        if v not in files:
            continue
        other = load(files[v])
        if other.size != base.size:
            other = other.resize(base.size, Image.LANCZOS)
        dx, dy = shift_of(np.asarray(base.split()[3], dtype=float), np.asarray(other.split()[3], dtype=float))
        print(pose, v, "offset", dx, dy)
        if (dx, dy) != (0, 0) and abs(dx) < 12 and abs(dy) < 12:
            moved = Image.new("RGBA", other.size, (0, 0, 0, 0))
            moved.paste(other, (dx, dy))
            other = moved
        elif abs(dx) >= 12 or abs(dy) >= 12:
            print("     WARNING: this picture is not the same drawing as the base; redo it")
        mask = Image.new("L", base.size, 0)
        d = ImageDraw.Draw(mask)
        for b in changed_boxes(base, other, 1 if v == "open" else 3):
            d.rounded_rectangle(b, radius=24, fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(7))
        out = Image.composite(other, base, mask)
        out.putalpha(base.split()[3])
        frames[v] = out
    a = np.asarray(base.split()[3]) > 8
    ys, xs = np.nonzero(a)
    k = FIG_H / (ys.max() - ys.min())
    feet = a[int(ys.max() - 0.06 * (ys.max() - ys.min())):ys.max() + 1]
    feet_x = np.nonzero(feet.any(axis=0))[0]
    for v, im in frames.items():
        c = canvas.copy()
        c.paste(im, (pad, pad))
        c = c.crop((xs.min(), ys.min(), xs.max() + 2 * pad, ys.max() + 2 * pad))
        c = c.resize((round(c.width * k), round(c.height * k)), Image.LANCZOS)
        c.save(os.path.join(OUT, pose + ("" if v == "closed" else "-" + v) + ".png"))
    info[pose] = {"w": c.width, "h": c.height, "ax": round(((feet_x.min() + feet_x.max()) / 2 - xs.min() + pad) * k),
                  "ay": round((ys.max() - ys.min() + pad) * k), "variants": [v for v in ["open", "blink"] if v in frames]}
    if pose in flips:
        info[pose]["flip"] = True

io.open(os.path.join(OUT, "poses.js"), "w", encoding="utf-8", newline="\n").write(
    "window.NARRATOR = " + json.dumps({"figure": FIG_H, "poses": info}) + ";\n")
print("poses:", ", ".join("%s%s" % (p, "".join(" +" + v for v in d["variants"])) for p, d in info.items()))
