// Story 01, the film itself: render(t) draws the frame for time t using kit.js and bee.js.
// Two worlds: the COMB (lines 1-3 and 8) and the SKETCHBOOK page (lines 4-7). Each has one
// camera that never cuts; the two worlds meet on a hexagon of the same size and place.

const T = window.T;
const l2 = T.l2, l3 = T.l3, l4 = T.l4, l5 = T.l5, l6 = T.l6, l7 = T.l7, l8 = T.l8;
const p2 = T.p2, p3 = T.p3, p4 = T.p4, p5 = T.p5, p6 = T.p6, p7 = T.p7, p8 = T.p8;
const BROWN = "#b8580b", CREAM = "#fff8e6", INKS = rgb(INK);

// Every word on screen, per language. The build script sets T.lang.
const WORDS = {
  th: {
    wax: "ขี้ผึ้ง", costly: "แพงมาก", honeyIn: "น้ำผึ้งหลายกิโลกรัม", waxOut: "ขี้ผึ้ง 1 กิโลกรัม", problem: "โจทย์ของผึ้ง",
    most: ["น้ำผึ้ง ", "มากที่สุด"], least: ["ผนัง ", "น้อยที่สุด"], circle: ["วงกลม ", "ผนังน้อยที่สุด"], gaps: ["แต่เหลือ", "ช่องว่าง"], gap: "เหลือช่อง",
    tile: "รูปด้านเท่าที่ปูเต็มพื้นได้", three: "มีแค่ 3 แบบ", names: ["สามเหลี่ยม", "สี่เหลี่ยม", "หกเหลี่ยม"],
    area: "พื้นที่เท่ากัน", howMuch: "ผนังยาวเท่าไร", theLeast: "น้อยที่สุด", asked: "เริ่มมีคนสงสัย", askedWhen: "36 ปีก่อน ค.ศ.",
    proven: "พิสูจน์สำเร็จ", win: ["ไม่มีรูปไหนชนะ", "หกเหลี่ยม"], winSize: 60, title: "ทำไมรังผึ้งเป็นหกเหลี่ยม", titleSize: 58, series: "สารคดีเล่าเรื่อง",
    era: () => "พ.ศ.", year: (Y) => String(Math.round(Y)), passed: (n) => "ผ่านไป " + n.toLocaleString("en-US") + " ปี",
    ticks: () => { const a = []; for (let Y = 600; Y <= 2500; Y += 100) a.push([Y, String(Y), Y % 500 === 0]); return a; },
  },
  en: {
    wax: "Wax", costly: "Costly!", honeyIn: "Many pounds of honey", waxOut: "1 pound of wax", problem: "The bee's problem",
    most: ["Most ", "honey"], least: ["Least ", "wall"], circle: ["Circle: ", "least wall"], gaps: ["But it leaves ", "gaps"], gap: "Gaps",
    tile: "Regular shapes that tile", three: "Only 3", names: ["Triangle", "Square", "Hexagon"],
    area: "Same area", howMuch: "How much wall?", theLeast: "The least", asked: "The question is asked", askedWhen: "Rome, 36 BC",
    proven: "PROVEN", win: ["Nothing beats ", "the hexagon"], winSize: 46, title: "Why Honeycomb Is Hexagonal", titleSize: 44, series: "A short documentary",
    // the film counts in Buddhist-era years inside; English shows the same years as BC and AD
    era: (Y) => (Math.round(Y) - 543 <= 0 ? "BC" : "AD"), year: (Y) => { const c = Math.round(Y) - 543; return String(c <= 0 ? 1 - c : c); }, passed: (n) => n.toLocaleString("en-US") + " years later",
    ticks: () => { const a = []; for (let c = 100; c <= 1900; c += 100) a.push([c + 543, String(c), c % 500 === 0]); return a; },
  },
};
const TX = WORDS[T.lang] || WORDS.th;
const HR = 434, HX = 540, HY = 900;             // the question hexagon on screen

// =====================================================================================
// COMB WORLD, part A: the bee draws herself, the comb spreads, she builds, honey is spent
// =====================================================================================
const BEE1 = [470, 686], BEE_ROT = -0.21;
const target = nearestCell(720, 1330); target.kind = "honey";         // the cell the question dives into
const site = nearestCell(440, 470);                                    // the cell she builds
const siteN = cells.filter((c) => c !== site && Math.hypot(c.cx - site.cx, c.cy - site.cy) < CW * 1.1 && c.cy < site.cy - 10);
[site].concat(siteN).forEach((c) => (c.kind = "honey"));
const drained = cells.filter((c) => c.kind === "honey" && c !== site && siteN.indexOf(c) < 0 && c !== target)
  .map((c) => ({ c, d: Math.hypot(c.cx - BEE1[0], c.cy - BEE1[1] - 40) })).filter((o) => o.d > 170 && o.d < 470)
  .sort((a, b) => a.d - b.d).slice(0, 8).map((o) => o.c);
const fc = drained[3];                                                  // the cell that shows the bee's problem
const tc = nearestCell(540, 940, (c) => c.kind === "honey" && drained.indexOf(c) < 0);   // where line 8 comes back in
const EDGES = [[2, 3], [3, 4], [1, 2], [4, 5], [0, 1], [5, 0]];         // order the walls go up: nearest her first
const tFlake = (k) => l2 + 0.6 + k * 0.72, tDrain = (k) => p2[2] + 0.3 + k * 0.28;
const S8 = l8 - 0.25;

function beeW(lx, ly) { const c = Math.cos(BEE_ROT), s = Math.sin(BEE_ROT); return [BEE1[0] + lx * c - ly * s, BEE1[1] + lx * s + ly * c]; }
const hexV = (c, i, r) => { const a = (Math.PI / 3) * i - Math.PI / 2; return [c.cx + r * Math.cos(a), c.cy + r * Math.sin(a)]; };

const CAM_A = [3, 540, 960, 540, 900];
const KEYS_A = [
  { t: T.b - 0.15, d: T.q - T.b + 0.1, cam: [1, 540, 960, 540, 960] },
  { t: T.q - 0.1, d: 0.6, cam: [HR / R, target.cx, target.cy, HX, HY] },
  { t: l2 - 0.3, d: 1.1, cam: [2.4, site.cx, site.cy + 70, 680, 960] },
  { t: l2 + 0.9, d: p2[2] - 0.2 - (l2 + 0.9), cam: [2.75, site.cx, site.cy + 70, 680, 960] },
  { t: p2[2] - 0.2, d: 0.9, cam: [1.5, 470, 640, 650, 1060] },
  { t: l3 - 0.3, d: 1.0, cam: [5, fc.cx, fc.cy, 540, 900] },
  { t: l3 + 0.7, d: l4 - (l3 + 0.7), cam: [5.6, fc.cx, fc.cy, 540, 900] },
];

