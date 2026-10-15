// Act 3, money, time and the city (0:31.4 - 1:03.04). Shots 13-23 of docs/แผนภาพ-ร่าง1.md.
// A banknote loses its number; the bank, the pay day and the shop cannot count. The clock
// breaks; nine o'clock, Monday and "eighteen" are rubbed out; two friends can only agree to
// meet "when the sun is about there". Then building: rulers lose their marks, pillars, a
// bridge and a floor come out wrong, and a tower goes up by guesswork.

const A3 = {
  boxes: Array.from({ length: 16 }, (_, i) => ({ lv: i % 3, x: (i * 0.37 + rnd() * 0.2) % 1, w: 70 + rnd() * 50, h: 56 + rnd() * 34, c: VIVID[i % VIVID.length] })),
  falls: Array.from({ length: 6 }, (_, i) => ({ x: 600 + rnd() * 470, t0: 0.5 + i * 0.35, w: 80 + rnd() * 40, c: VIVID[(i * 2 + 1) % VIVID.length], spin: (rnd() - 0.5) * 3 })),
  city: Array.from({ length: 11 }, (_, i) => ({ x: 60 + i * 172, w: 140 + rnd() * 40, h: 240 + rnd() * 420, c: VIVID[(i * 3) % VIVID.length] })),
  pillars: [300, 190, 380, 240, 330],
  floors: Array.from({ length: 9 }, (_, i) => ({ r: 0.0035 * i + (rnd() - 0.4) * 0.012, dx: (rnd() - 0.4) * 16, c: VIVID[(i * 2 + 3) % VIVID.length], who: ["girl", "man", "curly", "auntie", "boy", "teacher"][i % 6], win: Math.floor(rnd() * 3) })),
};

function a3Dots(c, step) { ctx.fillStyle = c; for (let y = 0; y < H + step; y += step) for (let x = (y / step) % 2 ? step / 2 : 0; x < W + step; x += step) { ctx.beginPath(); ctx.arc(x, y, step * 0.17, 0, TAU); ctx.fill(); } }
function a3Strips(c, y1) { ctx.fillStyle = c; for (let x = 40; x < W; x += 200) ctx.fillRect(x, 0, 70, y1); }
// The main puppet watching from the side: small, at the edge.
function a3Viewer(now, x, y, k, keys) {
  const p = pupChain(keys, now); p.tilt += Math.sin(now * 2.1) * 0.012;
  footShadow(x, y); drawPuppet(p, x, y, k, now); return p;
}

// ---------------- shot 13: the banknote with no number ----------------
function a3Money(now) {
  ctx.fillStyle = "#19c99a"; ctx.fillRect(0, 0, W, H); a3Dots("#3fdcb0", 220);
  const m = cl((now - EV.useless - 0.1) / 0.9), k = back(ph(now, 31.42, 0.4));
  ctx.save(); ctx.translate(960, 500 + Math.sin(now * 1.4) * 8); ctx.rotate(-0.04 + 0.02 * Math.sin(now)); ctx.scale(k, k);
  sticker("banknote", 0, 0, 980, { sat: 1 - 0.85 * m });
  meltText("100", 0, 46, 124, "#1e7a45", m, { dash: "#8aa596" });
  [[-402, -150], [402, -150], [-402, 172], [402, 172]].forEach(([x, y], i) => meltText("100", x, y, 26, "#1e7a45", cl(m * 1.3 - i * 0.08), { dash: "#8aa596" }));
  ctx.restore();
  [[330, 250], [1600, 800], [1560, 230], [360, 790]].forEach(([x, y], i) => { const a = back(ph(now, EV.useless + 0.5 + i * 0.12, 0.3)); if (a > 0) { ctx.save(); ctx.translate(x, y + Math.sin(now * 3 + i) * 8); ctx.scale(a, a); ctx.rotate((i - 1.5) * 0.2); txt("?", 0, 40, 130, "#ffd21f", { font: NUM, stroke: PAPERC, sw: 14 }); ctx.restore(); } });
}

