// Story 01's own drawings: the bee and the honeycomb. Loaded after kit.js, before film.js.

seed(2542);

// ================= the bee: top view, head up, origin at the middle of the thorax =================
const S_AB = P("M 0 38 C 50 38 62 80 58 115 C 54 160 25 200 0 216 C -25 200 -54 160 -58 115 C -62 80 -50 38 0 38 Z");
const S_TH = P("M 0 -54 C 30 -54 54 -30 54 0 C 54 30 30 54 0 54 C -30 54 -54 30 -54 0 C -54 -30 -30 -54 0 -54 Z");
const S_HD = P("M 0 -112 C 22 -112 38 -98 38 -80 C 38 -62 22 -50 0 -50 C -22 -50 -38 -62 -38 -80 C -38 -98 -22 -112 0 -112 Z");
const S_EYE = P("M 26 -102 C 40 -98 44 -80 40 -66 C 36 -58 28 -58 24 -66 C 20 -78 20 -94 26 -102 Z", 1.5);
const S_FORE = P("M 22 -8 C 80 0 122 70 112 150 C 108 178 86 186 70 168 C 50 140 30 60 22 -8 Z");
const S_HIND = P("M 20 6 C 60 20 86 80 76 128 C 70 146 54 144 46 126 C 34 90 24 40 20 6 Z");
const V_FORE = ["M 22 -8 C 60 50 84 110 90 172", "M 22 -8 C 70 30 100 90 108 140", "M 30 20 C 50 70 62 120 72 166", "M 52 60 C 70 66 88 78 104 96", "M 66 112 C 78 116 94 124 108 136", "M 44 92 C 56 96 66 104 74 116", "M 80 150 C 88 152 98 156 106 162"].map((d) => P(d));
const V_HIND = ["M 20 6 C 44 50 58 90 62 132", "M 34 44 C 50 60 66 80 74 104", "M 30 60 C 38 84 46 106 52 130"].map((d) => P(d));
const S_ANT1 = P("M 9 -92 L 24 -126"), S_ANT2 = P("M 24 -126 C 34 -146 44 -160 54 -172", 1.5);
const LEGS = [[[40, -30], [78, -62], [104, -100], [113, -120]], [[48, 4], [102, 6], [132, 42], [143, 62]], [[40, 34], [92, 72], [114, 132], [119, 156]]];
const GUIDES = [P("M 0 -215 L 0 262", 4), P("M -150 0 L 150 0", 4), P("M -120 -80 L 120 -80", 4), P("M -130 127 L 130 127", 4)];
const STRIPES = [[66, 24], [108, 24], [150, 22], [188, 30]];

// fur and hair, decided once
const FUR_COL = ["#5e3b10", "#7a4f13", "#8a5a14", "#b9822a", "#d9a84a", "#f3d58c"];
const thFur = [], hdFur = [], abHair = [], eyeDots = [], abHatch = [];
for (let i = 0; i < 620; i++) {
  const a = rnd() * TAU, r = Math.sqrt(rnd()) * 58, len = 7 + rnd() * 9, d = a + (rnd() - 0.5) * 0.9;
  thFur.push([r * Math.cos(a), r * Math.sin(a), len * Math.cos(d), len * Math.sin(d) + 2, FUR_COL[Math.floor(rnd() * 6)], 1 + rnd() * 1.1, r]);
}
thFur.sort((p, q) => p[6] - q[6]);
for (let i = 0; i < 150; i++) {
  const a = rnd() * TAU, r = Math.sqrt(rnd()) * 34, len = 4 + rnd() * 6;
  hdFur.push([r * Math.cos(a) * 1.05, -80 + r * Math.sin(a) * 0.85, len * Math.cos(a), len * Math.sin(a) - 1, FUR_COL[1 + Math.floor(rnd() * 5)], 0.9 + rnd() * 0.8]);
}
for (let i = 0; i < 420; i++) {
  const x = -58 + rnd() * 116, y = 40 + rnd() * 172, dark = STRIPES.some(([sy, sh]) => y > sy + 4 * Math.cos(x / 40) && y < sy + sh);
  abHair.push([x, y, rnd() * 3 - 1.5, 6 + rnd() * 8, dark ? (rnd() < 0.5 ? "#6b4a22" : "#8a6532") : (rnd() < 0.6 ? "#b06f0c" : "#ffe09a"), 0.9 + rnd() * 0.9]);
}
for (let i = 0; i < 70; i++) eyeDots.push([22 + rnd() * 20, -100 + rnd() * 42, 0.7 + rnd() * 0.7]);
for (let i = 0; i < 26; i++) abHatch.push([18 + i * 1.6 + rnd() * 2, 44 + i * 6.4, 20 + rnd() * 16]);

