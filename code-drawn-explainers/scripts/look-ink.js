// The flat-ink look: flat colour with one dark outline of the same width on everything, no
// shadows, no grain. See references/style-flat-ink.md. Loaded after stage.js.

// Fill the current path and outline it. o.ink: outline width (default 6); o.flat: no outline.
// The outline is drawn first, twice as wide, and the fill covers its inner half: a shape made
// of several overlapping circles (a cloud, a treetop) then has one outline round the whole.
function cut(fill, o) {
  o = o || {};
  if (!o.flat) { ctx.lineWidth = 2 * (o.ink || 6); ctx.strokeStyle = INKC; ctx.lineJoin = "round"; ctx.stroke(); }
  ctx.fillStyle = fill; ctx.fill(o.rule || "nonzero");
}