// ---------------- shot 14: the bank cannot count ----------------
function a3Bank(now) {
  ctx.fillStyle = "#2fd3a6"; ctx.fillRect(0, 0, W, 870); a3Strips("#55dfb8", 870);
  ctx.fillStyle = "#0f9d7a"; ctx.fillRect(0, 860, W, H - 860); cutRect(-20, 842, W + 40, 30, 4, PAPERC, 100, { amp: 1.4 });
  [[620, 0], [1780, 1]].forEach(([x, i]) => { cutRect(x - 44, 150, 88, 700, 10, PAPERC, 101 + i); cutRect(x - 66, 120, 132, 46, 10, "#e3e9f2", 103 + i, { blur: 6, dy: 3 }); });
  cutRect(900, 30, 600, 110, 22, "#ffd21f", 105); txt("ธนาคาร", 1200, 110, 70, INKC);
  const u = now - EV.bankcnt;
  cutRect(820, 200, 760, 150, 18, "#221a2e", 106);                                      // the board of balances
  [..."1,250,000"].forEach((ch, i) => { const q = cl((u - 0.3 - i * 0.05) / 0.25), x = 880 + i * 80; ctx.save(); ctx.translate(x, 310); ctx.scale(1, Math.abs(Math.cos(q * Math.PI * 3))); txt(q > 0.5 && /[0-9]/.test(ch) ? "?" : ch, 0, 0, 96, q > 0.5 ? "#ffd21f" : "#2fd3a6", { font: NUM }); ctx.restore(); });
  sticker("safe", 1650, 560, 300);
  const p = pupChain([                                                                 // the clerk counts, and loses his place
    { t: EV.bankcnt - 0.3, d: 0.01, pose: { head: "happy", hR: [150, -262], bR: -0.2, handR: "point", frontR: true } },
    { t: EV.bankcnt + 0.5, d: 0.25, ease: back, pose: { head: "confused", hL: [-128, -476], bL: 0.9, tilt: -0.08 } },
  ], now);
  p.hR = [p.hR[0] + Math.sin(now * 14) * 26, p.hR[1]];
  drawPuppet(p, 1080, 906, 0.8, now, WHO.clerk);
  cutRect(700, 660, 1300, 250, 12, "#3aa0ff", 107); cutRect(680, 638, 1340, 46, 12, PAPERC, 108, { blur: 8, dy: 5 });
  sticker("coins", 1330, 590, 230);
  a3Viewer(now, 300, 990, 0.78, [{ t: EV.bankcnt - 0.3, d: 0.01, pose: { head: "calm" } }, { t: EV.bankcnt + 0.55, d: 0.3, pose: { head: "confused", hR: [150, -320], bR: -0.7, handR: "palm", tilt: 0.07 } }]);
  keyword(now, "นับไม่ได้", 400, 230, EV.bankcnt + 0.45, EV.salary - 0.1);
}

// ---------------- shot 15: pay day by mood ----------------
function a3Pay(now) {
  ctx.fillStyle = "#ffd21f"; ctx.fillRect(0, 0, W, 880); a3Strips("#ffe05a", 880);
  ctx.fillStyle = "#ff8a1f"; ctx.fillRect(0, 870, W, H - 870); cutRect(-20, 852, W + 40, 30, 4, PAPERC, 110, { amp: 1.4 });
  cutRect(660, 40, 600, 110, 22, "#7a4cff", 111); txt("วันเงินเดือน", 960, 120, 66, PAPERC);
  [[500, "clerk", 150, "confused", 0.06], [960, "staff2", 310, "happy", 0], [1420, "staff3", 220, "confused", -0.06]].forEach(([x, who, w, face, tilt], i) => {
    const t0 = EV.salary + 0.1 + i * 0.3, got = ph(now, t0, 0.3);
    const p = Object.assign({}, PUP_REST, { head: got > 0.5 ? (now > EV.salary + 1.0 ? face : "happy") : "calm", hL: [-70, -256], hR: [70, -256], bL: 0.6, bR: -0.6, frontL: true, frontR: true, handL: "grip", handR: "grip", tilt: now > EV.salary + 1.0 ? tilt : 0 });
    footShadow(x, 990); drawPuppet(p, x, 990, 0.82, now, WHO[who]);
    if (got > 0) { ctx.save(); ctx.translate(x, 808); const k = back(got); ctx.scale(k, k); sticker("envelope", 0, 0, w, { rot: (i - 1) * 0.06 }); ctx.restore(); }
  });
}