function wallNow(t) { return t >= S8 ? 7 : lerp(13, 7, io(ph(t, p3[2] + 0.2, 0.9))); }
function drawUnbuilt(c, t, main) {
  ctx.save(); ctx.translate(c.cx, c.cy);
  hexPath(0, 0, R + 0.7); ctx.fillStyle = "#e6d09a"; ctx.fill();
  ctx.fillStyle = "rgba(150,110,40,0.3)"; c.dots.forEach((d) => { ctx.beginPath(); ctx.arc(d[0] * 1.2, d[1] * 1.2, d[2], 0, TAU); ctx.fill(); });
  ctx.setLineDash([6, 7]); hexPath(0, 0, R - 6); ctx.lineWidth = 1.6; ctx.strokeStyle = "rgba(43,38,34,0.45)"; ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  if (!main) return;
  EDGES.forEach(([i, j], k) => {                 // each wall goes up when its flake of wax arrives
    const f = out(ph(t, tFlake(k) + 0.5, 0.3)); if (f <= 0) return;
    const a = hexV(c, i, R - 6.5), b = hexV(c, j, R - 6.5);
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(lerp(a[0], b[0], f), lerp(a[1], b[1], f)); ctx.lineCap = "round";
    ctx.lineWidth = 15.5; ctx.strokeStyle = INKS; ctx.stroke(); ctx.lineWidth = 11.5; ctx.strokeStyle = "#f8e3a0"; ctx.stroke();
  });
}
function drawCombCells(t, cam) {
  const vw = W / cam[0] / 2 + 2 * R, vh = H / cam[0] / 2 + 2 * R, mx = cam[1] + (W / 2 - cam[3]) / cam[0], my = cam[2] + (H / 2 - cam[4]) / cam[0];
  const wall = wallNow(t), late = t >= S8, unb = !late && t >= T.q + 0.7;
  cells.forEach((c) => {
    if (Math.abs(c.cx - mx) > vw || Math.abs(c.cy - my) > vh) return;
    if (unb && (c === site || siteN.indexOf(c) >= 0)) return drawUnbuilt(c, t, c === site);
    let level = 1; const k = late ? -1 : drained.indexOf(c);
    if (k >= 0) level = c === fc && t >= p3[1] ? io(ph(t, p3[1] + 0.1, 1.2)) : 1 - io(ph(t, tDrain(k), 0.6));
    drawCell(c, late ? 1 : ph(t, T.b - 0.1 + c.d / 560, 0.34), level, wall);
  });
}
function arrow(x1, y1, x2, y2, color, width) {
  const a = Math.atan2(y2 - y1, x2 - x1), h = width * 2.6;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
  ctx.moveTo(x2 - h * Math.cos(a - 0.5), y2 - h * Math.sin(a - 0.5)); ctx.lineTo(x2, y2); ctx.lineTo(x2 - h * Math.cos(a + 0.5), y2 - h * Math.sin(a + 0.5));
  ctx.lineWidth = width; ctx.strokeStyle = color; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
}

