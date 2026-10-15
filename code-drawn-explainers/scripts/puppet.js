// The puppet: sticker head, body, hands and shoes, joined by arms and legs that the code draws.
//
// The stickers are pictures; the limbs are ink lines, so a hand can reach any point and the
// feet can walk. One white sticker border is drawn round the whole assembled figure, which is
// why the part pictures come without a border of their own.
//
// Needs, loaded first: kit.js (cl, lerp, io, back, TAU) and assets/puppet/parts.js
// (window.PUP_ART, written by tools/prep_parts.py together with the pictures).
// A film calls drawPuppet(pose, x, y, scale): (x, y) is the point on the ground between the feet.
//
// "Figure space" below: puppet pixels (the head is 300 across), origin on the ground between
// the feet, x to the right of the screen, y down (so everything above the ground is negative).
//
// A pose (see PUP_REST) says where the hips are, where each hand and each ankle is, which face
// and which hands to show. Hands: open, point, palm, fist, grip, wave, or none.
// Faces: calm, happy, confused, shock, think, sad, joy, amazed. With mouth: true the faces
// that have a talking picture (calm, happy, confused) show it. The calm face blinks by itself.

const PUP = { img: {}, ready: false };
const PUP_INK = "#1d1b1a";
const PG = {
  shoulder: [40, -199],        // from the hips, mirrored for the other side
  hipJoint: [40, -4],
  neck: [0, -204],
  headUp: 146,                 // neck to the centre of the head
  arm: 71, leg: 51,            // length of one half of a limb
  limbW: 12,
  border: 8,
};

(function () {
  const all = Promise.all(window.PUP_ART.names.map((n) => new Promise((done) => {
    const im = new Image(); im.onload = () => { PUP.img[n] = im; done(); }; im.onerror = done; im.src = "assets/puppet/" + n + ".png";
  }))).then(() => { PUP.ready = true; if (typeof render === "function") render(window.__lastT || 0); });
  window.__hf = window.__hf || {}; window.__hf.buildReady = window.__hf.buildReady || {};
  window.__hf.buildReady["puppet"] = all;                 // the renderer waits for the pictures
})();

// The supporting cast: other heads, bodies and things to wear, cut by tools/prep_cast.py
// (window.CAST_ART, assets/cast/). They share the main puppet's hands, shoes, limbs and poses.
// drawPuppet(..., who) with who = { head: "girl", body: "coral", hat: "party", neck: "stethoscope",
// shoe: 120 } draws one of them; shoe turns the colour of the boots (degrees round the colour wheel).
// Their heads have four faces, so the other face names fall back to the nearest of the four.
const CAST = { img: {}, ready: false, shoes: {} };
const CAST_FACE = { calm: "calm", blink: "calm", happy: "happy", joy: "happy", confused: "confused", think: "confused", sad: "confused", shock: "shock", amazed: "shock" };
// Where a hat sits: width in puppet pixels, then the middle of its lower edge from the centre of the face, and a tilt.
const CAST_HAT = { "hat-orange": [318, 0, -52, 0], "hat-yellow": [318, 0, -52, 0], chef: [262, 0, -92, 0], party: [150, 44, -118, 0.24], mirror: [322, 0, -28, 0] };
(function () {
  if (!window.CAST_ART) return;
  const all = Promise.all(window.CAST_ART.names.map((n) => new Promise((done) => {
    const im = new Image(); im.onload = () => { CAST.img[n] = im; done(); }; im.onerror = done; im.src = "assets/cast/" + n + ".png";
  }))).then(() => { CAST.ready = true; if (typeof render === "function") render(window.__lastT || 0); });
  window.__hf = window.__hf || {}; window.__hf.buildReady = window.__hf.buildReady || {};
  window.__hf.buildReady["cast"] = all;
})();
function castShoe(kind, hue) {                            // the boot picture in another colour, made once
  const key = kind + hue; if (CAST.shoes[key]) return CAST.shoes[key];
  const im = PUP.img["shoe-" + kind], c = document.createElement("canvas"); c.width = im.width; c.height = im.height;
  const g = c.getContext("2d"); g.filter = "hue-rotate(" + hue + "deg)"; g.drawImage(im, 0, 0);
  return (CAST.shoes[key] = c);
}

// The standing pose. Every other pose is this one with some fields changed.
const PUP_REST = {
  hip: [0, -161], lean: 0, tilt: 0, sx: 1, sy: 1,
  head: "calm", mouth: false,
  hL: [-108, -240], hR: [108, -240], bL: 0.5, bR: -0.5, handL: "open", handR: "open", frontL: false, frontR: false,
  fL: [-40, -66], fR: [40, -66], kL: -0.2, kR: 0.2, shoes: "out",    // shoes: out (toes apart), left, right, front
};