// ---------------- shot 16: the shop does not know what it has ----------------
function a3Shop(now) {
  ctx.fillStyle = "#ff6b4a"; ctx.fillRect(0, 0, W, 830); a3Strips("#ff8266", 830);
  ctx.fillStyle = "#ffd9a8"; ctx.fillRect(0, 820, W, H - 820); cutRect(-20, 804, W + 40, 28, 4, PAPERC, 120, { amp: 1.4 });
  const u = now - EV.stock, S = [[830, 560], [1480, 560]], w = 520, h = 520 * 0.97;
  S.forEach(([x, y]) => sticker("shelf", x, y, w));
  A3.boxes.forEach((b, i) => {                                                         // the left shelf: far too much
    const y = S[0][1] - h / 2 + h * [0.31, 0.61, 0.9][b.lv], x = S[0][0] - w * 0.4 + b.x * w * 0.8, a = back(ph(now, EV.stock - 0.1 + i * 0.03, 0.3)); if (a <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(a, a); ctx.rotate((hash(i) - 0.5) * 0.2); rr(-b.w / 2, -b.h, b.w, b.h, 6); cut(b.c, { blur: 6, dy: 3 }); ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillRect(-b.w / 2, -b.h * 0.62, b.w, b.h * 0.2); ctx.restore();
  });
  A3.falls.forEach((b, i) => {                                                         // ... so it falls off
    const q = u - b.t0; if (q < 0) return;
    const d = drop(q, 300, 960 - i * 8);
    ctx.save(); ctx.translate(b.x + q * (i % 2 ? 40 : -40) * (d.air ? 1 : 0.6), d.y); ctx.rotate(d.air ? q * b.spin * 3 : b.spin * 0.3); rr(-b.w / 2, -b.w * 0.7, b.w, b.w * 0.7, 6); cut(b.c, { blur: 6, dy: 3 }); ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillRect(-b.w / 2, -b.w * 0.45, b.w, b.w * 0.14); ctx.restore();
  });
  ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 3;                        // the right shelf: nothing but a cobweb
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(1690, 350); ctx.lineTo(1690 - 150 * Math.cos(i * 0.39), 350 + 150 * Math.sin(i * 0.39)); ctx.stroke(); }
  for (let r = 50; r <= 150; r += 50) { ctx.beginPath(); ctx.arc(1690, 350, r, Math.PI / 2, Math.PI); ctx.stroke(); }
  const a = back(ph(now, EV.stock + 1.0, 0.3)); if (a > 0) { ctx.save(); ctx.translate(1480, 560); ctx.scale(a, a); txt("?", 0, 60, 200, "#ffd21f", { font: NUM, stroke: PAPERC, sw: 16 }); ctx.restore(); }
  sticker("clipboard", 300, 290, 250, { rot: -0.05 });                                  // the stock list: marks without a count
  ctx.strokeStyle = "#2466d6"; ctx.lineWidth = 6; ctx.lineCap = "round";
  for (let i = 0; i < 34; i++) { if (u < 0.2 + i * 0.05) break; const x = 225 + (i % 9) * 18 + hash(i) * 8, y = 220 + Math.floor(i / 9) * 52 + hash(i + 5) * 14; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (hash(i + 2) - 0.5) * 22, y + 34); ctx.stroke(); }
  a3Viewer(now, 300, 1000, 0.7, [{ t: EV.stock - 0.3, d: 0.01, pose: { head: "think", hR: [128, -476], bR: -0.9 } }, { t: EV.stock + 1.1, d: 0.3, pose: { head: "confused", tilt: 0.08 } }]);
}

// ---------------- shot 17: the clock breaks ----------------
function a3ClockFace(R) {
  cutBlob(0, 0, R, R, "#ff5a4d", 130, { amp: 2.5 }); cutBlob(0, 0, R - 44, R - 44, PAPERC, 131, { amp: 2, blur: 6, dy: 3 });
  for (let i = 1; i <= 12; i++) { const a = (TAU * i) / 12 - Math.PI / 2; txt(String(i), (R - 100) * Math.cos(a), (R - 100) * Math.sin(a) + 26, 74, INKC, { font: NUM }); }
  ctx.strokeStyle = INKC; ctx.lineCap = "round"; [[-2.6, 150, 24], [-0.5, 215, 16]].forEach(([a, l, w]) => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(l * Math.cos(a), l * Math.sin(a)); ctx.lineWidth = w; ctx.stroke(); });
  ctx.fillStyle = "#ffd21f"; ctx.beginPath(); ctx.arc(0, 0, 22, 0, TAU); ctx.fill();
}
function a3Clock(now) {
  ctx.fillStyle = "#ffd21f"; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(960, 500); ctx.fillStyle = "#ffe05a"; for (let i = 0; i < 12; i++) { ctx.rotate(TAU / 12); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1400, -180); ctx.lineTo(1400, 180); ctx.closePath(); ctx.fill(); } ctx.restore();
  const u = now - EV.timebreak, R = 350, crack = cl((u - 0.35) / 0.25), fly = Math.max(0, u - 0.72), cuts = [-2.9, -1.7, -0.6, 0.5, 1.5, 2.3];
  ctx.save(); ctx.translate(960 + (crack > 0 && fly <= 0 ? Math.sin(now * 80) * 7 : 0), 500); const k = back(ph(now, EV.timebreak - 0.15, 0.35)); ctx.scale(k, k);
  cuts.forEach((a0, i) => {
    const a1 = i + 1 < cuts.length ? cuts[i + 1] : cuts[0] + TAU, mid = (a0 + a1) / 2, d = fly * 620 + (fly > 0 ? 30 : 0);
    ctx.save(); ctx.translate(Math.cos(mid) * d, Math.sin(mid) * d + fly * fly * 900); ctx.rotate(fly * (i % 2 ? 2.2 : -2.2));
    ctx.beginPath(); ctx.moveTo(40, -20); ctx.arc(40, -20, 900, a0, a1); ctx.closePath(); ctx.clip(); a3ClockFace(R); ctx.restore();
  });
  if (crack > 0 && fly <= 0) { ctx.strokeStyle = INKC; ctx.lineWidth = 7; ctx.lineJoin = "round"; cuts.forEach((a, i) => { ctx.beginPath(); ctx.moveTo(40, -20); for (let s = 1; s <= 6; s++) { const r = (s / 6) * 400 * crack, w = (hash(i * 7 + s) - 0.5) * 0.12; ctx.lineTo(40 + r * Math.cos(a + w), -20 + r * Math.sin(a + w)); } ctx.stroke(); }); }
  ctx.restore();
  keyword(now, "เวลาพัง", 1560, 210, EV.timebreak + 0.72, EV.nine - 0.08, { fill: "#7a4cff" });
}

