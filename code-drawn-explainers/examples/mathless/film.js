// The film: render(t) draws one frame. t counts from the start of the part being built;
// T.offset turns it into film time, the clock of the narration, which every act uses.
// One act per file; a longer film adds "else if (now < ...) act4(now);" lines and one
// wipe per act boundary.
const EV = window.EVENTS;

function render(t) {
  window.__lastT = t; ctx = mainCtx;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; ctx.setLineDash([]); ctx.lineCap = "butt"; ctx.shadowColor = "transparent"; ctx.filter = "none";
  const now = t + T.offset;
  act3(now);
  [[31.4, "#2fd3a6"], [63.04, "#7a4cff"]].forEach((q) => wipe(now, q[0], q[1]));      // the bands between acts
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.drawImage(PGRAIN, 0, 0);          // paper grain over the whole picture
  subtitle(now);
}