function drawCombA(t) {
  const m = io(ph(t, 1.05, 0.55));
  ctx.fillStyle = "#10142c"; ctx.fillRect(0, 0, W, H);                  // a blueprint night that turns into paper
  if (m < 1) { ctx.strokeStyle = "rgba(143,150,216,0.10)"; ctx.lineWidth = 1; ctx.beginPath(); for (let x = 0; x <= W; x += 60) { ctx.moveTo(x, 0); ctx.lineTo(x, H); } for (let y = 0; y <= H; y += 60) { ctx.moveTo(0, y); ctx.lineTo(W, y); } ctx.stroke(); }
  if (m > 0) { ctx.globalAlpha = m; ctx.drawImage(paper, 0, 0); ctx.globalAlpha = 1; }

  const cam = camChain(CAM_A, KEYS_A, t);
  ctx.save(); camApply(cam);
  drawCombCells(t, cam);
  // honey leaving the cells she empties, on its way to her
  const mouth = beeW(0, -112);
  drained.forEach((c, k) => { for (let j = 0; j < 3; j++) { const u = ph(t, tDrain(k) + j * 0.12, 0.5); if (u <= 0 || u >= 1) continue; const e = io(u); ctx.beginPath(); ctx.arc(lerp(c.cx, mouth[0], e), lerp(c.cy, mouth[1], e) - 30 * Math.sin(e * Math.PI), 6 - j, 0, TAU); ctx.fillStyle = "#f0a81e"; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = INKS; ctx.stroke(); } });
  // the bee: built on the spot, walks to the building site, then works
  const w = ph(t, T.b, l2 + 0.3 - T.b), walking = t > T.b && w < 1, working = t > l2 + 0.5 && t < p2[2];
  ctx.save();
  ctx.translate(lerp(BEE0[0], BEE1[0], w), lerp(BEE0[1], BEE1[1], w));
  ctx.rotate(BEE_ROT * io(ph(t, T.b, 0.5)) + (walking ? Math.sin((t - T.b) * 12) * 0.018 : 0) + (working ? Math.sin((t - l2) * 9) * 0.03 : 0));
  drawBee(t, t, walking ? 1 : t > T.b ? 0.18 : 0, t - T.b);
  ctx.restore();
  // flakes of wax: from under her abdomen, to her jaws, to the wall
  for (let k = 0; k < 6; k++) {
    const u = ph(t, tFlake(k), 0.55); if (u <= 0 || u >= 1) continue;
    const a = beeW(0, 120), b = beeW((k % 2 ? -1 : 1) * 80, 0), c = beeW(0, -118), e1 = hexV(site, EDGES[k][0], R - 6.5), e2 = hexV(site, EDGES[k][1], R - 6.5), d = [(e1[0] + e2[0]) / 2, (e1[1] + e2[1]) / 2];
    let x, y;
    if (u < 0.55) { const v = u / 0.55; x = (1 - v) * (1 - v) * a[0] + 2 * v * (1 - v) * b[0] + v * v * c[0]; y = (1 - v) * (1 - v) * a[1] + 2 * v * (1 - v) * b[1] + v * v * c[1]; }
    else { const v = io((u - 0.55) / 0.45); x = lerp(c[0], d[0], v); y = lerp(c[1], d[1], v); }
    ctx.save(); ctx.translate(x, y); ctx.rotate(u * 5); ctx.beginPath(); ctx.ellipse(0, 0, 8, 5, 0, 0, TAU); ctx.fillStyle = "#fff3cf"; ctx.fill(); ctx.lineWidth = 1.3; ctx.strokeStyle = INKS; ctx.stroke(); ctx.restore();
  }
  ctx.restore();

  // ---- screen marks ----
  // line 1: why a hexagon?
  const q = t - T.q, hudA = 1 - ph(t, l2 - 0.4, 0.25);
  if (q > 0.2 && hudA > 0) {
    ctx.save(); ctx.globalAlpha = hudA;
    ctx.fillStyle = "rgba(26,16,6," + 0.22 * ph(q, 0.2, 0.4) + ")"; ctx.fillRect(0, 0, W, H);
    const hex = []; for (let i = 0; i <= 6; i++) { const a = (Math.PI / 3) * i - Math.PI / 2; hex.push([HX + HR * Math.cos(a), HY + HR * Math.sin(a)]); }
    const nSeg = io(ph(q, 0.3, 0.5)) * 6;
    ctx.beginPath(); ctx.moveTo(hex[0][0], hex[0][1]);
    for (let i = 0; i < 6; i++) { const f = cl(nSeg - i); if (f <= 0) break; ctx.lineTo(lerp(hex[i][0], hex[i + 1][0], f), lerp(hex[i][1], hex[i + 1][1], f)); }
    ctx.lineWidth = 9; ctx.strokeStyle = CREAM; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
    const c30 = Math.cos(Math.PI / 6);
    for (let i = 0; i < 6; i++) {                // a tick across the middle of every side: all six are equal
      const f = ph(q, 0.6 + i * 0.04, 0.2); if (f <= 0) continue;
      const a = (Math.PI / 3) * i - Math.PI / 3, px = HX + HR * c30 * Math.cos(a), py = HY + HR * c30 * Math.sin(a);
      ctx.beginPath(); ctx.moveTo(px - 26 * f * Math.cos(a), py - 26 * f * Math.sin(a)); ctx.lineTo(px + 26 * f * Math.cos(a), py + 26 * f * Math.sin(a)); ctx.lineWidth = 6; ctx.stroke();
    }
    const af = io(ph(q, 0.75, 0.25));
    if (af > 0) { ctx.beginPath(); ctx.arc(HX, HY - HR, 84, Math.PI / 6, Math.PI / 6 + ((Math.PI * 2) / 3) * af); ctx.lineWidth = 6; ctx.stroke(); }
    ctx.globalAlpha = hudA * ph(q, 0.9, 0.2); txt("120°", HX, HY - HR + 176, 64, CREAM, { font: NUM });
    const qp = ph(q, 0.45, 0.4);
    if (qp > 0) { ctx.translate(HX, HY + 10); ctx.scale(lerp(0.4, 1, back(qp)), lerp(0.4, 1, back(qp))); ctx.globalAlpha = hudA * cl(qp * 2); txt("?", 0, 150, 420, CREAM, { font: NUM, stroke: INKS, sw: 12 }); }
    ctx.restore();
  }
  // line 2: wax, and what it costs
  const out2 = 1 - ph(t, p2[2] - 0.3, 0.2), sp = w2s(cam, site.cx, site.cy);
  const pa = ph(t, p2[0] + 0.5, 0.3) * out2, pb = ph(t, p2[1] + 0.1, 0.3) * out2;
  if (pa > 0) { const e = w2s(cam, site.cx + 52, site.cy + 30); leader(sp[0] + 150, sp[1] - 160, e[0], e[1], pa * 2); tag([[TX.wax]], sp[0] + 210, sp[1] - 190, pa, 56); }
  tag([[TX.costly, "#b8380b"]], sp[0] + 215, sp[1] - 285, pb, 56);
  const bp = out(ph(t, p2[2] + 0.05, 0.4)) * (1 - io(ph(t, l3 - 0.35, 0.3)));
  if (bp > 0) {                                  // the price, as a strip of paper: honey in, wax out
    ctx.save(); ctx.translate(0, (1 - bp) * -460);
    ctx.fillStyle = "rgba(60,35,5,0.25)"; ctx.fillRect(68, 180, 960, 270);
    ctx.fillStyle = "#fbf4e2"; ctx.fillRect(60, 170, 960, 270); ctx.lineWidth = 4; ctx.strokeStyle = INKS; ctx.strokeRect(60, 170, 960, 270);
    for (let i = 0; i < 8; i++) { const ip = ph(t, tDrain(i) + 0.45, 0.2); if (ip <= 0) continue; const s = back(ip); ctx.save(); ctx.translate(122 + i * 64, 262); ctx.scale(s, s); hexPath(0, 0, 28); ctx.fillStyle = "#eaa01c"; ctx.fill(); ctx.lineWidth = 3.5; ctx.strokeStyle = INKS; ctx.stroke(); ctx.beginPath(); ctx.arc(-8, -9, 4, 0, TAU); ctx.fillStyle = "#fff3c4"; ctx.fill(); ctx.restore(); }
    const ap = ph(t, p2[3] + 0.1, 0.3);
    if (ap > 0) arrow(650, 262, 650 + 96 * out(ap), 262, INKS, 7);
    const wp = ph(t, p2[3] + 0.4, 0.25);
    if (wp > 0) { const s = back(wp); ctx.save(); ctx.translate(850, 262); ctx.scale(s, s); ctx.rotate(-0.08); ctx.fillStyle = "#fff3cf"; ctx.fillRect(-40, -34, 80, 68); ctx.lineWidth = 4; ctx.strokeStyle = INKS; ctx.strokeRect(-40, -34, 80, 68); ctx.restore(); }
    ctx.globalAlpha = ph(t, p2[2] + 0.4, 0.3); txt(TX.honeyIn, 346, 390, 46, INKS);
    ctx.globalAlpha = ph(t, p2[3] + 0.5, 0.3); txt(TX.waxOut, 838, 390, 46, BROWN);
    ctx.restore();
  }
  // line 3: the bee's problem
  const out3 = 1 - ph(t, l4 - 0.5, 0.2), fs = w2s(cam, fc.cx, fc.cy);
  tag([[TX.problem]], 540, 250, ph(t, l3 + 0.35, 0.3) * out3, 60);
  const pm = ph(t, p3[1] + 0.25, 0.3) * out3, pw = ph(t, p3[2] + 0.2, 0.3) * out3;
  if (pm > 0) {
    const fade = pm * (1 - ph(t, p3[2], 0.3)), pulse = 0.5 + 0.5 * Math.sin((t - p3[1]) * 7);
    if (fade > 0) { ctx.globalAlpha = fade; for (let i = 0; i < 6; i++) { const a = (Math.PI / 3) * i - Math.PI / 3; arrow(fs[0] + 110 * Math.cos(a), fs[1] + 110 * Math.sin(a), fs[0] + (190 + 36 * pulse) * Math.cos(a), fs[1] + (190 + 36 * pulse) * Math.sin(a), CREAM, 8); } ctx.globalAlpha = 1; }
    tag([[TX.most[0]], [TX.most[1], BROWN]], 540, 420, pm, 58);
  }
  if (pw > 0) {
    const wr = (R - wallNow(t) / 2) * cam[0], pulse = 0.5 + 0.5 * Math.sin((t - p3[2]) * 7), nSeg = io(ph(t, p3[2] + 0.2, 0.6)) * 6;
    ctx.globalAlpha = pw; ctx.beginPath();
    for (let i = 0; i < 6; i++) { const f = cl(nSeg - i); if (f <= 0) break; const a1 = (Math.PI / 3) * i - Math.PI / 2, a2 = a1 + Math.PI / 3; if (!i) ctx.moveTo(fs[0] + wr * Math.cos(a1), fs[1] + wr * Math.sin(a1)); ctx.lineTo(fs[0] + wr * lerp(Math.cos(a1), Math.cos(a2), f), fs[1] + wr * lerp(Math.sin(a1), Math.sin(a2), f)); }
    ctx.lineWidth = 8; ctx.strokeStyle = CREAM; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke();
    for (let i = 0; i < 6; i++) { const a = (Math.PI / 3) * i - Math.PI / 3, r0 = R * cam[0] * 0.866; arrow(fs[0] + (r0 + 150 - 30 * pulse) * Math.cos(a), fs[1] + (r0 + 150 - 30 * pulse) * Math.sin(a), fs[0] + (r0 + 60 - 30 * pulse) * Math.cos(a), fs[1] + (r0 + 60 - 30 * pulse) * Math.sin(a), CREAM, 8); }
    ctx.globalAlpha = 1;
    tag([[TX.least[0]], [TX.least[1], BROWN]], 720, 1480, pw, 58);
  }
  if (m > 0) vignette(m);
}

