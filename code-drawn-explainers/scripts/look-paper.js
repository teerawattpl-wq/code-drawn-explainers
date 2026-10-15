// The cut-paper look: no outlines, a soft shadow under every piece, paper grain over the
// whole picture (draw PGRAIN last in render, before the subtitle). See
// references/style-cut-paper.md. Loaded after stage.js.

// Fill the current path as a piece of paper lying on what is below it.
function cut(fill, o) {
  o = o || {};
  ctx.save(); ctx.shadowColor = o.flat ? "transparent" : PSH; ctx.shadowBlur = o.blur || 12; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = o.dy === undefined ? 6 : o.dy;
  ctx.fillStyle = fill; ctx.fill(o.rule || "nonzero"); ctx.restore();
}
