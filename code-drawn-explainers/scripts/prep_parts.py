"""Cut the puppet's sticker parts out of the two part sheets.

    python kit/prep_parts.py [project folder]

Reads   character/raw/heads.png   twelve heads, 4 x 3, on flat magenta
        character/raw/parts.png   body, six hands, three shoes, on flat magenta
Writes  character/parts/*.png     one picture per part, magenta removed
        character/parts/parts.js  window.PUP_ART: sizes and anchor points for puppet.js
        character/parts/check.jpg every part on a blue card, to look at

Sizes are in "puppet pixels": the head is 300 across. Every head lands on the same canvas with
the centre of the head at the same point, so swapping faces (and opening the mouth) does not
make the head jump.
"""
import io, json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
V4 = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # the project: the folder that holds character/
RAW = os.path.join(V4, "character", "raw")
OUT = os.path.join(V4, "character", "parts")
os.makedirs(OUT, exist_ok=True)

HEAD_D, HEAD_W, HEAD_H, HEAD_CX, HEAD_CY = 300, 380, 330, 190, 162
FACES = ["calm", "calm-open", "happy", "happy-open", "confused", "confused-open", "shock", "think", "sad", "joy", "amazed", "blink"]
PAIRS = {"calm-open": "calm", "happy-open": "happy", "confused-open": "confused", "blink": "calm"}   # line these up on their partner
BODY_H, HAND_H, SHOE_W = 206, 82, 96
# Where the wrist is in each hand picture (fractions of its box) and which way the fingers
# point there (radians, 0 = to the right, pi/2 = down). Read off the sheet by eye.
HANDS = [("open", 0.42, 0.10, 1.45), ("point", 0.10, 0.45, 0.0), ("palm", 0.10, 0.38, 0.30),
         ("fist", 0.50, 0.08, 1.57), ("grip", 0.50, 0.08, 1.57), ("wave", 0.42, 0.93, -1.57)]


def cut(path):
    """Magenta becomes transparent; edge pixels lose the magenta mixed into them."""
    p = np.array(Image.open(path).convert("RGB")).astype(np.float64)
    m = np.array([255.0, 0.0, 255.0])
    a = np.clip((np.sqrt(((p - m) ** 2).sum(axis=2)) - 70) / 110, 0, 1)
    c = np.where(a[..., None] > 0.02, (p - (1 - a[..., None]) * m) / np.maximum(a[..., None], 0.02), 0)
    a = np.minimum(a, ndi.uniform_filter(ndi.minimum_filter(a, 3), 3) + 0.0)        # pull the edge in by a pixel
    return np.dstack([np.clip(c, 0, 255), a * 255])


def pieces(img, least=2500):
    lab, k = ndi.label(ndi.binary_closing(img[..., 3] > 128, iterations=2))
    out = []
    for i, sl in enumerate(ndi.find_objects(lab), 1):
        if (lab[sl] == i).sum() < least:
            continue
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        part = img[max(0, y0 - 3):y1 + 3, max(0, x0 - 3):x1 + 3].copy()
        own = ndi.binary_dilation(lab[max(0, y0 - 3):y1 + 3, max(0, x0 - 3):x1 + 3] == i, iterations=3)
        part[..., 3] = np.where(own, part[..., 3], 0)
        out.append({"img": part, "x": (x0 + x1) / 2, "y": (y0 + y1) / 2, "w": x1 - x0, "h": y1 - y0, "n": (lab[sl] == i).sum()})
    return out


def pil(a):
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA")


def scaled(a, k):
    im = pil(a)
    return im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)


art = {"headD": HEAD_D, "head": [HEAD_W, HEAD_H, HEAD_CX, HEAD_CY], "faces": FACES, "hands": {}, "shoes": {}}
made = []