// =====================================================================================
// SKETCHBOOK WORLD: circles, three tilings, the comparison, two thousand years, the winner
// =====================================================================================
const X5 = 3000, X6 = 5200, YEAR0 = 508, YEAR1 = 2542;
const xOf = (Y) => 7600 + (Y - YEAR0) * 2.4, XE = xOf(YEAR1), YE = 1000;
const TRAVEL = T.yearLand - (l7 + 0.5);
const CAM_P = [2.8, 0, 0, 540, 900];
const KEYS_P = [
  { t: l4 + 0.1, d: 0.9, cam: [1.5, 0, 0, 540, 960] },
  { t: p4[1] - 0.35, d: 0.9, cam: [0.95, 0, 0, 540, 980] },
  { t: l5 - 0.2, d: 0.8, cam: [0.74, X5, 0, 640, 1040] },
  { t: p5[2] - 0.15, d: 0.6, cam: [1.22, X5, -600, 540, 820] },
  { t: p5[3] - 0.15, d: 0.55, cam: [1.22, X5, 0, 540, 820] },
  { t: p5[4] - 0.15, d: 0.55, cam: [1.22, X5, 600, 540, 820] },
  { t: l6 - 0.2, d: 0.7, cam: [0.8, X6, 0, 800, 920] },
  { t: l7 - 0.25, d: 0.6, cam: [1, xOf(YEAR0), 0, 460, 1000] },
  { t: l7 + 0.5, d: TRAVEL, cam: [1, XE, 0, 620, 1000] },
  { t: p7[2] - 0.1, d: 0.7, cam: [1, XE, YE, 600, 860] },
  { t: l8 - 0.7, d: 0.45, cam: [2, XE, YE, 540, 900] },
];
const FILL = "#eaa426", TONES = ["#f3bf4a", "#eaa426", "#dc8e12"];

// ---- circles ----
const RH = 140, RC = 128, RING = [];
for (let q = -2; q <= 2; q++) for (let r = -2; r <= 2; r++) if (Math.abs(q + r) <= 2) RING.push([q, r]);
const circPos = (q, r) => [2 * RC * (q + r / 2), 2 * RC * (R3 / 2) * r];
const inRing = (q, r) => Math.abs(q) <= 2 && Math.abs(r) <= 2 && Math.abs(q + r) <= 2;
const GAPS = [];
RING.forEach(([q, r]) => {
  if (inRing(q + 1, r) && inRing(q, r + 1)) GAPS.push([circPos(q, r), circPos(q + 1, r), circPos(q, r + 1)]);
  if (inRing(q + 1, r) && inRing(q, r + 1) && inRing(q + 1, r + 1)) GAPS.push([circPos(q + 1, r), circPos(q + 1, r + 1), circPos(q, r + 1)]);
});
function gapPath(tri) {                          // the curved triangle left between three touching circles
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], [A, B, C] = tri, pts = [mid(A, B), mid(B, C), mid(C, A)], ctr = [B, C, A];
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < 3; i++) {
    const o = ctr[i], p = pts[i], q = pts[(i + 1) % 3], a1 = Math.atan2(p[1] - o[1], p[0] - o[0]), a2 = Math.atan2(q[1] - o[1], q[0] - o[0]);
    let d = a2 - a1; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU;
    ctx.arc(o[0], o[1], RC, a1, a2, d < 0);
  }
  ctx.closePath();
}
function blob(x, y, m, alpha) {                  // a honey shape between a hexagon (m = 0) and a circle (m = 1)
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha = alpha;
  const path = (dx) => { ctx.beginPath(); for (let i = 0; i <= 120; i++) { const a = (i / 120) * TAU, w = (((a + Math.PI / 2) % (Math.PI / 3)) + Math.PI / 3) % (Math.PI / 3), r = lerp((RH * Math.cos(Math.PI / 6)) / Math.cos(w - Math.PI / 6), RC, m); ctx[i ? "lineTo" : "moveTo"](dx + r * Math.cos(a), dx + r * Math.sin(a)); } ctx.closePath(); };
  path(5); ctx.fillStyle = FILL; ctx.globalAlpha = alpha * 0.9; ctx.fill();
  path(0); ctx.globalAlpha = alpha; ctx.lineWidth = 5; ctx.strokeStyle = INKS; ctx.lineJoin = "round"; ctx.stroke();
  ctx.lineWidth = 2; ctx.strokeStyle = "rgba(120,62,6,0.45)"; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-70 + i * 14, -20 - i * 6); ctx.lineTo(-50 + i * 14, -54 - i * 6); ctx.stroke(); }
  ctx.restore();
}
function sceneCircles(t) {
  if (t > l5 + 1.2) return;
  const m = io(ph(t, l4 + 0.05, 0.6)), u = out(ph(t, p4[1] - 0.35, 0.8));
  if (u > 0) RING.forEach(([q, r]) => { if (q || r) { const p = circPos(q, r); blob(p[0] * u, p[1] * u, 1, cl(u * 1.4)); } });
  blob(0, 0, m, 1);
  if (u >= 1) GAPS.forEach((g, i) => { const gp = ph(t, p4[1] + 0.75 + i * 0.03, 0.25); if (gp <= 0) return; gapPath(g); ctx.globalAlpha = gp * (0.72 + 0.28 * Math.sin(t * 9 + i)); ctx.fillStyle = "#e8437f"; ctx.fill(); ctx.globalAlpha = 1; });
  const bw = io(ph(t, l4 + 0.7, p4[1] + 0.9 - (l4 + 0.7)));
  beeAt(lerp(430, 170, bw), lerp(640, 270, bw), -0.61, 0.72, t, bw > 0 && bw < 1 ? 1 : 0.12, t, ph(t, l4 + 0.6, 0.3));
}