const pupNum = (a, b, m) => (Array.isArray(a) ? a.map((v, i) => lerp(v, b[i], m)) : lerp(a, b, m));
function pupMix(a, b, m) {
  const o = {};
  Object.keys(a).forEach((k) => {
    const v = b[k] === undefined ? a[k] : b[k];
    o[k] = typeof a[k] === "number" || Array.isArray(a[k]) ? pupNum(a[k], v, m) : (m > 0.3 ? v : a[k]);
  });
  return o;
}
// keys = [{ t, d, pose, ease }]: at time t start moving to PUP_REST + all poses so far + pose,
// arriving d seconds later. In time order. ease: io (default) or back for a snap.
function pupChain(keys, now) {
  let from = PUP_REST, target = PUP_REST;
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    if (now < k.t) return from;
    target = Object.assign({}, target, k.pose);
    const end = i + 1 < keys.length && now >= keys[i + 1].t ? keys[i + 1].t : now;
    from = pupMix(from, target, (k.ease || io)(cl((end - k.t) / k.d)));
  }
  return from;
}

// Where the middle joint of a two-part limb goes. bend: which side it bends to, and how much (-1..1).
function pupJoint(ax, ay, bx, by, half, bend) {
  let dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy);
  const max = 2 * half - 0.5;
  if (d > max) { bx = ax + (dx * max) / d; by = ay + (dy * max) / d; dx = bx - ax; dy = by - ay; d = max; }
  if (d < 1) d = 1;
  const h = Math.sqrt(Math.max(0, half * half - (d * d) / 4)) * bend;
  return { ex: (ax + bx) / 2 - (h * dy) / d, ey: (ay + by) / 2 + (h * dx) / d, bx, by };
}
function pupLimb(g, ax, ay, j) {                          // one smooth ink curve through the joint
  g.beginPath(); g.moveTo(ax, ay);
  g.quadraticCurveTo(2 * j.ex - (ax + j.bx) / 2, 2 * j.ey - (ay + j.by) / 2, j.bx, j.by);
  g.lineWidth = PG.limbW; g.strokeStyle = PUP_INK; g.lineCap = "round"; g.stroke();
}

const PUP_BOX = [900, 1000, 450, 900];                    // work canvas and where the ground point is in it
const pupLayer = () => { const c = document.createElement("canvas"); c.width = PUP_BOX[0]; c.height = PUP_BOX[1]; return c; };
const pupArt = pupLayer(), pupEdge = pupLayer();

function pupFace(p, t) {
  if (p.mouth && PUP.img["head-" + p.head + "-open"]) return "head-" + p.head + "-open";
  if (p.head === "calm" && t !== undefined && (t + 0.9) % 3.4 > 3.26) return "head-blink";
  return "head-" + p.head;
}

