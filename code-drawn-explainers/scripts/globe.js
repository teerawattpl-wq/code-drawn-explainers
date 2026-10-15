// The Earth as a globe, with real coastlines. Optional: a story that needs it lists
// "kit/data/land-110m.js" and "kit/globe.js" in the "scripts" of its story.json, before its
// own files. The outlines are Natural Earth data (public domain) in data/land-110m.js.
//
//   drawGlobe(R, { lon, lat }, { now, clouds, graticule, halo })
//       draws a globe of radius R around the current origin, looking straight at the point
//       (lon, lat) in degrees. Turn the Earth by changing lon with time.
//   globePoint(lon, lat, { lon, lat }, R)  ->  [x, y, z]
//       where a place on the Earth lands on that globe; z > 0 means it faces the viewer.
//       Use it to pin a marker, a city or a label to the map.

const GLOBE = { sea: ["#74d8ff", "#2e9bd6", "#1b5fa8"], land: "#4fc06c", coast: "rgba(20,70,45,0.6)", ice: "#ffffff", sand: "#f2cf6b" };
// Dry regions, as [longitude, latitude, width in degrees, height in degrees]: painted over the land only.
const GLOBE_SAND = [[10, 23, 46, 16], [46, 23, 18, 16], [134, -25, 26, 14], [100, 42, 28, 9], [-112, 30, 12, 9], [19, -24, 9, 9], [-69, -24, 4, 10]];
const GLOBE_CLOUDS = (function () { const r = mulberry32(4242), list = []; for (let i = 0; i < 22; i++) list.push([r() * 360 - 180, r() * 120 - 60, 0.06 + r() * 0.09]); return list; })();