// ---- three tilings, each a patch of the page ----
const PW = 860, PH = 500, PATCH = [{ cy: -600, cells: [] }, { cy: 0, cells: [] }, { cy: 600, cells: [] }];
(function () {
  const add = (i, pts) => PATCH[i].cells.push({ pts, cx: pts.reduce((s, p) => s + p[0], 0) / pts.length, cy: pts.reduce((s, p) => s + p[1], 0) / pts.length, tone: TONES[Math.floor(rnd() * 3)] });
  const a = 124, h = (a * R3) / 2;
  for (let j = -3; j <= 2; j++) for (let k = -5; k <= 4; k++) {
    const off = (j & 1 ? a / 2 : 0), y0 = j * h + 12;
    add(0, [[k * a + off, y0 + h], [k * a + a + off, y0 + h], [k * a + a / 2 + off, y0]]);
    add(0, [[k * a + a / 2 + off, y0], [k * a + (3 * a) / 2 + off, y0], [k * a + a + off, y0 + h]]);
  }
  const s = 112;
  for (let j = -3; j <= 2; j++) for (let k = -5; k <= 4; k++) add(1, [[k * s + 18, j * s + 26], [k * s + s + 18, j * s + 26], [k * s + s + 18, j * s + s + 26], [k * s + 18, j * s + s + 26]]);
  const r = 64, w = R3 * r;
  for (let j = -4; j <= 4; j++) for (let k = -5; k <= 5; k++) { const cx = k * w + (j & 1 ? w / 2 : 0), cy = j * 1.5 * r, pts = []; for (let i = 0; i < 6; i++) { const an = (Math.PI / 3) * i - Math.PI / 2; pts.push([cx + r * Math.cos(an), cy + r * Math.sin(an)]); } add(2, pts); }
})();
// Before the three that work: pentagons, octagons and heptagons, which always leave gaps.
const REJECT = [{ n: 5, d: 118, hex: true, rot: 0 }, { n: 8, d: 2 * 62 * Math.cos(Math.PI / 8), hex: false, rot: Math.PI / 8 }, { n: 7, d: 121, hex: true, rot: 0 }].map((o) => {
  const list = [];
  for (let j = -3; j <= 3; j++) for (let k = -5; k <= 5; k++) list.push({ cx: k * o.d + (o.hex && j & 1 ? o.d / 2 : 0), cy: j * o.d * (o.hex ? R3 / 2 : 1), tone: TONES[Math.floor(rnd() * 3)] });
  return Object.assign({ list }, o);
});
function sceneRejects(t, i) {
  const rj = REJECT[i], e = io(ph(t, p5[1] - 0.2 + i * 0.08, 0.35)); if (e >= 1 || t < l5 + 0.4) return;
  ctx.save(); ctx.globalAlpha = (1 - e) * ph(t, l5 + 0.55 + i * 0.3, 0.3) * 0.8; ctx.fillStyle = "#f29bb8"; ctx.fillRect(-PW / 2, -PH / 2, PW, PH);
  rj.list.forEach((c) => {
    const p = ph(t, l5 + 0.55 + i * 0.3 + (c.cx + PW / 2) / 2200, 0.2); if (p <= 0) return;
    const s = lerp(0.5, 1, back(p));
    ctx.save(); ctx.translate(c.cx, c.cy + 70 * e * e); ctx.scale(s, s); ctx.globalAlpha = cl(p * 1.5) * (1 - e);
    ctx.beginPath(); for (let v = 0; v < rj.n; v++) { const a = (v / rj.n) * TAU - Math.PI / 2 + rj.rot; ctx[v ? "lineTo" : "moveTo"](62 * Math.cos(a), 62 * Math.sin(a)); } ctx.closePath();
    ctx.fillStyle = c.tone; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INKS; ctx.lineJoin = "round"; ctx.stroke();
    ctx.restore();
  });
  ctx.restore();
}
function sceneTilings(t) {
  if (t < l5 - 0.5 || t > l7 + 0.7) return;
  PATCH.forEach((pa, i) => {
    const t0 = p5[2 + i] - 0.05, fp = io(ph(t, l5 + 0.15 + i * 0.12, 0.5));
    ctx.save(); ctx.translate(X5, pa.cy);
    ctx.save(); ctx.beginPath(); ctx.rect(-PW / 2, -PH / 2, PW, PH); ctx.clip();
    sceneRejects(t, i);
    pa.cells.forEach((c) => {
      const p = ph(t, t0 + (c.cx + PW / 2) / 1700, 0.22); if (p <= 0) return;
      const s = lerp(0.5, 1, back(p));
      ctx.save(); ctx.translate(c.cx, c.cy); ctx.scale(s, s); ctx.translate(-c.cx, -c.cy); ctx.globalAlpha = cl(p * 1.5);
      polyPath(c.pts); ctx.fillStyle = c.tone; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INKS; ctx.lineJoin = "round"; ctx.stroke();
      ctx.restore();
    });
    ctx.restore();
    if (fp > 0) { polyFrac([[-PW / 2, -PH / 2], [PW / 2, -PH / 2], [PW / 2, PH / 2], [-PW / 2, PH / 2]], 0, fp); ctx.lineWidth = 6; ctx.strokeStyle = INKS; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke(); }
    tag([[TX.gap, "#d81b60"]], 250, 190, ph(t, l5 + 1.5 + i * 0.3, 0.3) * (1 - ph(t, p5[1] - 0.25 + i * 0.08, 0.25)), 50);
    ctx.restore();
  });
  if (t > p5[4] && t < l6 + 1) { const bw = ph(t, p5[4] + 0.15, l6 + 0.1 - (p5[4] + 0.15)); beeAt(lerp(X5 - 560, X5 + 120, bw), lerp(700, 640, bw), 1.48, 0.6, t, bw < 1 ? 1 : 0.1, t, ph(t, p5[4] + 0.1, 0.25)); }
}

