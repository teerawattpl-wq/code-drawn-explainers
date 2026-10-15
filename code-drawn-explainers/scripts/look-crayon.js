// The crayon look: every surface is flat colour with pencil strokes over it; near things
// have a dark outline and far things have none; scenes are built from many layers. Tried on
// one shot only. See references/style-crayon-layers.md. Loaded after stage.js.

const CR_INK = "#2b2233";
// Pencil strokes that repeat: short light and dark marks leaning three different ways. With one
// direction and long marks (the first version) a field of grass looked as if it were raining.
const CR_PAT = (() => {
  const c = document.createElement("canvas"); c.width = c.height = 320; const g = c.getContext("2d"); g.lineCap = "round";
  for (let i = 0; i < 900; i++) {
    const x = hash(i * 1.1) * 320, y = hash(i * 2.3 + 5) * 320, a = [-1.05, -0.25, 0.7][i % 3] + (hash(i * 3.7) - 0.5) * 0.5, l = 6 + hash(i * 5.1) * 11;
    g.strokeStyle = i % 4 ? "rgba(255,255,255,0.13)" : "rgba(40,20,70,0.07)"; g.lineWidth = 1.6 + hash(i * 7.3) * 2.4;
    for (let dx = -320; dx <= 320; dx += 320) for (let dy = -320; dy <= 320; dy += 320) { g.beginPath(); g.moveTo(x + dx, y + dy); g.lineTo(x + dx + Math.cos(a) * l, y + dy + Math.sin(a) * l); g.stroke(); }
  }
  return c;
})();
let crPat = null;
// Fill the current path in crayon: colour, strokes over it, and an outline if o.ink is given.
// o.tex: strength of the strokes (default 1); o.shift, o.turn: move the strokes, so that
// two neighbouring surfaces do not share one pattern.
function crayon(fill, o) {
  o = o || {};
  crPat = crPat || ctx.createPattern(CR_PAT, "repeat");
  if (o.ink) { ctx.lineWidth = 2 * o.ink; ctx.strokeStyle = CR_INK; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke(); }   // outline first, its inner half covered by the fill
  ctx.fillStyle = fill; ctx.fill();
  ctx.save(); ctx.clip(); ctx.globalAlpha *= o.tex === undefined ? 1 : o.tex; ctx.translate(o.shift || 0, (o.shift || 0) * 0.6); ctx.rotate(o.turn || 0); ctx.fillStyle = crPat; ctx.fillRect(-4000, -4000, 9000, 9000); ctx.restore();
}
function crLeaf(x, y, len, w, rot, fill, ink) {                                          // a leaf with its veins
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-w, -len * 0.3, -w * 0.8, -len * 0.8, 0, -len); ctx.bezierCurveTo(w * 0.8, -len * 0.8, w, -len * 0.3, 0, 0); ctx.closePath(); crayon(fill, { ink });
  ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = ink * 0.6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(0, -len * 0.9);
  for (let i = 1; i < 5; i++) { const yy = -len * (0.15 + i * 0.16); ctx.moveTo(0, yy); ctx.lineTo(-w * 0.55, yy - len * 0.1); ctx.moveTo(0, yy); ctx.lineTo(w * 0.55, yy - len * 0.1); }
  ctx.stroke(); ctx.restore();
}
function crFlower(x, y, h, kind, now) {                                                  // a tall flower by the path
  const sway = Math.sin(now * 1.4 + x) * 0.04;
  ctx.save(); ctx.translate(x, y); ctx.rotate(sway);
  ctx.strokeStyle = CR_INK; ctx.lineWidth = 11; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -h); ctx.stroke(); ctx.strokeStyle = "#19b866"; ctx.lineWidth = 6; ctx.stroke();
  crLeaf(0, -h * 0.3, 70, 22, -1.1, "#35d07f", 4); crLeaf(0, -h * 0.45, 70, 22, 1.1, "#35d07f", 4);
  ctx.translate(0, -h);
  if (kind) { for (let i = 0; i < 8; i++) { ctx.save(); ctx.rotate((TAU * i) / 8); ctx.beginPath(); ctx.ellipse(0, -30, 13, 24, 0, 0, TAU); crayon("#ffffff", { ink: 4 }); ctx.restore(); } ctx.beginPath(); ctx.arc(0, 0, 17, 0, TAU); crayon("#ffd21f", { ink: 4 }); }
  else { ctx.beginPath(); ctx.moveTo(-30, -6); ctx.quadraticCurveTo(-36, -70, -14, -62); ctx.lineTo(0, -80); ctx.lineTo(14, -62); ctx.quadraticCurveTo(36, -70, 30, -6); ctx.quadraticCurveTo(0, 26, -30, -6); ctx.closePath(); crayon("#ff5c8a", { ink: 4 }); }
  ctx.restore();
}

// What stage.js calls: labels, bubbles and cut shapes get strokes and an outline.
function cut(fill, o) { o = o || {}; crayon(fill, { ink: o.flat ? 0 : o.ink || 5 }); }