function globePoint(lon, lat, view, R) {
  const d = ((lon - view.lon) * Math.PI) / 180, f = (lat * Math.PI) / 180, f0 = ((view.lat || 0) * Math.PI) / 180;
  const x = Math.cos(f) * Math.sin(d);
  const y = Math.cos(f0) * Math.sin(f) - Math.sin(f0) * Math.cos(f) * Math.cos(d);
  const z = Math.sin(f0) * Math.sin(f) + Math.cos(f0) * Math.cos(f) * Math.cos(d);
  return [x * R, -y * R, z];
}
// One outline as a path. Points on the far side slide to the rim, and a run of them follows
// the rim, so land that wraps round the back never cuts a chord across the face.
function globeRing(ring, view, R, path) {
  let seen = false, prevBack = false, prevA = 0;
  ring.forEach((q, i) => {
    const p = globePoint(q[0], q[1], view, R);
    if (p[2] >= 0) { seen = true; path[i ? "lineTo" : "moveTo"](p[0], p[1]); prevBack = false; return; }
    const a = Math.atan2(p[1], p[0]);
    if (!i) path.moveTo(R * Math.cos(a), R * Math.sin(a));
    else if (prevBack) { let da = a - prevA; while (da > Math.PI) da -= TAU; while (da < -Math.PI) da += TAU; path.arc(0, 0, R, prevA, a, da < 0); }
    else path.lineTo(R * Math.cos(a), R * Math.sin(a));
    prevBack = true; prevA = a;
  });
  path.closePath();
  return seen;
}
function drawGlobe(R, view, o) {
  if (R < 3) return;
  o = o || {};
  const a0 = ctx.globalAlpha, now = o.now || 0;
  if (o.halo !== false) {
    const halo = ctx.createRadialGradient(0, 0, R * 0.96, 0, 0, R * 1.24); halo.addColorStop(0, "rgba(80,190,255,0.6)"); halo.addColorStop(1, "rgba(80,190,255,0)");
    ctx.beginPath(); ctx.arc(0, 0, R * 1.24, 0, TAU); ctx.fillStyle = halo; ctx.fill();
  }
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.clip();
  const sea = ctx.createRadialGradient(-R * 0.35, -R * 0.4, R * 0.1, 0, 0, R * 1.05); sea.addColorStop(0, GLOBE.sea[0]); sea.addColorStop(0.6, GLOBE.sea[1]); sea.addColorStop(1, GLOBE.sea[2]);
  ctx.fillStyle = sea; ctx.fillRect(-R, -R, 2 * R, 2 * R);
  const land = new Path2D(), ice = new Path2D();
  window.LAND110.forEach((ring) => {
    const mean = ring.reduce((s, q) => s + q[1], 0) / ring.length, one = new Path2D();
    if (!globeRing(ring, view, R, one)) return;
    (mean > 66 || mean < -60 ? ice : land).addPath(one);
  });
  ctx.fillStyle = GLOBE.land; ctx.fill(land);
  ctx.save(); ctx.clip(land);                    // deserts, only where there is land
  GLOBE_SAND.forEach((s) => {
    const p = globePoint(s[0], s[1], view, R); if (p[2] < 0.05) return;
    const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], (s[2] / 90) * R * 0.9); g.addColorStop(0, GLOBE.sand); g.addColorStop(0.6, GLOBE.sand); g.addColorStop(1, "rgba(242,207,107,0)");
    ctx.save(); ctx.translate(p[0], p[1]); ctx.scale(1, s[3] / s[2] + 0.25); ctx.translate(-p[0], -p[1]); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p[0], p[1], (s[2] / 90) * R * 0.9, 0, TAU); ctx.fill(); ctx.restore();
  });
  ctx.restore();
  ctx.fillStyle = GLOBE.ice; ctx.fill(ice);
  ctx.lineWidth = Math.max(1, R / 150); ctx.lineJoin = "round"; ctx.strokeStyle = GLOBE.coast; ctx.stroke(land); ctx.stroke(ice);
  if (o.graticule !== false) {                   // lines of longitude and latitude, every 30 degrees
    ctx.strokeStyle = "rgba(255,255,255,0.34)"; ctx.lineWidth = Math.max(1, R / 190);
    for (let lon = -180; lon < 180; lon += 30) { ctx.beginPath(); let pen = false; for (let lat = -90; lat <= 90; lat += 5) { const p = globePoint(lon, lat, view, R); if (p[2] > 0) { ctx[pen ? "lineTo" : "moveTo"](p[0], p[1]); pen = true; } else pen = false; } ctx.stroke(); }
    for (let lat = -60; lat <= 60; lat += 30) { ctx.beginPath(); let pen = false; for (let lon = -180; lon <= 180; lon += 5) { const p = globePoint(lon, lat, view, R); if (p[2] > 0) { ctx[pen ? "lineTo" : "moveTo"](p[0], p[1]); pen = true; } else pen = false; } ctx.stroke(); }
  }
  if (o.clouds !== false) GLOBE_CLOUDS.forEach((c) => {
    const p = globePoint(c[0] + now * 2.6, c[1], view, R); if (p[2] < 0.2) return;
    ctx.globalAlpha = a0 * 0.8 * cl(p[2] * 2); ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.ellipse(p[0], p[1], c[2] * R * 1.8, c[2] * R * 0.7, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(p[0] + c[2] * R, p[1] - c[2] * R * 0.4, c[2] * R, c[2] * R * 0.6, 0, 0, TAU); ctx.fill();
  });
  ctx.globalAlpha = a0;
  const shade = ctx.createRadialGradient(-R * 0.4, -R * 0.45, R * 0.2, 0, 0, R * 1.1); shade.addColorStop(0, "rgba(255,255,255,0.28)"); shade.addColorStop(0.55, "rgba(255,255,255,0)"); shade.addColorStop(1, "rgba(10,20,70,0.5)");
  ctx.fillStyle = shade; ctx.fillRect(-R, -R, 2 * R, 2 * R);
  ctx.restore();
  ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.lineWidth = Math.max(2, R / 70); ctx.strokeStyle = rgb(INK); ctx.stroke();
}