// ---- same area, how much wall ----
const AREA = 62500, SHAPES = (function () {
  const s = Math.sqrt((4 * AREA) / R3), h = (s * R3) / 2, q = Math.sqrt(AREA), r = Math.sqrt((2 * AREA) / (3 * R3)), hex = [];
  for (let i = 0; i < 6; i++) { const a = (Math.PI / 3) * i - Math.PI / 2; hex.push([r * Math.cos(a), r * Math.sin(a)]); }
  return [{ pts: [[0, (-2 * h) / 3], [s / 2, h / 3], [-s / 2, h / 3]], per: 3 * s }, { pts: [[-q / 2, -q / 2], [q / 2, -q / 2], [q / 2, q / 2], [-q / 2, q / 2]], per: 4 * q }, { pts: hex, per: 6 * r }];
})();
function sceneCompare(t) {
  if (t < l6 - 0.5 || t > l7 + 0.7) return;
  const gold = ph(t, p6[4], 0.3), dim = ph(t, p6[4] + 0.1, 0.4);
  SHAPES.forEach((sh, i) => {
    const y = [-480, 0, 480][i], inP = out(ph(t, l6 + 0.3 + i * 0.12, 0.45)), u = io(ph(t, p6[1 + i] + 0.05, 0.9)), a = inP * (i < 2 ? lerp(1, 0.4, dim) : 1);
    if (a <= 0) return;
    const wallC = i === 2 ? rgb(mix([184, 88, 11], [240, 160, 20], gold)) : BROWN;
    ctx.save(); ctx.translate(X6 - 330 - (1 - inP) * 420, y); ctx.globalAlpha = a * 0.9;
    ctx.save(); ctx.translate(5, 5); polyPath(sh.pts); ctx.fillStyle = "#f3bf4a"; ctx.fill(); ctx.restore();
    ctx.globalAlpha = a * 0.35; polyPath(sh.pts); ctx.lineWidth = 3; ctx.strokeStyle = INKS; ctx.stroke();
    ctx.globalAlpha = a; if (u < 1) { polyFrac(sh.pts, u, 1); ctx.lineWidth = 11; ctx.strokeStyle = wallC; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke(); }
    ctx.restore();
    if (u <= 0) return;
    const x0 = X6 - 100, len = sh.per * 0.36 * u;
    ctx.globalAlpha = a;
    ctx.fillStyle = wallC; ctx.fillRect(x0, y + 20, len, 50); ctx.lineWidth = 3.5; ctx.strokeStyle = INKS; ctx.strokeRect(x0, y + 20, len, 50);
    if (u < 1) { ctx.beginPath(); ctx.arc(x0 + len, y + 45, 13, 0, TAU); ctx.fillStyle = INKS; ctx.fill(); }
    txt(((sh.per / Math.sqrt(AREA)) * u).toFixed(2), x0, y - 22, 104, i === 2 && gold > 0.5 ? "#c9760a" : INKS, { align: "left", font: NUM });
    ctx.globalAlpha = 1;
  });
  tag([[TX.theLeast, "#c9760a"]], X6 + 60, 640, ph(t, p6[4] + 0.15, 0.3), 58);
  const lp = ph(t, p6[4] + 0.25, 0.5);
  beeAt(X6 - 330, 490, 0.3, lerp(1.25, 0.6, out(lp)), t, 0.1, t, lp);       // she lands on the winner
}

// ---- two thousand years ----
const DOODLES = [760, 1180, 1620, 2060, 2400].map((Y) => ({ Y, rot: rnd() * 0.6 - 0.3, dy: -150 - rnd() * 60 }));
const yearNow = (t) => YEAR0 + (YEAR1 - YEAR0) * io(ph(t, l7 + 0.5, TRAVEL));
function sceneTimeline(t) {
  if (t < l7 - 0.6) return;
  const xN = xOf(yearNow(t)), x0 = xOf(YEAR0);
  ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(xN, 0); ctx.lineWidth = 7; ctx.strokeStyle = INKS; ctx.lineCap = "round"; ctx.stroke();
  TX.ticks().forEach(([Y, label, big]) => {
    const x = xOf(Y), a = cl((xN - x) / 100); if (a <= 0) return;
    ctx.globalAlpha = a; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, big ? 46 : 26); ctx.lineWidth = 4; ctx.strokeStyle = INKS; ctx.stroke();
    txt(label, x, 92, big ? 38 : 30, "rgba(43,38,34,0.72)", { font: NUM });
  });
  DOODLES.forEach((d) => {                       // people along the way, still wondering
    const x = xOf(d.Y), a = cl((xN - x + 200) / 160); if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, d.dy); ctx.rotate(d.rot); ctx.scale(lerp(0.5, 1, back(a)), lerp(0.5, 1, back(a)));
    hexPath(0, 0, 50); ctx.lineWidth = 4; ctx.strokeStyle = INKS; ctx.lineJoin = "round"; ctx.stroke(); txt("?", 0, 20, 56, BROWN, { font: NUM });
    ctx.restore();
  });
  ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.arc(x0, 0, 17, 0, TAU); ctx.fillStyle = INKS; ctx.fill();
  tag([[TX.asked]], x0 + 170, -150, ph(t, l7 + 0.15, 0.3), 48);
  ctx.globalAlpha = ph(t, l7 + 0.3, 0.3); txt(TX.askedWhen, x0 + 150, 170, 40, BROWN); ctx.globalAlpha = 1;
  const ep = ph(t, T.yearLand - 0.05, 0.25);
  if (ep > 0) { const s = back(ep); ctx.beginPath(); ctx.arc(XE, 0, 24 * s, 0, TAU); ctx.fillStyle = "#f2a516"; ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = INKS; ctx.stroke(); }
  else { ctx.beginPath(); ctx.arc(xN, 0, 9, 0, TAU); ctx.fillStyle = INKS; ctx.fill(); }
}

