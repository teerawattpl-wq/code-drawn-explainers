// Helpers for films with scenes, people and props: shapes with hand-cut edges, paper grain,
// arrivals and falls, key words, subtitles, speech bubbles, prop stickers, wipes, confetti.
//
// Loaded after kit.js (and puppet.js when the film has puppets), before ONE look file:
// look-paper.js, look-ink.js or look-crayon.js. The look file defines cut(fill, o), which
// fills the current path in that look; everything here that draws a surface calls cut(), so
// a film changes its look by loading a different look file. o.flat asks for the plain fill
// with no edge treatment (no shadow, no outline).
// All times are film time in seconds ("now"), the clock of the narration.

const INKC = "#2b2233", PAPERC = "#fffdf6";
const VIVID = ["#ff3d5a", "#ff8a1f", "#ffd21f", "#2fd3a6", "#3aa0ff", "#7a4cff", "#ff5c8a"];
const PSH = "rgba(40,24,70,0.30)";                                        // the shadow under paper and stickers
const hash = (n) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); };   // a fixed "random" number for n

function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
// A closed path through pts whose edges wander a little, like scissors. s picks the wander.
function roughLoop(pts, s, amp, keepOpen) {
  if (!keepOpen) ctx.beginPath();
  let k = 0;
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), n = Math.max(1, Math.ceil(len / 46));
    if (i === 0) ctx.moveTo(a[0], a[1]);
    for (let j = 1; j <= n; j++) {
      const q = j / n, w = j < n ? (hash(++k * 1.37 + s * 17.3) - 0.5) * 2 * amp : 0;
      ctx.lineTo(a[0] + dx * q - (dy / len) * w, a[1] + dy * q + (dx / len) * w);
    }
  });
  ctx.closePath();
}
function rectPts(x, y, w, h, r) {
  const p = [], c = [[x + w - r, y + r, -Math.PI / 2], [x + w - r, y + h - r, 0], [x + r, y + h - r, Math.PI / 2], [x + r, y + r, Math.PI]];
  c.forEach(([cx, cy, a0]) => { for (let i = 0; i <= 5; i++) { const a = a0 + (Math.PI / 2) * (i / 5); p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } });
  return p;
}
function cutRect(x, y, w, h, r, fill, s, o) { roughLoop(rectPts(x, y, w, h, r), s, (o && o.amp) || 2.2); cut(fill, o); }
function blobPts(cx, cy, rx, ry, s, amp, a0, a1) {
  const p = [], n = Math.max(14, Math.round((rx + ry) / 7));
  a0 = a0 === undefined ? 0 : a0; a1 = a1 === undefined ? TAU : a1;
  const m = a1 - a0 >= TAU - 0.001 ? n : n + 1;
  for (let i = 0; i < m; i++) { const a = a0 + ((a1 - a0) * i) / n, w = 1 + ((hash(i * 2.11 + s * 9.7) - 0.5) * 2 * amp) / Math.max(rx, ry); p.push([cx + rx * w * Math.cos(a), cy + ry * w * Math.sin(a)]); }
  return p;
}
function cutBlob(cx, cy, rx, ry, fill, s, o) {
  const p = blobPts(cx, cy, rx, ry, s, (o && o.amp) || 2.5, o && o.a0, o && o.a1);
  ctx.beginPath(); p.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); cut(fill, o);
}