// ---------------- shot 18: nine o'clock, Monday and eighteen are rubbed out ----------------
function a3Cards(now) {
  ctx.fillStyle = "#2fd3a6"; ctx.fillRect(0, 0, W, H); a3Dots("#55dfb8", 200);
  [[400, EV.nine, "#ff5c8a"], [960, EV.monday, "#3aa0ff"], [1520, EV.age, "#ff8a1f"]].forEach(([x, t0, c], i) => {
    const a = ph(now, t0 - 0.05, 0.3); if (a <= 0) return;
    const e = cl((now - t0 - 0.5) / 0.42);                                             // the eraser crosses the card
    ctx.save(); ctx.translate(x, 490); const k = back(a); ctx.scale(k, k); ctx.rotate((i - 1) * 0.04);
    roughLoop(rectPts(-215, -270, 430, 540, 30), 140 + i, 2.5); cut(PAPERC);
    ctx.fillStyle = c; ctx.fillRect(-215, -270, 430, 26);
    ctx.save(); ctx.beginPath(); ctx.rect(-215 + 430 * e, -240, 430, 520); ctx.clip();
    if (i === 0) {
      cutBlob(0, -70, 130, 130, c, 143, { amp: 1.5, blur: 6, dy: 3 }); ctx.fillStyle = PAPERC; ctx.beginPath(); ctx.arc(0, -70, 104, 0, TAU); ctx.fill();
      ctx.strokeStyle = INKC; ctx.lineCap = "round"; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(0, -70); ctx.lineTo(-58, -70); ctx.stroke(); ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, -70); ctx.lineTo(0, -156); ctx.stroke();
      txt("9:00", 0, 190, 110, INKC, { font: NUM });
    } else if (i === 1) {
      rr(-150, -200, 300, 300, 22); cut("#eef3fb", { blur: 6, dy: 3 }); ctx.fillStyle = c; rr(-150, -200, 300, 84, 22); ctx.fill(); ctx.fillRect(-150, -150, 300, 34);
      txt("ปฏิทิน", 0, -140, 46, PAPERC); for (let r = 0; r < 3; r++) for (let q = 0; q < 5; q++) { ctx.fillStyle = r === 0 && q === 1 ? "#ff3d5a" : "#c9d3e6"; rr(-128 + q * 54, -94 + r * 60, 40, 44, 8); ctx.fill(); }
      txt("วันจันทร์", 0, 196, 76, INKC);
    } else {
      sticker("cake", 0, -20, 300); txt("18", 0, -150, 110, "#ff3d5a", { font: NUM, stroke: PAPERC, sw: 14 }); txt("อายุ 18 ปี", 0, 220, 60, INKC);
    }
    ctx.restore();
    if (e > 0 && e < 1) { ctx.save(); ctx.translate(-215 + 430 * e, Math.sin(e * 22) * 170); ctx.rotate(0.3); rr(-34, -60, 68, 120, 14); cut("#ff8ab5"); ctx.fillStyle = "#3aa0ff"; ctx.fillRect(-34, 10, 68, 30); ctx.restore(); }
    if (e >= 1) txt("?", 0, 70, 220, "#d5dbe8", { font: NUM });
    ctx.restore();
  });
}

