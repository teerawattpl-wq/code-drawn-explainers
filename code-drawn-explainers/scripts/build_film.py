"""Build one part of a longer film, or all of it, as a folder HyperFrames can render.

    python kit/build_film.py <film folder> <name> <from> <to>
    e.g.  python kit/build_film.py film act3 31.4 63.04      one act, to show for approval
          python kit/build_film.py film full 0 183.25        the whole film

Use this instead of build.py when the film is longer than a minute or so and is made act by
act on ONE finished narration recording: every time in the film is "film time", the clock of
that recording, and a part is just a window onto it. (build.py is for one-minute stories
whose lines are separate files laid end to end.)

Reads   <film>/film.json     what the film is made of (below)
        <film>/events.json   {"moments": {name: film seconds}, "sounds": [{"at": name,
                             "plus": seconds, "sfx": a function of kit/synth.py, "args": [...],
                             "gain": 0.3}, ...]}. The picture gets the same moments as
                             window.EVENTS, so a sound cannot drift from its action.
        <film>/*.js          the story files listed in film.json
Writes  <film>/build/<name>/ index.html, timings.js (window.T: dur, offset, mouthFps, mouth),
                             events.js, audio/mix.wav, and copies of everything the page loads
Then    cd <film>/build/<name> && npx hyperframes render --fps 30 --output <file>.mp4

film.json, paths relative to the film folder:
    {"size": [1920, 1080],
     "voice": "../audio/narration.mp3",        the finished narration
     "music": "../audio/music.wav",            optional; leave out for voice and effects only
     "musicGain": 2.0,                         optional, default 1.0
     "look": "paper",                          paper, ink or crayon: which kit/look-*.js to load
     "scripts": ["who.js", "subs.js", "act1.js", "act2.js", "film.js"],   in loading order
     "puppet": "../character/parts",           optional: made by kit/prep_parts.py
     "cast": "../character/cast",              optional: made by kit/prep_cast.py
     "globe": false}                           optional: load the globe and its map data

In the film, t counts from the start of the part and now = t + T.offset is film time.
T.mouth has one character per 1/T.mouthFps s: "1" while the voice is loud (see talking()
in stage.js). Requires: numpy, scipy, ffmpeg on PATH.
"""
import io, json, os, shutil, subprocess, sys
import numpy as np

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
KIT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, KIT)
import synth as S

if len(sys.argv) != 5:
    sys.exit(__doc__)
FILM, NAME, T0, T1 = os.path.abspath(sys.argv[1]), sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
OUT = os.path.join(FILM, "build", NAME)
DUR, FPS = round(T1 - T0, 3), 15
cfg = json.load(io.open(os.path.join(FILM, "film.json"), encoding="utf-8"))
at = lambda p: p if os.path.isabs(p) else os.path.normpath(os.path.join(FILM, p))
os.makedirs(os.path.join(OUT, "audio"), exist_ok=True)


def decode(path, start, dur):
    """A stretch of a sound file as mono floats at S.SR."""
    p = subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", str(start), "-t", str(dur), "-i", path,
                        "-ac", "1", "-ar", str(S.SR), "-f", "s16le", "-"], capture_output=True, check=True)
    x = np.frombuffer(p.stdout, dtype=np.int16).astype(np.float64) / 32768
    return np.pad(x, (0, max(0, int(dur * S.SR) - len(x))))[:int(dur * S.SR)]


voice = decode(at(cfg["voice"]), T0, DUR)
buf = voice.copy()
if cfg.get("music"):
    buf += decode(at(cfg["music"]), T0, DUR) * cfg.get("musicGain", 1.0)
ev = json.load(io.open(os.path.join(FILM, "events.json"), encoding="utf-8"))
for s in ev.get("sounds", []):
    t = ev["moments"][s["at"]] + s.get("plus", 0) - T0
    if 0 <= t < DUR - 0.05:
        S.put(buf, t, getattr(S, s["sfx"])(*s.get("args", [])), s.get("gain", 0.3))
ts = np.arange(len(buf)) / S.SR
buf *= np.clip(ts / 0.05, 0, 1) * np.clip((DUR - ts) / 0.2, 0, 1)
buf = np.clip(buf, -0.98, 0.98)
S.write_wav(os.path.join(OUT, "audio", "mix.wav"), buf)

# The mouth: open on the loud part of each syllable of the voice (same rule as build.py).
n = int(DUR * FPS)
loud = [np.sqrt(np.mean(voice[int(i * S.SR / FPS):int((i + 1) * S.SR / FPS)] ** 2) + 1e-12) for i in range(n)]
peak = [max(loud[max(0, i - 4):i + 5]) for i in range(n)]
T = {"dur": DUR, "offset": T0, "mouthFps": FPS, "mouth": "".join("1" if a > 0.02 and a > 0.45 * b else "0" for a, b in zip(loud, peak))}


def write(name, text):
    io.open(os.path.join(OUT, name), "w", encoding="utf-8", newline="\n").write(text)


write("timings.js", "window.T = " + json.dumps(T) + ";\n")
write("events.js", "window.EVENTS = " + json.dumps(ev["moments"]) + ";\n")

page = ["kit.js"]
shutil.copy(os.path.join(KIT, "kit.js"), OUT)
if cfg.get("globe"):
    shutil.copy(os.path.join(KIT, "data", "land-110m.js"), OUT)
    shutil.copy(os.path.join(KIT, "globe.js"), OUT)
    page += ["land-110m.js", "globe.js"]
page.append("events.js")
if cfg.get("puppet"):
    shutil.copytree(at(cfg["puppet"]), os.path.join(OUT, "assets", "puppet"), dirs_exist_ok=True)
    page.append("assets/puppet/parts.js")
    if cfg.get("cast"):
        shutil.copytree(at(cfg["cast"]), os.path.join(OUT, "assets", "cast"), dirs_exist_ok=True)
        page.append("assets/cast/cast.js")
    shutil.copy(os.path.join(KIT, "puppet.js"), OUT)
    page.append("puppet.js")
look = "look-%s.js" % cfg.get("look", "paper")
for f in ("stage.js", look):
    shutil.copy(os.path.join(KIT, f), OUT)
    page.append(f)
for f in cfg["scripts"]:
    shutil.copy(os.path.join(FILM, f), os.path.join(OUT, os.path.basename(f)))
    page.append(os.path.basename(f))
shutil.copytree(os.path.join(KIT, "fonts"), os.path.join(OUT, "fonts"), dirs_exist_ok=True)

w, h = cfg.get("size", [1920, 1080])
html = io.open(os.path.join(KIT, "film_page.html"), encoding="utf-8").read()
html = html.replace("__DUR__", str(DUR)).replace("__W__", str(w)).replace("__H__", str(h))
html = html.replace("__SCRIPTS__", "\n".join('    <script src="%s"></script>' % f for f in page))
write("index.html", html)
print("built", NAME, "from", T0, "to", T1, "=", DUR, "s, look:", cfg.get("look", "paper"))