// ---- nothing beats the hexagon ----
function contender(k, r) {
  ctx.beginPath();
  if (k === 0) ctx.arc(0, 0, r, 0, TAU);
  else if (k === 5) for (let i = 0; i <= 80; i++) { const a = (i / 80) * TAU, rr = r * (1 + 0.2 * Math.sin(a * 3)); ctx[i ? "lineTo" : "moveTo"](rr * Math.cos(a), rr * Math.sin(a)); }
  else { const n = [0, 4, 3, 5, 8][k]; for (let i = 0; i < n; i++) { const a = (i / n) * TAU - Math.PI / 2 + (n === 4 ? Math.PI / 4 : 0); ctx[i ? "lineTo" : "moveTo"](r * 1.1 * Math.cos(a), r * 1.1 * Math.sin(a)); } }
  ctx.closePath();
}
function sceneShowdown(t) {
  if (t < p7[2] - 0.3) return;
  for (let k = 0; k < 6; k++) {
    const ap = ph(t, p7[2] + 0.2 + k * 0.06, 0.3), g = ph(t, p7[3] + 0.35 + k * 0.14, 0.6); if (ap <= 0 || g >= 1) continue;
    const a = (k * Math.PI) / 3 + Math.PI / 6 + (t - p7[2]) * 0.25, s = back(ap);
    ctx.save(); ctx.translate(XE + 340 * Math.cos(a), YE + 340 * Math.sin(a) + 900 * g * g); ctx.rotate(g * 1.6 * (k % 2 ? 1 : -1)); ctx.scale(s, s); ctx.globalAlpha = 1 - g;
    ctx.save(); ctx.translate(4, 4); contender(k, 78); ctx.fillStyle = "#f6dc92"; ctx.fill(); ctx.restore();
    contender(k, 78); ctx.lineWidth = 5; ctx.strokeStyle = INKS; ctx.lineJoin = "round"; ctx.stroke();
    ctx.restore();
  }
  const hp = ph(t, p7[2] + 0.1, 0.35); if (hp <= 0) return;
  const s = back(hp) * (1 + 0.1 * out(ph(t, p7[3], 0.3)) * (1 - ph(t, p7[3] + 0.3, 0.4)));
  const rp = out(ph(t, p7[3] + 0.9, 0.4));
  if (rp > 0) { ctx.lineWidth = 6; ctx.strokeStyle = "#f2a516"; ctx.lineCap = "round"; for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; ctx.beginPath(); ctx.moveTo(XE + 190 * Math.cos(a), YE + 190 * Math.sin(a)); ctx.lineTo(XE + (190 + 62 * rp) * Math.cos(a), YE + (190 + 62 * rp) * Math.sin(a)); ctx.stroke(); } }
  ctx.save(); ctx.translate(XE, YE); ctx.scale(s, s);
  const g = ctx.createRadialGradient(-30, -36, 10, 0, 0, 160); g.addColorStop(0, "#ffd66a"); g.addColorStop(0.6, "#f2a516"); g.addColorStop(1, "#c9760a");
  hexPath(0, 0, 150); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = INKS; ctx.lineJoin = "round"; ctx.stroke();
  ctx.restore();
}

function drawPaper(t) {
  ctx.drawImage(paper, 0, 0);
  const cam = camChain(CAM_P, KEYS_P, t);
  ctx.save(); camApply(cam);
  // faint crosses fixed to the page, so the eye can tell when the camera moves over empty paper
  const xa = cam[1] - cam[3] / cam[0], xb = cam[1] + (W - cam[3]) / cam[0], ya = cam[2] - cam[4] / cam[0], yb = cam[2] + (H - cam[4]) / cam[0];
  ctx.lineWidth = 1.6; ctx.strokeStyle = "rgba(43,38,34,0.16)"; ctx.beginPath();
  for (let x = Math.ceil(xa / 240) * 240; x < xb; x += 240) for (let y = Math.ceil(ya / 240) * 240; y < yb; y += 240) { ctx.moveTo(x - 9, y); ctx.lineTo(x + 9, y); ctx.moveTo(x, y - 9); ctx.lineTo(x, y + 9); }
  ctx.stroke();
  sceneCircles(t); sceneTilings(t); sceneCompare(t); sceneTimeline(t); sceneShowdown(t);
  ctx.restore();

  // ---- screen marks ----
  const o4 = 1 - ph(t, l5 - 0.4, 0.2);
  tag([[TX.circle[0]], [TX.circle[1], BROWN]], 540, 230, ph(t, l4 + 0.6, 0.3) * o4, 58);
  tag([[TX.gaps[0]], [TX.gaps[1], "#d81b60"]], 700, 1600, ph(t, p4[1] + 0.85, 0.3) * o4, 60);
  const o5 = 1 - ph(t, p5[2] - 0.3, 0.2), h1 = ph(t, l5 + 0.5, 0.3) * o5, h2 = ph(t, p5[1], 0.25) * o5;
  if (h1 > 0) { ctx.globalAlpha = h1; txt(TX.tile, 540, 160, 56, INKS); ctx.globalAlpha = 1; }
  if (h2 > 0) { ctx.save(); ctx.translate(540, 240); ctx.scale(lerp(0.6, 1, back(cl(h2))), lerp(0.6, 1, back(cl(h2)))); ctx.globalAlpha = h2; txt(TX.three, 0, 40, 96, BROWN); ctx.restore(); }
  TX.names.forEach((name, k) => tag([[name]], 640, 1250, ph(t, p5[2 + k] + 0.25, 0.25) * (1 - ph(t, (k < 2 ? p5[3 + k] : l6 - 0.05) - 0.2, 0.15)), 60));
  const o6 = 1 - ph(t, l7 - 0.4, 0.2);
  tag([[TX.area]], 540, 190, ph(t, l6 + 0.4, 0.3) * o6, 60);
  const s6 = ph(t, p6[1] - 0.4, 0.3) * o6; if (s6 > 0) { ctx.globalAlpha = s6; txt(TX.howMuch, 540, 300, 46, BROWN); ctx.globalAlpha = 1; }
  const cA = ph(t, l7 + 0.35, 0.3) * (1 - ph(t, p7[2] - 0.15, 0.3));
  if (cA > 0) {                                  // the year counter rides with the camera
    const Y = yearNow(t);
    ctx.globalAlpha = cA; txt(TX.era(Y), 540, 380, 64, BROWN); txt(TX.year(Y), 540, 560, 200, INKS, { font: NUM });
    txt(TX.passed(Math.round(Y - YEAR0)), 540, 660, 56, BROWN);
    const sp = ph(t, T.yearLand + 0.25, 0.25);
    if (sp > 0) { const s = lerp(1.7, 1, out(sp)); ctx.save(); ctx.translate(560, 810); ctx.rotate(-0.1); ctx.scale(s, s); ctx.globalAlpha = cA * sp; ctx.lineWidth = 7; ctx.strokeStyle = "#c0392b"; ctx.strokeRect(-250, -62, 500, 124); txt(TX.proven, 0, 26, 76, "#c0392b"); ctx.restore(); }
    ctx.globalAlpha = 1;
  }
  tag([[TX.win[0]], [TX.win[1], "#c9760a"]], 690, 1480, ph(t, p7[3] + 0.15, 0.3) * (1 - ph(t, l8 - 0.7, 0.25)), TX.winSize);
  vignette(1);
}