// ---------------- shot 19: "when the sun is about there" ----------------
function a3Field(now) {
  const q = cl((now - EV.noword) / 4.5), sun = [lerp(860, 1600, io(q)), lerp(170, 560, q * q)];
  ctx.fillStyle = "#5fd0ff"; ctx.fillRect(0, 0, W, 760);
  for (let i = 0; i < 12; i++) { const a = (TAU * i) / 12 + now * 0.2; ctx.save(); ctx.translate(sun[0] + 134 * Math.cos(a), sun[1] + 134 * Math.sin(a)); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(-18, -12); ctx.lineTo(22, 0); ctx.lineTo(-18, 12); ctx.closePath(); cut("#ff9d1c", { blur: 6, dy: 3 }); ctx.restore(); }
  cutBlob(sun[0], sun[1], 92, 92, rgb(mix([255, 210, 31], [255, 120, 40], q)), 150, { amp: 1.6 });
  [[240, 150, 1], [1240, 110, 0.8]].forEach(([x, y, k]) => paperCloud(x + (now - EV.noword) * 14, y, k));
  roughLoop([[-40, 660], [360, 600], [820, 660], [1300, 590], [1960, 650], [1960, 800], [-40, 800]], 151, 5); cut("#19b866", { dy: -3 });
  ctx.fillStyle = "#3fd96b"; ctx.fillRect(0, 740, W, H - 740);
  paperTree(1730, 760, 1.25, 152);
  const px = 620, py = 950, len = lerp(40, 520, q);
  ctx.fillStyle = "rgba(20,60,40,0.24)"; ctx.beginPath(); ctx.ellipse(px - len / 2, py + 6, len / 2 + 110, 22, 0, 0, TAU); ctx.fill();   // the shadow grows as the sun goes down
  const fx = lerp(1010, 2250, io(ph(now, EV.only + 0.1, 2.0))), going = now > EV.only + 0.1;                                              // the friend, who walks off
  let f = Object.assign({}, PUP_REST, { head: "happy", hL: [-150, -420], bL: 0.3, handL: "point", frontL: true });
  if (going) f = Object.assign({}, f, pupWalk((now - EV.only) * 2.6, 48), { head: "happy", handL: "open", frontL: false, lean: 0.06 });
  if (fx < 2100) { ctx.fillStyle = "rgba(20,60,40,0.24)"; ctx.beginPath(); ctx.ellipse(fx - len / 2, py + 6, len / 2 + 100, 20, 0, 0, TAU); ctx.fill(); drawPuppet(f, fx, py, SC * 0.95, now, WHO.friend); }
  const an = Math.max(-0.5, Math.atan2(sun[1] - (py - 360 * SC), sun[0] - px)), aim = [40 + Math.cos(an) * 138, -360 + Math.sin(an) * 138];   // not steeper than this, or the arm crosses the face   // the hand that follows the sun
  const p = pupChain([
    { t: EV.noword, d: 0.01, pose: { head: "happy", hR: aim, bR: -0.15, handR: "point", frontR: true } },
    { t: EV.only + 0.3, d: 0.3, pose: { head: "calm", hL: [-150, -410], bL: 0.6, handL: "wave" } },
    { t: EV.sunlike - 0.1, d: 0.3, pose: { head: "happy", hL: [-108, -240], bL: 0.5, handL: "open" } },
    { t: EV.sunlike + 0.9, d: 0.3, pose: { head: "think", tilt: 0.06 } },
  ], now);
  p.hR = aim; p.mouth = (now > EV.fivemin && now < 45.76 || now > EV.sunlike && now < 48.0) && talking(now);
  if (p.mouth && p.head === "think") p.head = "happy";
  drawPuppet(p, px, py, SC, now);
  if (now > EV.fivemin - 0.05 && now < EV.only + 0.25) {                                // what nobody can say any more
    const b = back(ph(now, EV.fivemin - 0.05, 0.3)), m = cl((now - EV.fivemin - 0.55) / 0.5);
    ctx.save(); ctx.globalAlpha = cl((EV.only + 0.25 - now) / 0.2); ctx.translate(560, 200); ctx.scale(b, b);
    ctx.beginPath(); ctx.roundRect(-330, -70, 660, 140, 36); ctx.moveTo(-40, 60); ctx.lineTo(30, 150); ctx.lineTo(60, 60); ctx.closePath(); cut(PAPERC);
    meltText("เจอกันอีก 5 นาที", 0, 22, 62, "#2466d6", m, { font: FONT, dash: "#ff3d5a" });
    ctx.restore();
  }
  bubble(now, "เจอกันตอนแดดประมาณนี้นะ", 640, 200, EV.sunlike, EV.city - 0.08, { size: 56, tx: 640, ty: 400 });
}

// ---------------- shot 20: how do you build a city? ----------------
function a3City(now) {
  ctx.fillStyle = "#ff6b4a"; ctx.fillRect(0, 0, W, H); cutBlob(1500, 260, 150, 150, "#ffd21f", 160, { amp: 2 });
  const u = now - EV.city, sh = u > 0.72 ? Math.sin(now * 55) * 10 * cl(1 - (u - 0.72) / 0.5) : 0;
  A3.city.forEach((b, i) => {
    const g = back(ph(now, EV.city + i * 0.05, 0.4)); if (g <= 0) return;
    ctx.save(); ctx.translate(b.x + b.w / 2 + sh * (i % 2 ? 1 : -1), 920); ctx.rotate(sh * 0.004 * (i % 2 ? 1 : -1)); ctx.scale(1, g);
    rr(-b.w / 2, -b.h, b.w, b.h + 30, 8); cut(b.c);
    ctx.fillStyle = "rgba(255,255,255,0.6)"; for (let y = 40; y < b.h - 40; y += 70) for (let x = -b.w / 2 + 22; x < b.w / 2 - 40; x += 48) ctx.fillRect(x, -b.h + y, 26, 36);
    ctx.restore();
  });
  ctx.fillStyle = "#7a2d1c"; ctx.fillRect(0, 920, W, H - 920);
  const a = back(ph(now, EV.city + 0.6, 0.3)); if (a > 0) { ctx.save(); ctx.translate(960, 330); ctx.scale(a, a); txt("?", 0, 100, 330, PAPERC, { font: NUM, stroke: "#7a4cff", sw: 22 }); ctx.restore(); }
}

