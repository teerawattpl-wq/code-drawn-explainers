"""Cut the supporting cast and the props out of their sheets.

    python kit/prep_cast.py [project folder]

Reads   character/raw/cast-kids.png, cast-adults.png   3 people x 4 faces each, on flat magenta
        character/raw/cast-bodies.png, cast-wear.png   8 bodies, 8 things to wear or hold
        character/raw/props-1.png ... props-5.png      8 props each
Writes  character/cast/*.png     one picture per piece, magenta removed
        character/cast/cast.js   window.CAST_ART: sizes and anchor points for puppet.js
        character/cast/check-cast.jpg, check-props.jpg   to look at

Every sheet is a grid; a piece is everything whose middle lies in one cell. Heads are scaled so
the face is 300 across (the same as the main puppet) and put on one canvas with the centre of
the face at the same point, so a person's head does not jump when the face changes. The face
is found by its skin colour, because hair, buns and bows stick out of the circle.
"""
import io, json, os, sys
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
V4 = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # the project: the folder that holds character/
RAW = os.path.join(V4, "character", "raw")
OUT = os.path.join(V4, "character", "cast")
os.makedirs(OUT, exist_ok=True)

FACE_D, HEAD = 300, [540, 500, 270, 290]                 # canvas w, h and where the centre of the face is
FACES = ["calm", "happy", "confused", "shock"]
PEOPLE = {"cast-kids.png": ["boy", "girl", "curly"], "cast-adults.png": ["teacher", "auntie", "man"]}
BODIES = ["blue", "coral", "green", "teacher", "apron", "doctor", "office", "vest"]
BODY_H = 206
WEAR = ["hat-orange", "hat-yellow", "chef", "party", "stethoscope", "mirror", "mic", "blueprint"]
PROPS = {
    "props-1.png": ["pizza", "curry", "banknote", "coins", "envelope", "register", "safe", "shelf"],
    "props-2.png": ["bolt", "nut", "car", "plane", "lift", "monitor", "computer", "padlock"],
    "props-3.png": ["satellite", "umbrella", "cloud", "storm", "medicine", "syringe", "clipboard", "bed"],
    "props-4.png": ["ball", "goal", "guitar", "drum", "bag-brown", "bag-white", "bowl", "cup"],
    "props-5.png": ["cake", "burnt", "oven", "gift", "apple", "tree", "bird", "planet"],
}


def cut(path):
    """Magenta becomes transparent; edge pixels lose the magenta mixed into them."""
    p = np.array(Image.open(path).convert("RGB")).astype(np.float64)
    m = np.array([255.0, 0.0, 255.0])
    a = np.clip((np.sqrt(((p - m) ** 2).sum(axis=2)) - 70) / 110, 0, 1)
    c = np.where(a[..., None] > 0.02, (p - (1 - a[..., None]) * m) / np.maximum(a[..., None], 0.02), 0)
    a = np.minimum(a, ndi.uniform_filter(ndi.minimum_filter(a, 3), 3))
    return np.dstack([np.clip(c, 0, 255), a * 255])


def cells(img, cols, rows):
    """The pieces of a sheet in reading order: all the parts whose middle is in each grid cell."""
    h, w = img.shape[:2]
    lab, k = ndi.label(ndi.binary_closing(img[..., 3] > 128, iterations=2))
    boxes = {}
    for i, sl in enumerate(ndi.find_objects(lab), 1):
        own = lab[sl] == i
        if own.sum() < 80:
            continue
        cy, cx = (sl[0].start + sl[0].stop) / 2, (sl[1].start + sl[1].stop) / 2
        key = (min(rows - 1, int(cy * rows / h)), min(cols - 1, int(cx * cols / w)))
        boxes.setdefault(key, []).append(i)
    out = []
    for r in range(rows):
        for c in range(cols):
            ids = boxes.get((r, c))
            assert ids, "nothing found in row %d, column %d" % (r + 1, c + 1)
            mask = np.isin(lab, ids)
            ys, xs = np.where(mask)
            y0, y1, x0, x1 = max(0, ys.min() - 3), ys.max() + 4, max(0, xs.min() - 3), xs.max() + 4
            part = img[y0:y1, x0:x1].copy()
            part[..., 3] = np.where(ndi.binary_dilation(mask[y0:y1, x0:x1], iterations=3), part[..., 3], 0)
            out.append(part)
    return out


def pil(a):
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA")


def scaled(a, k):
    im = pil(a)
    return im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)