function pupPaint(g, p, t, who) {
  const I = PUP.img, A = window.PUP_ART, rot = (x, y, a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
  const hip = p.hip, at = (v) => { const r = rot(v[0] * p.sx, v[1] * p.sy, p.lean); return [hip[0] + r[0], hip[1] + r[1]]; };
  const sL = at([-PG.shoulder[0], PG.shoulder[1]]), sR = at(PG.shoulder), lL = at([-PG.hipJoint[0], PG.hipJoint[1]]), lR = at(PG.hipJoint), neck = at(PG.neck);
  const aL = pupJoint(sL[0], sL[1], p.hL[0], p.hL[1], PG.arm, p.bL), aR = pupJoint(sR[0], sR[1], p.hR[0], p.hR[1], PG.arm, p.bR);
  const gL = pupJoint(lL[0], lL[1], p.fL[0], p.fL[1], PG.leg, p.kL), gR = pupJoint(lR[0], lR[1], p.fR[0], p.fR[1], PG.leg, p.kR);
  const shoe = (j, side) => {
    const kind = p.shoes === "out" ? (side < 0 ? "left" : "right") : p.shoes, s = A.shoes[kind];
    g.drawImage(who && who.shoe ? castShoe(kind, who.shoe) : I["shoe-" + kind], j.bx - s[2], j.by - s[3]);
  };
  // A hand picture is drawn for the arm on the right of the screen and mirrored for the other one.
  const hand = (j, kind, side) => {
    if (kind === "none") return;
    const h = A.hands[kind]; let a = Math.atan2(j.by - j.ey, j.bx - j.ex);
    g.save(); g.translate(j.bx, j.by);
    if (side < 0) { g.scale(-1, 1); a = Math.PI - a; }
    g.rotate(a - h[4]); g.drawImage(I["hand-" + kind], -h[2], -h[3]); g.restore();
  };
  pupLimb(g, lL[0], lL[1], gL); pupLimb(g, lR[0], lR[1], gR); shoe(gL, -1); shoe(gR, 1);
  if (!p.frontL) pupLimb(g, sL[0], sL[1], aL);
  if (!p.frontR) pupLimb(g, sR[0], sR[1], aR);
  const body = who && who.body ? CAST.img["body-" + who.body] : I.body;
  g.save(); g.translate(hip[0], hip[1]); g.rotate(p.lean); g.scale(p.sx, p.sy); g.drawImage(body, -body.width / 2, -body.height);
  if (who && who.neck) { const im = CAST.img["wear-" + who.neck], w = 124, h = (im.height * w) / im.width; g.drawImage(im, -w / 2 + 6, -body.height - 6, w, h); }
  g.restore();
  g.save(); g.translate(neck[0], neck[1]); g.rotate(p.lean + p.tilt);
  if (who && who.head) {
    const C = window.CAST_ART.head; g.drawImage(CAST.img["head-" + who.head + "-" + (CAST_FACE[p.head] || "calm")], -C[2], -PG.headUp - C[3]);
  } else g.drawImage(I[pupFace(p, t)] || I["head-calm"], -A.head[2], -PG.headUp - A.head[3]);
  if (who && who.hat) {
    const q = CAST_HAT[who.hat], im = CAST.img["wear-" + who.hat], h = (im.height * q[0]) / im.width;
    g.translate(q[1], -PG.headUp + q[2]); g.rotate(q[3]); g.drawImage(im, -q[0] / 2, -h, q[0], h);
  }
  g.restore();
  if (p.frontL) pupLimb(g, sL[0], sL[1], aL);
  if (p.frontR) pupLimb(g, sR[0], sR[1], aR);
  hand(aL, p.handL, -1); hand(aR, p.handR, 1);
}

// Draw the figure with its feet at (x, y) on the current ctx. t (optional) lets the calm face blink.
// who (optional) picks one of the supporting cast instead of the main puppet.
function drawPuppet(p, x, y, scale, t, who) {
  if (!PUP.ready || (who && !CAST.ready)) return;
  const g = pupArt.getContext("2d"), e = pupEdge.getContext("2d"), ox = PUP_BOX[2], oy = PUP_BOX[3];
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, PUP_BOX[0], PUP_BOX[1]); g.translate(ox, oy);
  pupPaint(g, p, t, who);
  e.globalCompositeOperation = "source-over"; e.clearRect(0, 0, PUP_BOX[0], PUP_BOX[1]); e.drawImage(pupArt, 0, 0);
  e.globalCompositeOperation = "source-in"; e.fillStyle = "#fffdf6"; e.fillRect(0, 0, PUP_BOX[0], PUP_BOX[1]);
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ctx.save(); ctx.shadowColor = "rgba(30,20,40,0.30)"; ctx.shadowBlur = 16; ctx.shadowOffsetY = 7; ctx.drawImage(pupEdge, -ox, -oy); ctx.restore();
  for (let i = 0; i < 20; i++) { const a = (TAU * i) / 20; ctx.drawImage(pupEdge, -ox + PG.border * Math.cos(a), -oy + PG.border * Math.sin(a)); }
  ctx.drawImage(pupArt, -ox, -oy);
  ctx.restore();
}

// The feet of a walk to the right. phase counts steps (one unit = both feet once); stride in puppet pixels.
function pupWalk(phase, stride) {
  const foot = (ph0) => {
    const q = ((phase + ph0) % 1 + 1) % 1;
    return q < 0.5 ? [stride / 2 - stride * (q / 0.5), 0] : [-stride / 2 + stride * ((q - 0.5) / 0.5), -Math.sin(Math.PI * ((q - 0.5) / 0.5)) * 24];
  };
  const a = foot(0), b = foot(0.5), bob = -Math.abs(Math.sin(TAU * phase)) * 6, sw = Math.sin(TAU * phase) * 38;
  return { fL: [-24 + a[0], -66 + a[1]], fR: [24 + b[0], -66 + b[1]], hip: [0, -161 + bob],
           hL: [-84 - sw, -246 - Math.abs(sw) * 0.3], hR: [84 + sw, -246 - Math.abs(sw) * 0.3], kL: 0.3, kR: 0.3, shoes: "right" };
}