function drawLeg(pts, i, frac, swing, line) {
  ctx.save();
  ctx.translate(pts[0][0], pts[0][1]); ctx.rotate(swing); ctx.translate(-pts[0][0], -pts[0][1]);
  const widths = [10, i === 2 ? 11 : 7.5, 4.2];
  for (let s = 0; s < 3; s++) {
    const f = cl(frac * 3 - s); if (f <= 0) break;
    const a = pts[s], b = pts[s + 1], bx = lerp(a[0], b[0], f), by = lerp(a[1], b[1], f);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(bx, by);
    ctx.lineCap = "round"; ctx.lineWidth = widths[s] + 2.2; ctx.strokeStyle = line; ctx.stroke();
    ctx.lineWidth = widths[s]; ctx.strokeStyle = s === 1 && i === 2 ? "#4a3016" : "#33210f"; ctx.stroke();
    if (s === 1 && f === 1) {                   // bristles along the shin
      ctx.lineWidth = 1; ctx.strokeStyle = "#7a5a2a";
      for (let k = 1; k < 6; k++) { const hx = lerp(a[0], b[0], k / 6), hy = lerp(a[1], b[1], k / 6); ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 5, hy + 6); ctx.stroke(); }
    }
  }
  ctx.restore();
}

function drawWing(shape, veins, bt, now, k) {
  const u = back(ph(bt, 1.5 + k * 0.06, 0.6)), sc = lerp(0.25, 1, u);
  const shiver = (bt > 2.15 && bt < 2.6 ? Math.sin(bt * 120) * 0.05 : 0) + Math.sin(now * 5 + k) * 0.012;
  const oFrac = io(ph(bt, 0.55 + k * 0.05, 0.6)), m = io(ph(bt, 1.05, 0.55));
  ctx.save();
  ctx.translate(21, 0); ctx.rotate(lerp(-0.52, 0, u) + shiver); ctx.scale(sc, sc); ctx.translate(-21, 0);
  if (m > 0) {
    const g = ctx.createLinearGradient(20, 0, 110, 170);
    g.addColorStop(0, "rgba(255,250,232," + 0.66 * m + ")"); g.addColorStop(0.6, "rgba(222,236,244," + 0.5 * m + ")"); g.addColorStop(1, "rgba(250,222,214," + 0.5 * m + ")");
    trace(shape); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    const vf = io(ph(bt, 1.75, 0.5));
    veins.forEach((v) => stroke(v, vf, 1.1, "rgba(120,80,28,0.85)"));
  }
  stroke(shape, oFrac, lerp(2.6, 1.7, m), rgb(mix(LAV, [70, 50, 30], m)));
  ctx.restore();
}