// Paper grain: soft mottling and short fibres, made once.
const PGRAIN = document.createElement("canvas"); PGRAIN.width = W; PGRAIN.height = H;
(() => {
  const g = PGRAIN.getContext("2d"), small = document.createElement("canvas"); small.width = W / 2; small.height = H / 2;
  const sg = small.getContext("2d"), im = sg.createImageData(W / 2, H / 2), d = im.data; let s = 12345;
  for (let i = 0; i < d.length; i += 4) { s = (s * 1664525 + 1013904223) >>> 0; const v = (s >>> 9) & 1 ? 255 : 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = (s >>> 16) & 31; }
  sg.putImageData(im, 0, 0); g.drawImage(small, 0, 0, W, H);
  g.lineCap = "round";
  for (let i = 0; i < 3400; i++) {
    const x = hash(i) * W, y = hash(i + 0.5) * H, a = hash(i + 0.25) * TAU, l = 5 + hash(i + 0.75) * 14, light = i % 3 > 0;
    g.strokeStyle = light ? "rgba(255,255,255,0.15)" : "rgba(40,20,60,0.10)"; g.lineWidth = 1 + hash(i + 0.1);
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + 3, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
})();

// A thing arrives by growing from its own middle with a small bounce.
function pop(now, t0, fn, cx, cy, d) {
  const p = ph(now, t0, d || 0.42); if (p <= 0) return;
  ctx.save(); ctx.translate(cx, cy); const s = back(p); ctx.scale(s, s); ctx.translate(-cx, -cy); ctx.globalAlpha *= cl(p * 3); fn(); ctx.restore();
}
// Where something falling from y0 is after u seconds, with one small bounce on the floor.
function drop(u, y0, floor) {
  const g = 2600, t1 = Math.sqrt((2 * Math.max(1, floor - y0)) / g);
  if (u < t1) return { y: y0 + 0.5 * g * u * u, air: true, t1 };
  const v = u - t1, up = 0.28 * g * t1, y = floor - up * v + 0.5 * g * v * v;
  return { y: Math.min(floor, y), air: y < floor, t1 };
}

// A key word in the scene: a bright card. show from t0 to t1.
function keyword(now, s, x, y, t0, t1, o) {
  o = o || {};
  const p = ph(now, t0, 0.3); if (p <= 0 || now > t1) return;
  const size = o.size || 72;
  ctx.save(); ctx.globalAlpha = cl((t1 - now) / 0.22); ctx.translate(x, y); ctx.rotate(o.rot === undefined ? -0.05 : o.rot); const k = back(p); ctx.scale(k, k);
  ctx.font = "700 " + size + "px " + FONT; const w = ctx.measureText(s).width + size;
  rr(-w / 2, -size * 1.02, w, size * 1.62, size * 0.3); cut(o.fill || "#ff3d5a"); txt(s, 0, size * 0.16, size, o.color || PAPERC);
  ctx.restore();
}
// What the narration is saying, at the bottom. SUBS = [[from, to, text], ...] in film time.
function subtitle(now) {
  const s = SUBS.find((q) => now >= q[0] && now < q[1]); if (!s) return;
  ctx.font = "700 46px " + FONT; const w = ctx.measureText(s[2]).width + 70;
  ctx.fillStyle = "rgba(34,26,46,0.88)"; rr(W / 2 - w / 2, 984, w, 72, 20); ctx.fill();
  txt(s[2], W / 2, 1036, 46, PAPERC);
}
// The soft shadow under the puppet's feet.
function footShadow(x, y, lift) { const k = 1 - 0.3 * cl(lift || 0); ctx.fillStyle = "rgba(20,40,60,0.26)"; ctx.beginPath(); ctx.ellipse(x, y + 4, 128 * k, 20 * k, 0, 0, TAU); ctx.fill(); }

// Text whose characters melt downward one after another into dashes. m: 0 = whole, 1 = gone.
// keep(ch) says which characters stay as they are (letters stay, digits melt).
function meltText(s, cx, y, size, color, m, o) {
  o = o || {};
  ctx.font = "700 " + size + "px " + (o.font || NUM); ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
  const ws = [...s].map((c) => ctx.measureText(c).width), tw = ws.reduce((a, b) => a + b, 0);
  let x = o.align === "left" ? cx : o.align === "right" ? cx - tw : cx - tw / 2, k = 0;
  const melts = [...s].map((c) => /[0-9]/.test(c)), n = melts.filter(Boolean).length;
  [...s].forEach((c, i) => {
    if (!melts[i]) { ctx.fillStyle = color; ctx.fillText(c, x, y); x += ws[i]; return; }
    const q = cl(m * (1 + 0.5) - (k / Math.max(1, n)) * 0.5) ; k++;
    const e = io(cl(q));
    if (e < 1) { ctx.save(); ctx.globalAlpha *= 1 - e; ctx.translate(x, y + e * size * 0.55); ctx.scale(1, 1 + e * 1.3); ctx.fillStyle = color; ctx.fillText(c, 0, 0); ctx.restore(); }
    if (e > 0.4) { ctx.save(); ctx.globalAlpha *= cl((e - 0.4) / 0.6); ctx.fillStyle = o.dash || color; ctx.fillRect(x + ws[i] * 0.14, y - size * 0.36, ws[i] * 0.72, size * 0.1); ctx.restore(); }
    x += ws[i];
  });
}

// A prop sticker (character/cast/prop-<name>.png): the picture with a white die-cut border and
// a shadow, w wide, its middle at (cx, cy). o: rot, flat (no border, no shadow), wear (a thing
// from the wear sheet instead of a prop), sat (1 = full colour, 0 = grey).
const STICK = {};
function sticker(name, cx, cy, w, o) {
  o = o || {};
  const im = CAST.img[(o.wear ? "wear-" : "prop-") + name]; if (!im) return;
  let c = STICK[name];
  if (!c) {
    const b = Math.round(Math.max(im.width, im.height) * 0.024), e = document.createElement("canvas"), g2 = e.getContext("2d");
    c = STICK[name] = document.createElement("canvas"); c.width = e.width = im.width + 4 * b; c.height = e.height = im.height + 4 * b; c.pad = 2 * b;
    g2.drawImage(im, 2 * b, 2 * b); g2.globalCompositeOperation = "source-in"; g2.fillStyle = "#fffdf6"; g2.fillRect(0, 0, e.width, e.height);
    const g = c.getContext("2d"); for (let i = 0; i < 20; i++) { const an = (TAU * i) / 20; g.drawImage(e, b * Math.cos(an), b * Math.sin(an)); }
    g.drawImage(im, 2 * b, 2 * b);
  }
  const k = w / im.width;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(o.rot || 0); ctx.scale(k, k);
  if (o.sat !== undefined && o.sat < 1) ctx.filter = "saturate(" + o.sat.toFixed(3) + ")";
  if (o.flat) ctx.drawImage(im, -im.width / 2, -im.height / 2);
  else { ctx.shadowColor = PSH; ctx.shadowBlur = 14; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 7; ctx.drawImage(c, -im.width / 2 - c.pad, -im.height / 2 - c.pad); }
  ctx.restore();
}
// Is the narrator's voice loud right now? For the mouth of a figure that is the one speaking.
function talking(now) { const i = Math.floor((now - T.offset) * T.mouthFps); return T.mouth[i] === "1"; }
// Words somebody in the scene says: a paper bubble with its tail towards (o.tx, o.ty).
function bubble(now, s, x, y, t0, t1, o) {
  o = o || {};
  const p = ph(now, t0, 0.3); if (p <= 0 || now > t1) return;
  const size = o.size || 50;
  ctx.save(); ctx.globalAlpha = cl((t1 - now) / 0.2); ctx.translate(x, y); const k = back(p); ctx.scale(k, k);
  ctx.font = "700 " + size + "px " + FONT; const w = ctx.measureText(s).width + size * 1.4, h = size * 2.3, tx = (o.tx === undefined ? x - 120 : o.tx) - x, ty = (o.ty === undefined ? y + 150 : o.ty) - y;
  const bx = cl((tx + w / 2) / w) * (w - 160) - w / 2 + 80;                               // the tail and the body are filled apart: as one path they would cut a hole where they overlap
  ctx.beginPath(); ctx.moveTo(bx - 34, 0); ctx.lineTo(tx * 0.55, ty * 0.55); ctx.lineTo(bx + 34, 0); ctx.closePath(); cut(o.fill || PAPERC);
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, size * 0.6); cut(o.fill || PAPERC); ctx.fillStyle = o.fill || PAPERC; ctx.fillRect(bx - 30, h / 2 - 14, 60, 16); txt(s, 0, size * 0.34, size, o.color || "#2466d6");
  ctx.restore();
}
// A prop sticker standing on a line: x is its middle, base its lowest point.
function stickerOn(name, x, base, w, o) { const q = window.CAST_ART.props[name]; sticker(name, x, base - (w * q[1]) / q[0] / 2, w, o); }
// A cloud and a tree, in whatever look is loaded.
function paperCloud(x, y, k, fill) {
  ctx.beginPath(); [[0, 0, 60], [60, -22, 72], [130, 0, 58], [66, 18, 64]].forEach(([a, b, r]) => { ctx.moveTo(x + a * k + r * k, y + b * k); ctx.arc(x + a * k, y + b * k, r * k, 0, TAU); });
  cut(fill || "#ffffff", { blur: 10, dy: 5 });
}
function paperTree(x, y, k, s) {
  cutRect(x - 18 * k, y - 190 * k, 36 * k, 196 * k, 8, "#b0672f", s, { amp: 1.5 });
  ctx.beginPath(); [[0, -250, 120], [-70, -190, 74], [74, -200, 70]].forEach(([a, b, r]) => { ctx.moveTo(x + a * k + r * k, y + b * k); ctx.arc(x + a * k, y + b * k, r * k, 0, TAU); }); cut("#12b76a");
  cutBlob(x - 20 * k, y - 270 * k, 62 * k, 50 * k, "#4fdc6c", s + 1, { blur: 6, dy: 3 });
}
// A slanted band of colour that sweeps across the screen; the scene changes behind it at time t.
function wipe(now, t, color) {
  const p = (now - (t - 0.2)) / 0.4; if (p <= 0 || p >= 1) return;
  ctx.save(); ctx.setTransform(1, 0, -0.3, 1, 0, 0); ctx.fillStyle = color; ctx.fillRect(lerp(-3100, 2400, p), -50, 3000, H + 100); ctx.restore();
}
// Bits of coloured paper falling over the whole screen from time t0.
function confetti(now, t0, n, amount) {
  const a = cl((now - t0) / 0.5) * (amount === undefined ? 1 : amount); if (a <= 0) return;
  for (let i = 0; i < n; i++) {
    const x = hash(i) * W + Math.sin(now * 2 + i) * 30, y = ((hash(i + 99) * (H + 200) + (now - t0) * (180 + hash(i + 7) * 200)) % (H + 200)) - 100;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(now * (2 + hash(i) * 4) + i); ctx.fillStyle = VIVID[i % VIVID.length]; ctx.fillRect(-9, -5, 18, 10); ctx.restore();
  }
}