// ---------------- shot 21: no metre, no degree, no area ----------------
function a3Loose(now, t0, x, y, i, draw) {                                              // a mark that sits in place until t0, then falls
  const u = now - t0 - i * 0.02; if (u <= 0) { ctx.save(); ctx.translate(x, y); draw(); ctx.restore(); return; }
  const d = drop(u, y, 880 + hash(i) * 40); ctx.save(); ctx.globalAlpha = cl(2.4 - u * 1.4); ctx.translate(x + u * (hash(i + 3) - 0.5) * 200, d.y); ctx.rotate(u * (hash(i + 9) - 0.5) * 9); draw(); ctx.restore();
}
function a3Tools(now) {
  ctx.fillStyle = "#ffd21f"; ctx.fillRect(0, 0, W, H); a3Dots("#ffe05a", 200);
  let a = back(ph(now, EV.metre - 0.05, 0.3));
  if (a > 0) {                                                                          // the ruler
    ctx.save(); ctx.translate(380, 430); ctx.scale(a, a);
    ctx.save(); ctx.rotate(-0.08); rr(-270, -60, 540, 120, 12); cut("#ff8a1f"); ctx.restore();
    for (let i = 0; i <= 20; i++) a3Loose(now, EV.metre + 0.45, -250 + i * 25, -58 + i * -2 + 40, i, () => { ctx.fillStyle = INKC; ctx.fillRect(-2, -40, 4, i % 5 ? 22 : 40); if (i % 5 === 0) txt(String(i / 5), 0, 46, 38, INKC, { font: NUM }); });
    ctx.restore();
  }
  a = back(ph(now, EV.degree - 0.05, 0.3));
  if (a > 0) {                                                                          // the protractor
    ctx.save(); ctx.translate(960, 540); ctx.scale(a, a);
    ctx.beginPath(); ctx.arc(0, 0, 240, Math.PI, TAU); ctx.closePath(); cut("#3aa0ff"); ctx.beginPath(); ctx.arc(0, -4, 120, Math.PI, TAU); ctx.closePath(); ctx.fillStyle = "#ffd21f"; ctx.fill();
    for (let i = 0; i <= 18; i++) { const an = Math.PI + (Math.PI * i) / 18; a3Loose(now, EV.degree + 0.45, 205 * Math.cos(an), 205 * Math.sin(an), i + 30, () => { ctx.rotate(an + Math.PI / 2); ctx.fillStyle = PAPERC; ctx.fillRect(-2, -30, 4, i % 3 ? 20 : 34); if (i % 9 === 0) { ctx.rotate(Math.PI); txt(String(180 - i * 10), 0, -4, 30, PAPERC, { font: NUM }); } }); }
    ctx.restore();
  }
  a = back(ph(now, EV.area - 0.05, 0.3));
  if (a > 0) {                                                                          // the squared paper
    const g = cl((now - EV.area - 0.45) / 0.5);
    ctx.save(); ctx.translate(1540, 430); ctx.scale(a, a); ctx.rotate(0.05);
    rr(-210, -210, 420, 420, 14); cut(PAPERC);
    ctx.fillStyle = "#ff5c8a"; ctx.beginPath(); for (let i = 0; i < 24; i++) { const an = (TAU * i) / 24, sq = [Math.max(-1, Math.min(1, Math.cos(an) * 1.5)) * 120, Math.max(-1, Math.min(1, Math.sin(an) * 1.5)) * 80], bl = [Math.cos(an) * (110 + 30 * Math.sin(an * 3 + now * 2)), Math.sin(an) * (80 + 24 * Math.cos(an * 2))]; ctx.lineTo(lerp(sq[0], bl[0], g), lerp(sq[1], bl[1], g) - 10); } ctx.closePath(); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.rect(-210, -210, 420, 420); ctx.clip(); ctx.globalAlpha *= 1 - g; ctx.strokeStyle = "#9bbcf0"; ctx.lineWidth = 3; for (let i = -4; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(i * 40, -200 + g * 300); ctx.lineTo(i * 40, 200 + g * 300); ctx.moveTo(-200, i * 40 + g * 300); ctx.lineTo(200, i * 40 + g * 300); ctx.stroke(); } ctx.restore();
    meltText("24", 0, 14, 80, PAPERC, g);
    ctx.restore();
  }
  [["ไม่มีเมตร", 380, EV.metre, "#ff3d5a"], ["ไม่มีองศา", 960, EV.degree, "#3aa0ff"], ["ไม่มีพื้นที่", 1540, EV.area, "#7a4cff"]].forEach(([s, x, t0, c]) => keyword(now, s, x, 800, t0 + 0.45, EV.pillar - 0.08, { size: 64, fill: c, rot: 0 }));
}