def face_circle(a):
    """Centre and diameter of the face in a head picture, from the largest patch of skin."""
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    skin = (al > 200) & (r > 222) & (g > 212) & (b > 180) & (r - b < 75)
    lab, k = ndi.label(skin)
    big = 1 + int(np.argmax(ndi.sum(skin, lab, range(1, k + 1))))
    own = lab == big
    ys = np.where(own.any(axis=1))[0]
    pts = []                                               # the edge of the chin and cheeks, below the ears
    for y in range(int(ys.max() - 0.36 * (ys.max() - ys.min())), ys.max() - 2):
        xs = np.where(own[y])[0]
        pts += [(xs.min(), y), (xs.max(), y)]
    p = np.array(pts, dtype=np.float64)                    # the circle through them, by least squares
    A = np.c_[2 * p[:, 0], 2 * p[:, 1], np.ones(len(p))]
    cx, cy, c = np.linalg.lstsq(A, (p ** 2).sum(axis=1), rcond=None)[0]
    return cx, cy, 2 * np.sqrt(c + cx * cx + cy * cy) + 8  # + the outline on both sides


art = {"head": HEAD, "faces": FACES, "people": [], "bodies": {}, "wear": {}, "props": {}, "names": []}
heads = {}
for sheet, people in PEOPLE.items():
    ps = cells(cut(os.path.join(RAW, sheet)), 4, 3)
    for pi, who in enumerate(people):
        first = None
        for fi, face in enumerate(FACES):
            a = ps[pi * 4 + fi]
            cx, cy, d = face_circle(a)
            k = FACE_D / d
            canvas = Image.new("RGBA", (HEAD[0], HEAD[1]), (0, 0, 0, 0))
            canvas.paste(scaled(a, k), (round(HEAD[2] - cx * k), round(HEAD[3] - cy * k)))
            if first is None:
                first = np.array(canvas).astype(np.float64)[:HEAD[3] - 60, :, 3]
                shift = (0, 0)
            else:                                           # slide onto the first face so the hair stays put
                best = None
                for dy in range(-10, 11):
                    for dx in range(-10, 11):
                        t = np.array(canvas.transform(canvas.size, Image.AFFINE, (1, 0, -dx, 0, 1, -dy))).astype(np.float64)[:HEAD[3] - 60, :, 3]
                        e = np.abs(t - first).mean()
                        if best is None or e < best[0]:
                            best = (e, dx, dy)
                shift = best[1:]
                canvas = canvas.transform(canvas.size, Image.AFFINE, (1, 0, -shift[0], 0, 1, -shift[1]))
            name = "head-%s-%s" % (who, face)
            canvas.save(os.path.join(OUT, name + ".png")); art["names"].append(name); heads[name] = canvas
            print("%-22s face %3.0f px in the sheet, moved by %s" % (name, d, shift))
        art["people"].append(who)

for name, a in zip(BODIES, cells(cut(os.path.join(RAW, "cast-bodies.png")), 4, 2)):
    im = scaled(a, BODY_H / a.shape[0]); im.save(os.path.join(OUT, "body-" + name + ".png"))
    art["bodies"][name] = [im.width, im.height]; art["names"].append("body-" + name)
for name, a in zip(WEAR, cells(cut(os.path.join(RAW, "cast-wear.png")), 4, 2)):
    im = pil(a); im.save(os.path.join(OUT, "wear-" + name + ".png"))
    art["wear"][name] = [im.width, im.height]; art["names"].append("wear-" + name)
props = []
for sheet, names in PROPS.items():
    for name, a in zip(names, cells(cut(os.path.join(RAW, sheet)), 4, 2)):
        im = pil(a); im.save(os.path.join(OUT, "prop-" + name + ".png"))
        art["props"][name] = [im.width, im.height]; art["names"].append("prop-" + name); props.append((name, im))
io.open(os.path.join(OUT, "cast.js"), "w", encoding="utf-8", newline="\n").write("window.CAST_ART = " + json.dumps(art) + ";\n")

# ---------------- cards to look at ----------------
card = Image.new("RGB", (4 * 420, 6 * 390), (88, 150, 214))
for i, n in enumerate(n for n in art["names"] if n.startswith("head-")):
    im = heads[n].resize((405, 375)); card.paste(im, ((i % 4) * 420 + 8, (i // 4) * 390 + 8), im)
card.save(os.path.join(OUT, "check-cast.jpg"), quality=88)
card = Image.new("RGB", (8 * 300, 5 * 300), (88, 150, 214))
for i, (name, im) in enumerate(props):
    t = im.copy(); t.thumbnail((280, 280)); card.paste(t, ((i % 8) * 300 + 150 - t.width // 2, (i // 8) * 300 + 150 - t.height // 2), t)
card.save(os.path.join(OUT, "check-props.jpg"), quality=88)
print(json.dumps(art)[:400])