# ---------------- heads ----------------
hs = sorted(pieces(cut(os.path.join(RAW, "heads.png"))), key=lambda q: -q["n"])[:12]
assert len(hs) == 12, "expected 12 heads, found %d" % len(hs)
rows = sorted(hs, key=lambda q: q["y"])
hs = sum([sorted(rows[i:i + 4], key=lambda q: q["x"]) for i in (0, 4, 8)], [])
heads = {}
for name, h in zip(FACES, hs):
    a = h["img"]
    solid = a[..., 3] > 128
    ys = np.where(solid.any(axis=1))[0]
    top, bottom = ys.min(), ys.max()
    d = bottom - top + 1
    mids = []
    for f in (0.12, 0.2, 0.8, 0.88):                       # rows clear of the arms of the glasses
        xs = np.where(solid[int(top + f * d)])[0]
        mids.append((xs.min() + xs.max()) / 2)
    cx, cy, k = float(np.mean(mids)), (top + bottom) / 2, HEAD_D / d
    im = scaled(a, k)
    canvas = Image.new("RGBA", (HEAD_W, HEAD_H), (0, 0, 0, 0))
    canvas.paste(im, (round(HEAD_CX - cx * k), round(HEAD_CY - cy * k)))
    heads[name] = canvas
    print("head %-14s diameter %d px in the sheet" % (name, d))
for name, partner in PAIRS.items():                        # slide each onto its partner: glasses and brows must agree
    ref = np.array(heads[partner].convert("L")).astype(np.float64)[:200]
    me = heads[name]
    best = None
    for dy in range(-6, 7):
        for dx in range(-6, 7):
            t = np.array(me.transform(me.size, Image.AFFINE, (1, 0, -dx, 0, 1, -dy)).convert("L")).astype(np.float64)[:200]
            e = np.abs(t[20:150] - ref[20:150]).mean()
            if best is None or e < best[0]:
                best = (e, dx, dy)
    heads[name] = me.transform(me.size, Image.AFFINE, (1, 0, -best[1], 0, 1, -best[2]))
    print("lined up %-14s on %-9s by (%d, %d)" % (name, partner, best[1], best[2]))
for name, im in heads.items():
    im.save(os.path.join(OUT, "head-" + name + ".png")); made.append("head-" + name)

# ---------------- body, hands, shoes ----------------
ps = pieces(cut(os.path.join(RAW, "parts.png")))
body = max(ps, key=lambda q: q["n"])
rest = [q for q in ps if q is not body]
mid_y = np.mean([q["y"] for q in rest])
hands = sorted([q for q in rest if q["y"] < mid_y], key=lambda q: q["x"])
shoes = sorted([q for q in rest if q["y"] >= mid_y], key=lambda q: q["x"])
assert len(hands) == 6 and len(shoes) == 3, "expected 6 hands and 3 shoes, found %d and %d" % (len(hands), len(shoes))

im = scaled(body["img"], BODY_H / body["h"]); im.save(os.path.join(OUT, "body.png")); made.append("body")
art["body"] = [im.width, im.height]
kh = HAND_H / hands[0]["h"]
for (name, fx, fy, ang), h in zip(HANDS, hands):
    im = scaled(h["img"], kh); im.save(os.path.join(OUT, "hand-" + name + ".png")); made.append("hand-" + name)
    art["hands"][name] = [im.width, im.height, round(fx * im.width), round(fy * im.height), ang]
ks = SHOE_W / shoes[0]["w"]
for name, s in zip(("left", "right", "front"), shoes):
    im = scaled(s["img"], ks); im.save(os.path.join(OUT, "shoe-" + name + ".png")); made.append("shoe-" + name)
    al = np.array(im)[..., 3] > 128
    ys = np.where(al.any(axis=1))[0]
    xs = np.where(al[ys.min():ys.min() + max(3, len(ys) // 8)].any(axis=0))[0]          # the opening of the boot
    art["shoes"][name] = [im.width, im.height, round((xs.min() + xs.max()) / 2), int(ys.min()) + 9]
art["names"] = made
io.open(os.path.join(OUT, "parts.js"), "w", encoding="utf-8", newline="\n").write("window.PUP_ART = " + json.dumps(art) + ";\n")

# ---------------- a card to look at ----------------
card = Image.new("RGB", (4 * 390 + 20, 3 * 340 + 280), (88, 150, 214))
for i, name in enumerate(FACES):
    card.paste(heads[name], (10 + (i % 4) * 390, 5 + (i // 4) * 340), heads[name])
x = 20
for n in made:
    if n.startswith("head-"):
        continue
    im = Image.open(os.path.join(OUT, n + ".png"))
    card.paste(im, (x, 3 * 340 + 30), im); x += im.width + 30
card.save(os.path.join(OUT, "check.jpg"), quality=90)
print(json.dumps(art))