// ---------------- shot 22: the building site ----------------
function a3Site(now) {
  ctx.fillStyle = "#8fe0ff"; ctx.fillRect(0, 0, W, 870);
  [[200, 130, 0.9], [1500, 100, 0.7]].forEach(([x, y, k]) => paperCloud(x + Math.sin(now * 0.3 + x) * 14, y, k));
  cutRect(1790, 180, 40, 700, 4, "#ffd21f", 170); cutRect(1500, 180, 400, 34, 4, "#ffd21f", 171); ctx.strokeStyle = INKC; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(1560, 214); ctx.lineTo(1560, 330 + Math.sin(now * 2) * 14); ctx.stroke(); cutRect(1536, 330 + Math.sin(now * 2) * 14, 48, 40, 6, "#ff5a4d", 172);
  roughLoop([[-40, 880], [500, 850], [1100, 880], [1960, 850], [1960, H + 40], [-40, H + 40]], 173, 5); cut("#e9a45a", { dy: -3 });
  const G = 866;
  if (now < EV.bridge) {                                                                // pillars of any height you like
    const u = now - EV.pillar, tilt = io(cl((u - 1.55) / 0.4));
    A3.pillars.forEach((h, i) => { const g = back(ph(now, EV.pillar + 0.15 + i * 0.18, 0.35)); if (g > 0) { ctx.save(); ctx.translate(760 + i * 210, G); ctx.scale(1, g); rr(-45, -h, 90, h + 20, 8); cut("#c9cfdf"); ctx.fillStyle = "#aab2c8"; ctx.fillRect(-45, -h, 90, 22); ctx.restore(); } });
    if (u > 0.9) { const d = drop(u - 0.9, -100, G - 380 - 22); ctx.save(); ctx.translate(1180 + tilt * 40, d.y + tilt * 46); ctx.rotate(-tilt * 0.13); rr(-520, -22, 1040, 44, 8); cut("#ff8a1f"); ctx.restore(); }
  } else if (now < EV.slope) {                                                          // a bridge for an unknown weight
    const u = now - EV.bridge, go = io(cl((u - 0.15) / 0.95)), sag = go * 130 + (u > 1.1 ? Math.sin(now * 30) * 5 : 0), cx = lerp(600, 1210, go);
    ctx.fillStyle = "#3aa0ff"; ctx.fillRect(820, 800, 780, 300); ctx.fillStyle = "rgba(255,255,255,0.5)"; for (let i = 0; i < 6; i++) ctx.fillRect(860 + i * 120 + Math.sin(now * 2 + i) * 20, 890 + (i % 2) * 60, 70, 8);
    [760, 1660].forEach((x, i) => cutRect(x - 60, 600, 120, 300, 8, "#c9cfdf", 174 + i));
    const yAt = (x) => { const t = cl((x - 700) / 1020); return 600 + 2 * sag * 2 * t * (1 - t); };
    ctx.beginPath(); ctx.moveTo(560, 580); ctx.lineTo(700, 580); ctx.quadraticCurveTo(1210, 580 + 2 * sag, 1720, 580); ctx.lineTo(1900, 580); ctx.lineTo(1900, 624); ctx.lineTo(1720, 624); ctx.quadraticCurveTo(1210, 624 + 2 * sag, 700, 624); ctx.lineTo(560, 624); ctx.closePath(); cut("#ff5a4d");
    sticker("car", cx, yAt(cx) - 96, 270, { rot: cx < 1210 ? go * 0.12 : 0 });
    if (u > 1.0) { const a = back(ph(now, EV.bridge + 1.0, 0.25)); ctx.save(); ctx.translate(1420, 430); ctx.scale(a, a); txt("!", 0, 60, 190, "#ff3d5a", { font: NUM, stroke: PAPERC, sw: 16 }); ctx.restore(); }
  } else {                                                                             // a floor that slopes nobody knows how much
    const u = now - EV.slope, ang = 0.15 * back(cl(u / 0.4)), s = Math.max(0, u - 0.35), bx = -420 + s * s * 620;
    cutRect(800, 640, 60, 240, 6, "#c9cfdf", 176); cutRect(1560, 740, 60, 140, 6, "#c9cfdf", 177);
    ctx.save(); ctx.translate(1210, 680); ctx.rotate(ang); rr(-500, -26, 1000, 52, 8); cut("#2fd3a6");
    if (bx < 560) sticker("ball", bx, -26 - 62, 124, { rot: s * s * 9 });
    const cxx = -180 + Math.max(0, s - 0.3) * Math.max(0, s - 0.3) * 330; ctx.save(); ctx.translate(Math.min(cxx, 440), -26); rr(-60, -100, 120, 100, 8); cut("#ff8a1f"); ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillRect(-60, -64, 120, 18); ctx.restore();
    ctx.restore();
  }
  const p = pupChain([                                                                 // the engineer
    { t: EV.pillar - 0.3, d: 0.01, pose: { head: "happy", hL: [-120, -300], bL: 0.6, handL: "grip", frontL: true } },
    { t: EV.pillar + 1.6, d: 0.3, pose: { head: "confused", tilt: 0.07 } },
    { t: EV.bridge + 0.1, d: 0.3, pose: { head: "calm", tilt: 0, hR: [150, -330], bR: -0.3, handR: "point", frontR: true } },
    { t: EV.bridge + 0.85, d: 0.2, ease: back, pose: { head: "shock", hR: [128, -430], bR: -0.9, handR: "wave", frontR: false } },
    { t: EV.slope + 0.1, d: 0.3, pose: { head: "confused", hR: [156, -326], bR: -0.7, handR: "palm", tilt: 0.15, lean: 0.05 } },
  ], now);
  p.tilt += Math.sin(now * 2.1) * 0.012;
  footShadow(310, 990); drawPuppet(p, 310, 990, 0.82, now, WHO.engineer);
  sticker("blueprint", 310 + p.hL[0] * 0.82 - 10, 990 + p.hL[1] * 0.82 - 6, 170, { wear: true, rot: -0.5 });
}