// =====================================================================================
// COMB WORLD, part B: back to the bees, who had it right all along
// =====================================================================================
const CAM_B = [300 / R, tc.cx, tc.cy, 540, 900];
const KEYS_B = [{ t: l8 + 0.1, d: 2.7, cam: [1, 540, 960, 540, 960] }, { t: p8[1] - 0.1, d: T.dur - (p8[1] - 0.1), cam: [1.2, 530, 900, 540, 900] }];
const BEES = [
  { x: 540, y: 1010, rot: -0.12, dx: -15, dy: -150, s: 1, t0: l8 + 2.2 },
  { x: 230, y: 520, rot: 2.2, dx: 80, dy: 60, s: 0.92, t0: p8[1] - 0.6 },
  { x: 860, y: 420, rot: -1.1, dx: -70, dy: -40, s: 0.95, t0: p8[1] - 0.42 },
  { x: 830, y: 1560, rot: -0.7, dx: -50, dy: -60, s: 0.9, t0: p8[1] - 0.24 },
  { x: 870, y: 1130, rot: -2.5, dx: -40, dy: 55, s: 0.96, t0: p8[1] - 0.06 },
  { x: 560, y: 300, rot: 3.0, dx: 10, dy: 90, s: 0.88, t0: p8[1] + 0.12 },
];
function drawCombB(t) {
  ctx.drawImage(paper, 0, 0);
  const cam = camChain(CAM_B, KEYS_B, t);
  ctx.save(); camApply(cam);
  drawCombCells(t, cam);
  BEES.forEach((b, i) => { const lp = ph(t, b.t0, 0.5), mv = ph(t, b.t0, T.dur - b.t0); beeAt(b.x + b.dx * mv, b.y + b.dy * mv, b.rot + Math.sin(t * 3 + i) * 0.03, b.s * lerp(1.45, 1, out(lp)), t + i, 1, t + i * 0.07, lp); });   // each one lands, then walks
  ctx.restore();
  const tp = ph(t, p8[2] + 0.9, 0.4);
  tag([[TX.title]], 700, 1430, tp, TX.titleSize);
  if (tp > 0) { ctx.globalAlpha = ph(t, p8[2] + 1.15, 0.3); txt(TX.series, 700, 1532, 42, CREAM, { stroke: "rgba(43,38,34,0.85)", sw: 9 }); ctx.globalAlpha = 1; }
  vignette(1);
}

// =====================================================================================
// One frame. The sketchbook is laid over the comb while the two meet on the same hexagon.
// =====================================================================================
const layer = offscreen(), layerCtx = layer.getContext("2d");
const IN1 = l4 - 0.3, IN2 = l4 + 0.15, OUT1 = l8 - 0.25, OUT2 = l8 + 0.2;
function render(t) {
  t = Math.max(0, Math.min(T.dur, t));
  ctx = mainCtx; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  if (t < IN2) drawCombA(t);
  else if (t >= OUT1) drawCombB(t);
  if (t >= IN1 && t < OUT2) {
    const a = t < IN2 ? io(ph(t, IN1, IN2 - IN1)) : t >= OUT1 ? 1 - io(ph(t, OUT1, OUT2 - OUT1)) : 1;
    if (a >= 1) drawPaper(t);
    else { ctx = layerCtx; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; drawPaper(t); ctx = mainCtx; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(layer, 0, 0); ctx.globalAlpha = 1; }
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  window.__lastT = t;
  if (typeof drawNarrator === "function") drawNarrator(t);
  ctx.drawImage(grain, 0, 0);
}

// The narrator in the corner: [time, pose, pose to use if that one has not been drawn]. Read by host.js.
const NARRATOR_PLAN = [
  [0, "wave"],
  [T.b, "point"],                      // แต่สร้างรังเป็นหกเหลี่ยมทุกช่อง
  [T.q, "shrug", "think"],             // ทำไมต้องหกเหลี่ยม
  [l2, "present", "stand"],            // รังทำจากขี้ผึ้ง
  [p2[1], "surprise", "stand"],        // และขี้ผึ้งแพงมาก
  [p2[2], "point"],                    // ผึ้งต้องกินน้ำผึ้ง...
  [l3, "think"],                       // โจทย์ของผึ้งจึงเป็นแบบนี้
  [p3[1], "point"],                    // เก็บน้ำผึ้งให้มากที่สุด...
  [l4, "present", "stand"],            // วงกลมใช้ผนังน้อยที่สุด
  [p4[1], "shrug", "think"],           // แต่วางชิดกันแล้วเหลือช่องว่าง
  [l5, "present", "stand"],            // รูปด้านเท่าที่ปูเต็มพื้นได้...
  [p5[1], "three", "point"],           // มีแค่สามแบบ
  [p5[2], "point"],                    // สามเหลี่ยม สี่เหลี่ยม และหกเหลี่ยม
  [l6, "think"],                       // ถ้าทุกช่องจุเท่ากัน
  [p6[1], "point"],                    // สามเหลี่ยมใช้ผนังยาวที่สุด...
  [p6[4], "thumb"],                    // ใช้น้อยที่สุด
  [l7, "surprise", "stand"],           // ...มากว่าสองพันปี
  [p7[1], "point"],                    // และเพิ่งพิสูจน์ได้ในปี...
  [p7[3], "thumb"],                    // ไม่มีรูปไหนชนะหกเหลี่ยม
  [l8, "shrug", "think"],              // มนุษย์ใช้เวลากว่าสองพันปี...
  [p8[1], "present", "stand"],         // ส่วนผึ้ง
  [p8[2] + 0.9, "thumb"],              // (ป้ายชื่อเรื่อง)
];