// bt   build time: 0 = bare construction lines, about 2.6 = finished; pass 9 for a finished bee
// now  film time, for small idle movement
// amp  0..1 how hard the legs are walking;  gaitT  the clock the steps run on
function drawBee(bt, now, amp, gaitT) {
  const m = io(ph(bt, 1.05, 0.55));              // 0 = blueprint lines, 1 = inked and coloured
  const line = rgb(mix(LAV, INK, m)), fillA = ph(bt, 1.1, 0.4);
  const gait = amp * Math.sin((gaitT / 0.26) * TAU) * 0.2;

  const ga = 1 - ph(bt, 1.2, 0.6);               // construction lines: there on the first frame
  if (ga > 0) {
    ctx.globalAlpha = ga;
    GUIDES.forEach((g) => stroke(g, 1, 1.3, "rgba(143,150,216,0.9)"));
    ctx.lineWidth = 1.3; ctx.strokeStyle = "rgba(143,150,216,0.9)";
    [[0, -80, 36], [0, 0, 54], [0, 24, 205]].forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); });
    ctx.beginPath(); ctx.ellipse(0, 127, 62, 92, 0, 0, TAU); ctx.stroke();
    for (let k = -4; k <= 5; k++) { ctx.beginPath(); ctx.moveTo(-5, k * 44); ctx.lineTo(5, k * 44); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  if (m > 0) {                                   // soft shadow on whatever she stands on
    const sh = ctx.createRadialGradient(14, 70, 20, 14, 70, 190);
    sh.addColorStop(0, "rgba(60,35,5," + 0.3 * m + ")"); sh.addColorStop(1, "rgba(60,35,5,0)");
    ctx.save(); ctx.scale(1, 1.25); ctx.fillStyle = sh; ctx.fillRect(-200, -160, 430, 420); ctx.restore();
  }
  [1, -1].forEach((side) => {                    // legs: two tripods that swing against each other
    ctx.save(); ctx.scale(side, 1);
    LEGS.forEach((pts, i) => drawLeg(pts, i, out(ph(bt, 0.3 + i * 0.06, 0.5)), ((i + (side < 0 ? 1 : 0)) % 2 ? gait : -gait), "rgba(43,38,34," + m + ")"));
    ctx.restore();
  });
  if (fillA > 0) {                               // abdomen
    ctx.save(); clipTo(S_AB);
    const g = ctx.createLinearGradient(-58, 0, 58, 0);
    g.addColorStop(0, "#f7bd3a"); g.addColorStop(0.45, "#f0a81e"); g.addColorStop(1, "#c97c0c");
    ctx.globalAlpha = fillA; ctx.fillStyle = g; ctx.fillRect(-70, 30, 140, 200);
    STRIPES.forEach(([y, h], i) => {
      const p = out(ph(bt, 1.3 + i * 0.09, 0.3)); if (p <= 0) return;
      ctx.beginPath(); ctx.moveTo(-70 * p, y); ctx.quadraticCurveTo(0, y + 16, 70 * p, y); ctx.lineTo(70 * p, y + h); ctx.quadraticCurveTo(0, y + h + 16, -70 * p, y + h); ctx.closePath();
      ctx.fillStyle = "#2f1e0e"; ctx.fill();
    });
    const nh = Math.floor(abHair.length * ph(bt, 1.45, 0.5));
    for (let i = 0; i < nh; i++) { const h = abHair[i]; ctx.beginPath(); ctx.moveTo(h[0], h[1]); ctx.lineTo(h[0] + h[2], h[1] + h[3]); ctx.lineWidth = h[5]; ctx.strokeStyle = h[4]; ctx.stroke(); }
    const nx = Math.floor(abHatch.length * ph(bt, 1.6, 0.4));
    ctx.lineWidth = 0.9; ctx.strokeStyle = "rgba(43,38,34,0.55)";
    for (let i = 0; i < nx; i++) { const h = abHatch[i]; ctx.beginPath(); ctx.moveTo(h[0], h[1]); ctx.lineTo(h[0] + h[2], h[1] - h[2] * 0.7); ctx.stroke(); }
    ctx.restore();
  }
  stroke(S_AB, io(ph(bt, 0.05, 0.75)), lerp(3, 2.4, m), line);
  [1, -1].forEach((side) => { ctx.save(); ctx.scale(side, 1); drawWing(S_HIND, V_HIND, bt, now, 0); drawWing(S_FORE, V_FORE, bt, now, 1); ctx.restore(); });
  if (fillA > 0) {                               // thorax: a ball of fur
    const g = ctx.createRadialGradient(-10, -12, 6, 0, 0, 58);
    g.addColorStop(0, "#e2ac48"); g.addColorStop(1, "#9c6418");
    ctx.globalAlpha = fillA; trace(S_TH); ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 4, 17, 20, 0, 0, TAU); ctx.fillStyle = "rgba(70,42,12,0.55)"; ctx.fill();
    ctx.globalAlpha = 1;
    const n = Math.floor(thFur.length * ph(bt, 1.35, 0.6));
    for (let i = 0; i < n; i++) { const f = thFur[i]; if (f[6] < 15) continue; ctx.beginPath(); ctx.moveTo(f[0], f[1]); ctx.lineTo(f[0] + f[2], f[1] + f[3]); ctx.lineWidth = f[5]; ctx.strokeStyle = f[4]; ctx.lineCap = "round"; ctx.stroke(); }
  }
  ctx.globalAlpha = lerp(1, 0.28, m); stroke(S_TH, io(ph(bt, 0.12, 0.75)), lerp(3, 2, m), line); ctx.globalAlpha = 1;
  if (fillA > 0) {                               // head
    ctx.globalAlpha = fillA; trace(S_HD); ctx.closePath(); ctx.fillStyle = "#9a6a1c"; ctx.fill(); ctx.globalAlpha = 1;
    const n = Math.floor(hdFur.length * ph(bt, 1.4, 0.5));
    for (let i = 0; i < n; i++) { const f = hdFur[i]; ctx.beginPath(); ctx.moveTo(f[0], f[1]); ctx.lineTo(f[0] + f[2], f[1] + f[3]); ctx.lineWidth = f[5]; ctx.strokeStyle = f[4]; ctx.stroke(); }
  }
  stroke(S_HD, io(ph(bt, 0.19, 0.75)), lerp(3, 2.2, m), line);
  const twitch = bt > 2.0 ? Math.sin(now * 22) * 0.05 : 0;
  [1, -1].forEach((side) => {
    ctx.save(); ctx.scale(side, 1);
    if (fillA > 0) {
      ctx.save(); clipTo(S_EYE);
      const g = ctx.createRadialGradient(30, -88, 2, 32, -80, 26);
      g.addColorStop(0, "#5a4038"); g.addColorStop(1, "#1c1212");
      ctx.globalAlpha = fillA; ctx.fillStyle = g; ctx.fillRect(15, -108, 34, 56);
      ctx.fillStyle = "rgba(150,120,110,0.55)"; eyeDots.forEach((d) => { ctx.beginPath(); ctx.arc(d[0], d[1], d[2], 0, TAU); ctx.fill(); });
      ctx.restore();
      ctx.globalAlpha = fillA; ctx.beginPath(); ctx.moveTo(30, -95); ctx.quadraticCurveTo(36, -88, 35, -76); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(255,246,225,0.85)"; ctx.lineCap = "round"; ctx.stroke(); ctx.globalAlpha = 1;
    }
    stroke(S_EYE, io(ph(bt, 0.3, 0.6)), lerp(2.6, 2, m), line);
    ctx.translate(9, -92); ctx.rotate(twitch * side); ctx.translate(-9, 92);   // antenna: a scape, then a jointed whip
    const af = out(ph(bt, 0.45, 0.5));
    stroke(S_ANT1, cl(af * 2), 5.4, m > 0.5 ? "#2e2016" : line);
    stroke(S_ANT2, cl(af * 2 - 1), 4.2, m > 0.5 ? "#2e2016" : line);
    if (m > 0.6 && af === 1) { ctx.lineWidth = 1; ctx.strokeStyle = "rgba(190,150,90,0.8)"; for (let k = 3; k < S_ANT2.length - 2; k += 4) { const q = S_ANT2[k]; ctx.beginPath(); ctx.moveTo(q[0] - 2, q[1] - 1.2); ctx.lineTo(q[0] + 2, q[1] + 1.2); ctx.stroke(); } }
    ctx.restore();
  });
  if (fillA > 0) { ctx.fillStyle = "rgba(28,18,18," + fillA + ")"; [[0, -98], [-8, -90], [8, -90]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 3.2, 0, TAU); ctx.fill(); }); }
}
// A finished bee at a place: (x, y) is the middle of her thorax, rot in radians (0 = heading up).
function beeAt(x, y, rot, sc, now, amp, gaitT, alpha) {
  if (alpha <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.globalAlpha = alpha;
  drawBee(9, now, amp, gaitT);
  ctx.restore(); ctx.globalAlpha = 1;
}

// ================= the comb =================
const R = 70, CW = R3 * R, BEE0 = [540, 936], cells = [];
const HONEY = [["#ffd66a", "#eaa01c", "#b9700a"], ["#ffcf58", "#e39212", "#a85f06"], ["#ffdd80", "#eeae2a", "#bf780e"], ["#f9c64c", "#d9860d", "#9c5604"]];
for (let j = -2; j * 1.5 * R < H + 2 * R; j++)
  for (let k = -2; k * CW < W + 2 * CW; k++) {
    const cx = k * CW + (j & 1 ? CW / 2 : 0) + 15, cy = j * 1.5 * R + 36, u = rnd();
    const c = { cx, cy, d: Math.hypot(cx - BEE0[0], cy - BEE0[1]), kind: u < 0.72 ? "honey" : u < 0.86 ? "cap" : "empty", col: HONEY[Math.floor(rnd() * 4)], hatch: [], bub: [], dots: [] };
    for (let i = 0; i < 5; i++) c.hatch.push([-38 + i * 8 + rnd() * 3, -8 - i * 3 + rnd() * 4, 12 + rnd() * 10]);
    for (let i = 0; i < 3; i++) c.bub.push([rnd() * 50 - 25, rnd() * 50 - 20, 1.6 + rnd() * 2.6]);
    for (let i = 0; i < 46; i++) { const a = rnd() * TAU, r = Math.sqrt(rnd()) * 46; c.dots.push([r * Math.cos(a), r * Math.sin(a), 0.7 + rnd() * 1.1]); }
    cells.push(c);
  }
const nearestCell = (x, y, ok) => cells.filter(ok || (() => true)).sort((a, b) => Math.hypot(a.cx - x, a.cy - y) - Math.hypot(b.cx - x, b.cy - y))[0];

function cellEmpty(ri) {
  ctx.fillStyle = "#8a5512"; ctx.fillRect(-R, -R, 2 * R, 2 * R);
  hexPath(4, 5, ri * 0.52); ctx.fillStyle = "#4a2a08"; ctx.fill();
  ctx.lineWidth = 1.2; ctx.strokeStyle = "rgba(43,30,10,0.6)";
  for (let i = 0; i < 6; i++) { const a = (Math.PI / 3) * i - Math.PI / 2; ctx.beginPath(); ctx.moveTo(4 + ri * 0.52 * Math.cos(a), 5 + ri * 0.52 * Math.sin(a)); ctx.lineTo(ri * Math.cos(a), ri * Math.sin(a)); ctx.stroke(); }
  for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(-ri + i * 6, -ri * 0.2 + i * 2); ctx.lineTo(-ri + i * 6 + 14, -ri * 0.2 + i * 2 - 22); ctx.stroke(); }
}
function cellHoney(c, ri) {
  const g = ctx.createRadialGradient(-12, -14, 4, 0, 0, ri * 1.05);
  g.addColorStop(0, c.col[0]); g.addColorStop(0.55, c.col[1]); g.addColorStop(1, c.col[2]);
  ctx.fillStyle = g; ctx.fillRect(-R, -R, 2 * R, 2 * R);
  ctx.lineWidth = 1.5; ctx.strokeStyle = "rgba(120,62,6,0.5)"; ctx.lineCap = "round";
  c.hatch.forEach((h) => { ctx.beginPath(); ctx.moveTo(h[0], h[1]); ctx.lineTo(h[0] + h[2] * 0.62, h[1] - h[2]); ctx.stroke(); });
  ctx.strokeStyle = "rgba(255,246,206,0.9)"; ctx.lineWidth = 4.2; ctx.beginPath(); ctx.moveTo(12, 32); ctx.quadraticCurveTo(30, 26, 36, 8); ctx.stroke();
  ctx.fillStyle = "rgba(255,246,206,0.9)"; ctx.beginPath(); ctx.arc(-22, -26, 3.4, 0, TAU); ctx.fill();
  ctx.lineWidth = 1; ctx.strokeStyle = "rgba(255,240,190,0.7)"; c.bub.forEach((b) => { ctx.beginPath(); ctx.arc(b[0], b[1], b[2], 0, TAU); ctx.stroke(); });
}
// p      0..1 the cell popping into place
// level  0..1 how full of honey (honey cells only)
// wall   wax wall thickness, 13 by default
function drawCell(c, p, level, wall) {
  if (p <= 0) return;
  const s = lerp(0.3, 1, back(p)), ri = R - (wall === undefined ? 13 : wall);
  if (level === undefined) level = 1;
  ctx.save(); ctx.translate(c.cx, c.cy); ctx.scale(s, s); ctx.globalAlpha = cl(p * 1.6);
  hexPath(0, 0, R + 0.7); ctx.fillStyle = "#f4d98c"; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = "rgba(43,38,34,0.9)"; ctx.stroke();
  hexPath(0, 0, R - (R - ri) * 0.46); ctx.lineWidth = 1.6; ctx.strokeStyle = "rgba(190,140,50,0.75)"; ctx.stroke();      // wax bevel
  ctx.save(); hexPath(0, 0, ri); ctx.clip();
  if (c.kind === "honey") {
    if (level < 1) cellEmpty(ri);
    if (level > 0) { if (level < 1) { ctx.beginPath(); ctx.arc(2, 3, ri * 1.2 * level, 0, TAU); ctx.clip(); } cellHoney(c, ri); }
  } else if (c.kind === "cap") {
    const g = ctx.createRadialGradient(-10, -12, 4, 0, 0, ri);
    g.addColorStop(0, "#fbf0c8"); g.addColorStop(1, "#e2c57a");
    ctx.fillStyle = g; ctx.fillRect(-R, -R, 2 * R, 2 * R);
    ctx.fillStyle = "rgba(160,116,40,0.5)"; c.dots.forEach((d) => { ctx.beginPath(); ctx.arc(d[0], d[1], d[2], 0, TAU); ctx.fill(); });
  } else cellEmpty(ri);
  ctx.restore();
  hexPath(0, 0, ri); ctx.lineWidth = 2.4; ctx.strokeStyle = "rgba(43,38,34,0.95)"; ctx.stroke();
  ctx.restore();
}

makePaper();                                    // here, so paper keeps the random draws it had in v2