// ---------------- shot 23: the tower built by guesswork ----------------
function a3Tower(now) {
  const u = now - EV.tower;
  ctx.fillStyle = "#5fd0ff"; ctx.fillRect(0, 0, W, 900);
  [[160, 140, 0.9], [1560, 220, 0.7]].forEach(([x, y, k]) => paperCloud(x + Math.sin(now * 0.3 + x) * 14, y, k));
  roughLoop([[-40, 900], [600, 880], [1300, 905], [1960, 880], [1960, H + 40], [-40, H + 40]], 180, 5); cut("#19b866", { dy: -3 });
  const sway = now > EV.really ? Math.sin((now - EV.really) * 9) * 0.035 * cl((now - EV.really) / 0.3) : 0, FH = 82, FW = 330;
  ctx.save(); ctx.translate(1130, 896); ctx.rotate(sway);
  A3.floors.forEach((f, i) => {
    const t0 = EV.tower + 0.1 + i * 0.38; if (now < t0 - 0.25) return;
    const d = drop(now - t0 + 0.25, -260, 0);
    ctx.rotate(f.r); ctx.save(); ctx.translate(f.dx, d.y - (d.air ? 0 : 0));
    rr(-FW / 2, -FH, FW, FH, 8); cut(f.c, { blur: 8, dy: 4 });
    for (let w = 0; w < 3; w++) {
      const x = -FW / 2 + 34 + w * 98; ctx.fillStyle = "#d9f4ff"; rr(x, -FH + 16, 66, 52, 8); ctx.fill();
      if (w === f.win && CAST.ready) { const im = CAST.img["head-" + f.who + "-" + (now > EV.really ? "shock" : "happy")], C = window.CAST_ART.head; ctx.save(); rr(x, -FH + 16, 66, 52, 8); ctx.clip(); const k = 0.19; ctx.drawImage(im, x + 33 - C[2] * k, -FH + 48 - C[3] * k + Math.sin(now * 5 + i) * 3, C[0] * k, C[1] * k); ctx.restore(); }
    }
    ctx.restore(); ctx.translate(f.dx, -FH);
  });
  ctx.restore();
  const b = pupChain([                                                                 // the builder is pleased with it
    { t: EV.tower - 0.3, d: 0.01, pose: { head: "happy", hR: [140, -430], bR: -0.4, handR: "point", frontR: true } },
    { t: EV.about, d: 0.25, ease: back, pose: { hR: [150, -300], bR: -0.6, handR: "fist", hL: [-150, -300], bL: 0.6, handL: "palm" } },
    { t: EV.really + 0.1, d: 0.2, pose: { head: "shock" } },
  ], now);
  footShadow(1640, 980); drawPuppet(b, 1640, 980, 0.66, now, WHO.builder);
  a3Viewer(now, 330, 1000, 0.8, [
    { t: EV.tower - 0.3, d: 0.01, pose: { head: "calm", tilt: -0.05 } },
    { t: EV.tower + 1.6, d: 0.4, pose: { head: "amazed", tilt: -0.12, lean: -0.04 } },
    { t: EV.thousand + 0.6, d: 0.4, pose: { head: "sad", hR: [70, -330], bR: -1, handR: "fist" } },
    { t: EV.really, d: 0.2, ease: back, pose: { head: "shock", hL: [-128, -418], bL: 0.9, handL: "wave", hR: [128, -418], bR: -0.9, handR: "wave" } },
  ]);
  bubble(now, "ประมาณนี้แหละ", 1590, 360, EV.about, 63.2, { size: 54, tx: 1640, ty: 500, color: INKC, fill: "#ffd21f" });
  keyword(now, "จริงเหรอ?", 420, 300, EV.really, 63.2, { fill: "#7a4cff", size: 80 });
}

function act3(now) {
  if (now < EV.bankcnt - 0.05) a3Money(now);
  else if (now < EV.salary - 0.05) a3Bank(now);
  else if (now < EV.stock - 0.05) a3Pay(now);
  else if (now < EV.timebreak - 0.05) a3Shop(now);
  else if (now < EV.nine - 0.05) a3Clock(now);
  else if (now < EV.noword - 0.05) a3Cards(now);
  else if (now < EV.city - 0.05) a3Field(now);
  else if (now < EV.metre - 0.05) a3City(now);
  else if (now < EV.pillar - 0.05) a3Tools(now);
  else if (now < EV.tower - 0.05) a3Site(now);
  else a3Tower(now);
  [["bankcnt", "#ffd21f"], ["salary", "#ff8a1f"], ["stock", "#2fd3a6"], ["timebreak", "#ff5a4d"], ["nine", "#7a4cff"], ["noword", "#ffd21f"], ["city", "#ff5a4d"], ["metre", "#2fd3a6"], ["pillar", "#3aa0ff"], ["tower", "#ffd21f"]].forEach(([k, c]) => wipe(now, EV[k] - 0.05, c));
}
