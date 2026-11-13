(() => {
"use strict";
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const h = (tag, attrs, ...kids) => {
  const e = document.createElement(tag);
  for (const k in attrs || {}) { const v = attrs[k]; if (v == null || v === false) continue;
    if (k === "html") e.innerHTML = v; else if (k === "text") e.textContent = v; else if (k.startsWith("on")) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? "" : v); }
  for (const c of kids.flat(3)) if (c != null && c !== false) e.append(c);
  return e;
};
const ARR = d => `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1"><path d="${d < 0 ? "M10 3 5 8l5 5M5 8h9" : "M6 3l5 5-5 5M11 8H2"}"/></svg>`;
const pad = n => String(n).padStart(2, "0");
const enc = f => encodeURIComponent(f).replace(/'/g, "%27");
const FINE = matchMedia("(hover:hover) and (pointer:fine)").matches, STILL = matchMedia("(prefers-reduced-motion: reduce)").matches;
/* Outside players load on an ordinary web host. Inside Claude's preview they are blocked, so videos open in a new tab there. */
const EMBED = /^https?:$/.test(location.protocol) && !/claude|anthropic/i.test(location.hostname);
const cImg = (f, w) => `https://commons.wikimedia.org/wiki/Special:FilePath/${enc(f)}?width=${w}`;
const cPage = f => `https://commons.wikimedia.org/wiki/File:${enc(f.replace(/ /g, "_"))}`;
const cPoster = (f, w) => `https://commons.wikimedia.org/w/thumb.php?f=${enc(f)}&w=${w}`;
const cVid = (f, hash, key) => { const e = enc(f.replace(/ /g, "_")); return `https://upload.wikimedia.org/wikipedia/commons/transcoded/${hash}/${e}/${e}.${key}`; };
const wiki = q => "https://en.wikipedia.org/w/index.php?search=" + encodeURIComponent(q);
const ytFind = q => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
const ext = (label, href) => h("a", { class: "btn ghost", href, target: "_blank", rel: "noopener", "data-cur": "Open", text: label + " ↗" });
const TIER = window.TIERS, ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const animate = (set, ms) => new Promise(done => { const t0 = performance.now(); const f = now => { const t = Math.min(1, (now - t0) / ms); set(ease(t)); t < 1 ? requestAnimationFrame(f) : done(); }; requestAnimationFrame(f); });

/* ───────── media frames ───────── */
function tile(frame, text, color) { frame.querySelectorAll("img,video,iframe,.face,.cap,.src").forEach(n => n.remove()); if (!frame.querySelector(".tile")) frame.prepend(h("div", { class: "tile", style: color ? `--c:${color}` : null }, h("b", { text }))); }
function show(frame, item, tileText, color) {
  frame.querySelectorAll("img,video,iframe,.face,.cap,.src,.tile").forEach(n => n.remove());
  if (!item) return tile(frame, tileText, color);
  const [kind, a, b, c] = item;
  if (kind === "i") {
    const doc = /memo|Record|Times|Call|Assessment|Tehran|Twining|Blue Book|fatima|Nürnberg|Utsuro|graph|GEIPAN|map/i.test(a);
    frame.append(h("img", { src: cImg(a, 1100), alt: b, loading: "lazy", draggable: "false", class: doc ? "doc" : null, onerror: () => tile(frame, tileText, color) }), b ? h("div", { class: "cap", text: b }) : null,
      h("a", { class: "src", href: cPage(a), target: "_blank", rel: "noopener", text: "Commons · " + c }));
  } else if (kind === "a") {
    frame.append(h("img", { src: window.ART_BASE + a, alt: b, loading: "lazy", draggable: "false", onerror: () => tile(frame, tileText, color) }), b ? h("div", { class: "cap", text: b }) : null, h("span", { class: "src", text: "AI illustration" }));
  } else if (kind === "v") {
    const v = h("video", { controls: true, preload: "none", playsinline: true, poster: cPoster(a, 1100), "aria-label": c });
    ["480p.vp9.webm", "360p.mpeg4.mov", "240p.vp9.webm"].forEach(k => v.append(h("source", { src: cVid(a, b, k), type: k.endsWith("mov") ? "video/quicktime" : "video/webm" })));
    frame.append(v, h("a", { class: "src", href: cPage(a), target: "_blank", rel: "noopener", text: "US government · public domain" }));
  } else if (kind === "y") {
    const face = h("a", { class: "face", href: "https://www.youtube.com/watch?v=" + a, target: "_blank", rel: "noopener", "data-cur": "Play", "aria-label": "Play: " + b },
      h("img", { src: `https://i.ytimg.com/vi/${a}/hqdefault.jpg`, alt: "", loading: "lazy", draggable: "false", onerror: e => { e.target.remove(); face.prepend(h("div", { class: "tile", style: color ? `--c:${color}` : null }, h("b", { text: tileText }))); } }),
      h("span", { class: "play" }), h("span", { class: "cap", text: b }));
    if (EMBED) face.addEventListener("click", ev => { ev.preventDefault(); frame.querySelectorAll(".face,.src").forEach(n => n.remove());
      frame.append(h("iframe", { src: `https://www.youtube-nocookie.com/embed/${a}?autoplay=1&rel=0`, title: b, allow: "autoplay; encrypted-media; picture-in-picture; fullscreen", allowfullscreen: true, referrerpolicy: "strict-origin-when-cross-origin" })); });
    frame.append(face, h("span", { class: "src", text: "YouTube" }));
  }
}
function mediaFrame(items, tileText, color) {
  const frame = h("div", { class: "media" }); items = (items || []).filter(Boolean);
  if (items.length > 1) { const tabs = h("div", { class: "tabs" });
    items.forEach((it, i) => tabs.append(h("button", { type: "button", "aria-pressed": i === 0 ? "true" : "false", "aria-label": (it[0] === "i" || it[0] === "a" ? "Image: " : "Video: ") + (it[0] === "v" ? it[3] : it[2]), text: it[0] === "i" ? "Photo" : it[0] === "a" ? "Render" : "Video", onclick: ev => { $$("button", tabs).forEach(x => x.setAttribute("aria-pressed", "false")); ev.currentTarget.setAttribute("aria-pressed", "true"); show(frame, it, tileText, color); } })));
    frame.append(tabs); }
  show(frame, items[0], tileText, color);
  return frame;
}

/* ───────── dossier ───────── */
const dos = $("#dos"), dosGrid = $("#dos-grid");
function openDos({ left, meta, title, blocks, links }) {
  dosGrid.replaceChildren(h("div", { class: "left" }, left), h("div", {}, h("div", { class: "meta" }, meta), h("h2", { text: title }),
    blocks.filter(b => b[1]).map(([k, v, warn], i) => h("div", { class: "blk" + (warn ? " warn" : ""), style: `--i:${i}` }, h("b", { text: k }), h("p", { text: v }))), links && links.length ? h("div", { class: "links" }, links) : null));
  dos.showModal(); dosGrid.scrollTop = 0;
}
$("#dos-x").onclick = () => dos.close();
dos.addEventListener("close", () => dosGrid.replaceChildren());
dos.addEventListener("click", e => { if (e.target === dos) dos.close(); });

/* ───────── deck: draggable, tilting reel ───────── */
const decks = new Set();
function deck(panels, cls) {
  const track = h("div", { class: "track" }, panels), cur = h("b", { text: "01" }), fill = h("i");
  const go = d => track.scrollBy({ left: d * Math.min(track.clientWidth * .7, 600), behavior: "smooth" });
  const el = h("div", { class: "deck " + (cls || "") }, track, h("div", { class: "deck-ui" },
    h("button", { class: "arrow", type: "button", "aria-label": "Previous", "data-cur": "Back", html: ARR(-1), onclick: () => go(-1) }), h("button", { class: "arrow", type: "button", "aria-label": "Next", "data-cur": "Next", html: ARR(1), onclick: () => go(1) }),
    h("span", { class: "n" }, cur, " / " + pad(panels.length)), h("div", { class: "ln" }, fill)));
  const upd = () => { const tr = track.getBoundingClientRect(), c = tr.left + tr.width / 2; let best = 0, bd = 1e9;
    panels.forEach((p, i) => { const r = p.getBoundingClientRect(); if (r.right < -200 || r.left > innerWidth + 200) return; const d = (r.left + r.width / 2 - c) / tr.width, a = Math.max(-1, Math.min(1, d));
      if (!STILL) p.style.transform = `rotateY(${-a * 26}deg) translateZ(${-Math.abs(a) * 120}px)`; if (Math.abs(d) < bd) { bd = Math.abs(d); best = i; } });
    cur.textContent = pad(best + 1); fill.style.transform = `scaleX(${track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth)})`; };
  let tick = 0; track.addEventListener("scroll", () => { if (!tick) tick = requestAnimationFrame(() => { tick = 0; upd(); }); }, { passive: true });
  let down = null, moved = 0;
  track.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse" || e.target.closest("video,iframe,button,a.src")) return; down = { x: e.clientX, s: track.scrollLeft }; moved = 0; });
  addEventListener("pointermove", e => { if (!down) return; const dx = e.clientX - down.x; moved = Math.max(moved, Math.abs(dx)); if (moved > 5) { track.classList.add("drag"); track.scrollLeft = down.s - dx; } });
  addEventListener("pointerup", () => { if (down) { down = null; setTimeout(() => track.classList.remove("drag"), 0); } });
  track.addEventListener("click", e => { if (moved > 5) { e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
  el._upd = upd; decks.add(el); requestAnimationFrame(upd);
  return el;
}
addEventListener("resize", () => decks.forEach(d => d.isConnected ? d._upd() : decks.delete(d)));

/* ───────── nav, rail, menu, hud ───────── */
const SECTIONS = [["top", "Arrival"], ["footage", "Footage"], ["start", "Known"], ["record", "Record"], ["sites", "Sites"], ["beings", "Beings"], ["craft", "Craft"], ["origins", "Origins"], ["math", "The math"], ["programs", "Programs"], ["retrievals", "Retrievals"], ["voices", "Voices"], ["thesis", "Thesis"], ["deeper", "Go deeper"]];
[["footage", "Footage"], ["record", "Record"], ["programs", "Programs"], ["thesis", "Thesis"]].forEach(([id, t]) => $("#nav").append(h("a", { href: "#" + id, text: t })));
SECTIONS.slice(1).forEach(([id, t], i) => { $("#rail").append(h("a", { href: "#" + id, "data-s": id, text: t })); $("#full").append(h("a", { href: "#" + id, style: `--i:${i}`, onclick: () => menu(false) }, h("i", { text: pad(i + 1) }), t)); });
const menu = on => { $("#full").classList.toggle("open", on); document.body.classList.toggle("lock", on); };
$("#menu").onclick = () => menu(true); $("#full-x").onclick = () => menu(false);
addEventListener("keydown", e => { if (e.key === "Escape") menu(false); });
const secIO = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const id = e.target.id, i = SECTIONS.findIndex(s => s[0] === id);
  $$("#rail a").forEach(a => a.classList.toggle("on", a.dataset.s === id)); $$("#nav a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + id));
  $("#hud-sec").textContent = pad(i) + " · " + SECTIONS[i][1]; }), { rootMargin: "-45% 0px -50% 0px" });
SECTIONS.forEach(([id]) => secIO.observe(document.getElementById(id)));

/* ───────── reveal + backgrounds + parallax ───────── */
const rvIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); rvIO.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
const reveal = root => $$(".kick,.mega,.lede,.sub,.stat,.duo>div,.rows>details,.th,.vg,.glass,.lineup,.closing,.country,.obs>div,.lib>div", root).forEach((el, i) => { if (el.classList.contains("rv")) return; el.classList.add("rv"); const sib = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0; el.style.setProperty("--i", Math.min(sib, 8)); rvIO.observe(el); });
const bgIO = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const el = e.target, b = window.BG[el.dataset.bg]; bgIO.unobserve(el); if (!b) return;
  const src = cImg(b[0], 1920), im = new Image(); im.onload = () => { el.style.backgroundImage = `url("${src}")`; el.classList.add("vis"); }; im.src = src; }), { rootMargin: "60% 0px" });
const armBg = root => $$(".bg[data-bg]", root).forEach(el => bgIO.observe(el));
let pars = [];
const collectPar = () => { pars = $$(".scene .bg").map(el => [el, el.parentElement, .16]).concat($$(".scene .mega").map(el => [el, el, -.05])); };
function parallax() { const H = innerHeight; for (const [el, ref, k] of pars) { const r = ref.getBoundingClientRect(); if (r.bottom < -200 || r.top > H + 200) continue; const off = r.top + r.height / 2 - H / 2;
  el.style.transform = k > 0 ? `translate3d(0,${(-off * k).toFixed(1)}px,0) scale(1.04)` : `translate3d(${(off * k).toFixed(1)}px,0,0)`; } }

/* ───────── scroll loop: progress, hud, warp starfield ───────── */
const warp = $("#warp"), wx = warp.getContext("2d"); let stars = [], lastY = scrollY, vel = 0;
const sizeWarp = () => { warp.width = innerWidth; warp.height = innerHeight; stars = Array.from({ length: Math.round(innerWidth * innerHeight / 7000) }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, z: .2 + Math.random() * .8 })); };
sizeWarp(); addEventListener("resize", sizeWarp);
function frame() {
  const y = scrollY, d = document.documentElement, dv = y - lastY; lastY = y; vel += (dv - vel) * .2;
  $("#bar").style.width = (100 * y / Math.max(1, d.scrollHeight - d.clientHeight)) + "%";
  $("#hud-depth").textContent = String(Math.round(100 * y / Math.max(1, d.scrollHeight - d.clientHeight))).padStart(3, "0") + "%";
  if (!STILL) { if (dv) parallax();
    wx.clearRect(0, 0, warp.width, warp.height); wx.lineCap = "round";
    for (const s of stars) { s.y -= vel * s.z * .35 + s.z * .06; if (s.y < -40) s.y += warp.height + 80; if (s.y > warp.height + 40) s.y -= warp.height + 80;
      const len = Math.min(140, Math.abs(vel) * s.z * 1.6); wx.strokeStyle = `rgba(${215 - len * .4},${228 - len * .2},240,${.15 + s.z * .5})`; wx.lineWidth = s.z * 1.1;
      wx.beginPath(); wx.moveTo(s.x, s.y); wx.lineTo(s.x, s.y + (vel > 0 ? len : -len) + .1); wx.stroke(); } }
  requestAnimationFrame(frame);
}

/* ───────── hero: facts, portal canvas, travel ───────── */
const countries = new Set(window.PROGRAMS.map(p => p.c)).size;
[["Record:", `${window.TIMELINE.length} events, from Sumer to this month.`], ["Footage:", "Ten clips. Seven come from government archives."], ["Programs:", `${window.PROGRAMS.length} known or alleged, across ${countries} countries.`], ["Verdict:", "Open. No craft has been shown in public."]]
  .forEach(([k, v], i) => $("#facts").append(h("div", { class: "fact", style: `--i:${i}` }, h("dt", { text: k }), h("dd", { text: v }))));
const hero = $("#top"), pc = $("#portal-canvas"), px = pc.getContext("2d"), pv = $("#portal-video"), portalBtn = $("#portal");
const earth = new Image(); earth.src = cImg(window.BG.earth[0], 1400);
let rotX = 0, rotY = 0, tX = 0, tY = 0, expansion = 0, maskScale = 0, busy = false, heroOn = true, pT = performance.now();
const sizePortal = () => { const d = Math.min(devicePixelRatio || 1, 2); pc.width = hero.clientWidth * d; pc.height = hero.clientHeight * d; px.setTransform(d, 0, 0, d, 0, 0); };
sizePortal(); addEventListener("resize", sizePortal);
addEventListener("pointermove", e => { if (busy || !heroOn || e.pointerType === "touch") return; tY = (e.clientX / innerWidth - .5) * 37.4; tX = (e.clientY / innerHeight - .5) * -33; });
document.addEventListener("pointerleave", () => { tX = tY = 0; });
function drawCover() {
  const W = hero.clientWidth, H = hero.clientHeight, vid = pv.readyState >= 2, img = earth.complete && earth.naturalWidth;
  if (vid || img) { const m = vid ? pv : earth, mw = vid ? pv.videoWidth : earth.naturalWidth, mh = vid ? pv.videoHeight : earth.naturalHeight, s = Math.max(W / mw, H / mh) * (vid ? 1 : .62); px.fillStyle = "#020203"; px.fillRect(0, 0, W, H); px.drawImage(m, (W - mw * s) / 2, (H - mh * s) / 2, mw * s, mh * s); }
  else { const g = px.createRadialGradient(W / 2, H * .62, 10, W / 2, H * .62, H * .5); g.addColorStop(0, "#9fd8ff"); g.addColorStop(.5, "#1f5fae"); g.addColorStop(1, "#020308"); px.fillStyle = "#020203"; px.fillRect(0, 0, W, H); px.fillStyle = g; px.beginPath(); px.arc(W / 2, H * .62, H * .34, 0, 7); px.fill(); }
}
function portalFrame(now) {
  if (heroOn) {
    const dt = Math.min(40, now - pT); pT = now; rotX += (tX - rotX) * Math.min(1, dt * .009); rotY += (tY - rotY) * Math.min(1, dt * .009);
    const W = hero.clientWidth, H = hero.clientHeight, hr = hero.getBoundingClientRect(), r = portalBtn.getBoundingClientRect(), e = expansion;
    const rcx = r.left + r.width / 2 - hr.left, rcy = r.top + r.height / 2 - hr.top, cx = rcx + (W / 2 - rcx) * e, cy = rcy + (H / 2 - rcy) * e;
    const sc = e ? 1 : maskScale, w = (r.width + (W - r.width) * e) * sc, hh = (r.height + (H - r.height) * e) * sc, rad = Math.min(parseFloat(getComputedStyle(portalBtn).borderRadius) * (1 - e) * sc, w / 2, hh / 2), ax = rotX * (1 - e) * Math.PI / 180, ay = rotY * (1 - e) * Math.PI / 180;
    px.clearRect(0, 0, W, H);
    if (w > 1 && hh > 1) { const path = new Path2D();
      [[w / 2 - rad, -hh / 2 + rad, -Math.PI / 2], [w / 2 - rad, hh / 2 - rad, 0], [-w / 2 + rad, hh / 2 - rad, Math.PI / 2], [-w / 2 + rad, -hh / 2 + rad, Math.PI]].forEach(([ox, oy, a0], ci) => { for (let i = 0; i <= 10; i++) { const a = a0 + Math.PI / 2 * i / 10, x = ox + Math.cos(a) * rad, y = oy + Math.sin(a) * rad, z = x * Math.sin(ay) - y * Math.sin(ax), p = 850 / (850 + z), sx = cx + x * Math.cos(ay) * p, sy = cy + y * Math.cos(ax) * p; ci + i ? path.lineTo(sx, sy) : path.moveTo(sx, sy); } });
      path.closePath(); px.save(); px.clip(path); drawCover(); px.restore();
      if (e < .02 && sc > .5) { px.strokeStyle = "rgba(233,237,240,.45)"; px.lineWidth = 1; px.stroke(path); } }
  }
  requestAnimationFrame(portalFrame);
}
new IntersectionObserver(es => { heroOn = es[0].isIntersecting; if (heroOn) { $("#hero-bg").play().catch(() => {}); pv.play().catch(() => {}); } else { $("#hero-bg").pause(); pv.pause(); } }).observe(hero);
const revealMask = () => { maskScale = 0; return animate(v => maskScale = v, 1050); };
async function travel() {
  if (busy) return; busy = true; tX = tY = 0; hero.classList.add("go"); document.body.classList.add("lock"); scrollTo(0, 0);
  try { pv.currentTime = 0; pv.playbackRate = 1.3; await pv.play(); } catch (e) {}
  await animate(v => expansion = v, 1100); await new Promise(r => setTimeout(r, pv.readyState >= 2 ? 1500 : 500));
  document.documentElement.style.scrollBehavior = "auto"; document.body.classList.remove("lock"); $("#footage").scrollIntoView(); document.documentElement.style.scrollBehavior = "";
  expansion = 0; maskScale = 0; pv.playbackRate = 1; hero.classList.remove("go"); busy = false; revealMask();
}
portalBtn.onclick = travel;

/* ───────── preloader ───────── */
(() => {
  const pre = $("#pre"), v = $("#pre-video"), val = $("#pre-val"), cnt = $("#pre-count"), logo = $("#logo"); let done = false, fake = 0;
  const finish = () => { if (done) return; done = true; val.textContent = "100"; cnt.classList.add("bye"); logo.classList.add("dock"); pre.classList.add("done"); document.body.classList.add("ready");
    const bg = $("#hero-bg"); bg.play().then(() => bg.classList.add("vis")).catch(() => {}); bg.addEventListener("playing", () => bg.classList.add("vis"), { once: true }); pv.play().catch(() => {});
    revealMask(); setTimeout(() => hero.classList.add("show"), 850); setTimeout(() => cnt.remove(), 750); setTimeout(() => { logo.classList.add("set"); v.removeAttribute("src"); v.load(); }, 2000); };
  const fakeRun = () => { if (fake) return; const t0 = performance.now(); fake = 1; const f = now => { if (done) return; const t = Math.min(1, (now - t0) / 2200); val.textContent = Math.round(ease(t) * 100); t < 1 ? requestAnimationFrame(f) : finish(); }; requestAnimationFrame(f); };
  if (STILL) return finish();
  const tick = () => { if (done || fake) return; if (v.duration) val.textContent = Math.round(v.currentTime / v.duration * 100); requestAnimationFrame(tick); };
  const start = () => { if (fake || done) return; v.playbackRate = Math.max(.25, v.duration / 3); v.play().then(tick).catch(fakeRun); };
  v.readyState >= 1 ? start() : v.addEventListener("loadedmetadata", start, { once: true });
  v.addEventListener("ended", finish); v.addEventListener("error", fakeRun);
  setTimeout(() => { if (!done && !(v.currentTime > 0)) fakeRun(); }, 1800); setTimeout(finish, 7000);
})();

/* ───────── reticle cursor: exact dot, lagging targeting box, live coordinates ───────── */
if (FINE && !STILL) (() => {
  document.documentElement.classList.add("ship");
  const c = $("#cursor"), r = $("#reti"), lab = $("#cur-lab"), xy = $("#cur-xy"); let mx = -99, my = -99, x = -99, y = -99;
  addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; c.classList.add("on"); r.classList.add("on"); c.style.transform = `translate3d(${mx}px,${my}px,0)`;
    const t = e.target.closest && e.target.closest("[data-cur],a,button,summary,input,video[controls]"); r.classList.toggle("hot", !!t && !t.matches("input"));
    lab.textContent = t ? (t.dataset.cur || (t.matches("summary") ? "Expand" : t.matches("video") ? "Play" : "Open")) : ""; }, { passive: true });
  document.addEventListener("mouseleave", () => { c.classList.remove("on"); r.classList.remove("on"); });
  addEventListener("pointerdown", () => r.classList.add("down")); addEventListener("pointerup", () => r.classList.remove("down"));
  const loop = () => { x += (mx - x) * .22; y += (my - y) * .22; r.style.transform = `translate3d(${x}px,${y}px,0)`;
    xy.textContent = "X " + String(Math.max(0, Math.round(mx))).padStart(4, "0") + "  Y " + String(Math.max(0, Math.round(my + scrollY))).padStart(5, "0"); requestAnimationFrame(loop); }; loop();
})();

/* ───────── footage reel, stats ───────── */
$("#reel").append(deck(window.REEL.map(r => h("article", { class: "pan" }, mediaFrame([r[0] === "v" ? ["v", r[1], r[2], r[3]] : ["y", r[1], r[3]]], r[3], "var(--hot)"), h("div", { class: "pf" }, h("div", { class: "meta" }, h("span", { text: r[4] }), h("span", { text: r[0] === "v" ? "Government release" : "Shown to Congress or broadcast" })), h("h3", { text: r[3] }))))));
[[12618, "reports logged by the Air Force's Project Blue Book. It left 701 unidentified."], [143, "of 144 military reports the intelligence community could not explain in 2021."], [1652, "reports held by the Pentagon's UAP office by late 2024."], [34, "officials on camera in 2025 alleging a hidden recovery program."], [5, "batches of government UFO files published since May 2026."]]
  .forEach(([n, t]) => { const b = h("b", { text: "0" }), el = h("div", { class: "stat" }, b, h("span", { text: t })); $("#stats").append(el);
    new IntersectionObserver((es, io) => { if (!es[0].isIntersecting) return; io.disconnect(); STILL ? b.textContent = n.toLocaleString("en-US") : animate(v => b.textContent = Math.round(n * v).toLocaleString("en-US"), 1600); }).observe(el); });
for (const k in TIER) $("#keys").append(h("span", {}, h("span", { class: "chip t-" + k, text: TIER[k].name }), TIER[k].desc));

/* ───────── the record ───────── */
const st = { tier: "", q: "", vid: false }, tools = $("#tools");
const fchip = (label, g, v, cls) => h("button", { type: "button", class: "chip " + (cls || "plain"), "aria-pressed": "false", "data-g": g, "data-v": String(v), "data-cur": "Filter", text: label, onclick: () => { st[g] = g === "vid" ? !st.vid : (st[g] === v ? "" : v); $$("button.chip", tools).forEach(b => b.setAttribute("aria-pressed", (b.dataset.g === "vid" ? st.vid : st[b.dataset.g] === b.dataset.v) ? "true" : "false")); drawRecord(); } });
for (const k in TIER) tools.append(fchip(TIER[k].name, "tier", k, "t-" + k)); tools.append(fchip("Has video", "vid", true));
$("#q").addEventListener("input", e => { st.q = e.target.value.trim().toLowerCase(); drawRecord(); });
const yearText = e => e.y < 0 ? Math.round(-e.y) + " BCE" : String(Math.floor(e.y)), hasVid = e => (window.MEDIA[e.t] || []).some(m => m[0] !== "i"), tc = k => `var(--${k})`;
const openEntry = e => openDos({ left: mediaFrame(window.MEDIA[e.t], yearText(e), tc(e.k)), meta: [h("span", { text: e.d + " · " + e.p }), h("span", { class: "chip t-" + e.k, title: TIER[e.k].desc, text: TIER[e.k].name })], title: e.t,
  blocks: [["The case", e.s], ["The pushback", e.c, true]], links: [ext("Read more", wiki(e.w)), e.v ? ext("Find footage", ytFind(e.v)) : null, ...(e.l || []).map(([t, u]) => ext(t, u))].filter(Boolean) });
function drawRecord() {
  const root = $("#eras"); root.replaceChildren(); let n = 0;
  window.ERAS.forEach(era => { const rows = window.TIMELINE.filter(e => e.e === era.id && (!st.tier || e.k === st.tier) && (!st.vid || hasVid(e)) && (!st.q || (e.t + " " + e.p + " " + e.s + " " + e.c + " " + e.d + " " + (e.g || []).join(" ")).toLowerCase().includes(st.q)));
    if (!rows.length) return; n += rows.length;
    root.append(h("section", { class: "scene era" }, h("div", { class: "bg", "data-bg": era.id }), h("div", { class: "veil" }),
      h("div", { class: "inner" }, h("div", { class: "headrow" }, h("div", {}, h("span", { class: "kick", text: era.span + " · " + rows.length + " files" }), h("h2", { class: "mega", text: era.name })), h("p", { class: "lede", text: era.note }))),
      deck(rows.map(e => h("article", { class: "pan" }, mediaFrame(window.MEDIA[e.t], yearText(e), tc(e.k)), h("div", { class: "pf" }, h("div", { class: "meta" }, h("span", { text: e.d }), h("span", { class: "chip t-" + e.k, text: TIER[e.k].name })), h("h3", { text: e.t }), h("div", { class: "where", text: e.p }), h("button", { class: "open", type: "button", "data-cur": "Open file", text: "Open the file →", onclick: () => openEntry(e) }))))))); });
  if (!n) root.append(h("p", { class: "empty", text: "Nothing matches. Clear a filter or try another word." }));
  armBg(root); reveal(root); collectPar();
}
drawRecord();

/* ───────── sacred sites stage ───────── */
(() => {
  const S = window.SITES, ph = [$("#ph0"), $("#ph1")], list = $("#site-list"), info = $("#site-info"); let cur = -1, flip = 0;
  const set = i => { i = (i + S.length) % S.length; if (i === cur) return; cur = i; const s = S[i], im = window.SITE_IMG[s.g];
    flip ^= 1; ph[flip].style.backgroundImage = im ? `url("${cImg(im[0], 1920)}")` : "none"; ph[flip].classList.add("vis"); ph[flip ^ 1].classList.remove("vis");
    $("#site-no").textContent = pad(i + 1); $$("button", list).forEach((b, j) => b.setAttribute("aria-pressed", j === i ? "true" : "false"));
    info.replaceChildren(h("div", { class: "swap" }, h("span", { class: "kick", text: s.p + " · " + s.d }), h("h3", { text: s.n }), h("p", { text: s.f })),
      h("div", { class: "acts swap" }, h("button", { class: "arrow", type: "button", "aria-label": "Previous site", "data-cur": "Back", html: ARR(-1), onclick: () => set(cur - 1) }), h("button", { class: "arrow", type: "button", "aria-label": "Next site", "data-cur": "Next", html: ARR(1), onclick: () => set(cur + 1) }),
        h("button", { class: "btn", type: "button", "data-cur": "Open file", text: "The claim and the dig", onclick: () => openDos({ left: mediaFrame(im ? [["i", im[0], s.n, im[1]]] : [], s.n, "var(--myt)"), meta: [h("span", { text: s.p + " · " + s.c })], title: s.n, blocks: [["Built", s.d], ["What is there", s.f], ["The sky-visitor reading", s.a], ["What archaeologists found", s.r, true]], links: [ext("Read more", wiki(s.n))] }) }))); };
  S.forEach((s, i) => list.append(h("button", { type: "button", "aria-pressed": "false", "data-cur": "View", text: s.n, onclick: () => set(i) })));
  new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { io.disconnect(); set(0); } }, { rootMargin: "40% 0px" }).observe($("#sites"));
  if (FINE && !STILL) $("#sites").addEventListener("pointermove", e => { const dx = (e.clientX / innerWidth - .5) * -26, dy = (e.clientY / innerHeight - .5) * -18; ph.forEach(p => p.style.translate = `${dx}px ${dy}px`); });
})();

/* ───────── beings lineup: one photoreal plate, eight hotspots ───────── */
const A = window.ART, artUrl = k => window.ART_BASE + k;
(() => {
  const B = Object.fromEntries(window.BEINGS.map(b => [b.g, b]));
  const open = g => { const b = B[g]; if (!b) return; openDos({ left: A.being[g] ? mediaFrame([["a", A.being[g], b.n + ", as witnesses describe them"]], b.n, "var(--ice)") : mediaFrame([], b.n, "var(--ice)"), meta: [h("span", { text: b.tag })], title: b.n, blocks: [["Look", b.look], ["Behaviour", b.does], ["Said to come from", b.from], ["Key cases", b.cases], ["Reality check", b.check, true]], links: [ext("Find accounts", ytFind(b.n + " alien encounter witness")), ext("Read more", wiki(b.n + " alien"))] }); };
  const spots = [["goblin", "Little men", "Under 3 ft", 7.4, 53], ["grey", "Grey", "3.5 to 4.5 ft", 16.9, 37], ["hybrid", "Hybrid", "About 5 ft", 27.2, 30.5], [null, "You", "5 ft 9 in", 38.6, 24.5], ["nordic", "Nordic", "6 to 7 ft", 51, 13.5], ["mantis", "Mantis", "6 to 7 ft", 63.8, 9], ["reptile", "Reptilian", "6 to 8 ft", 77.5, 7.5], ["white", "Tall White", "Up to 8 ft", 91.2, 1.5]];
  const shot = h("div", { class: "shot" }, h("img", { src: artUrl(A.lineup), alt: "Eight figures standing in a row against a dark wall, shortest to tallest: a little goblin-like being, a Grey, a hybrid, an average human, a Nordic, a mantis being, a Reptilian and a Tall White.", draggable: "false", onerror: e => { e.target.remove(); shot.classList.add("noimg"); } }),
    spots.map(([g, n, ht, x, t]) => h(g ? "button" : "div", { class: "hs" + (g ? "" : " you"), type: g ? "button" : null, style: `--x:${x}%;--t:${t}%`, "data-cur": g ? "Open file" : null, "aria-label": g ? `Open file: ${n}, ${ht}` : null, onclick: g ? () => open(g) : null }, h("span", { class: "tag" }, h("b", { text: n }), h("i", { text: ht })))), h("span", { class: "ai", text: "AI illustration · heights to scale" }));
  $("#lineup").append(h("div", { class: "plate" }, shot));
  const L = B.light; $("#lineup").after(h("button", { class: "orbcard", type: "button", "data-cur": "Open file", onclick: () => open("light") }, A.being.light ? h("img", { src: artUrl(A.being.light), alt: "", loading: "lazy", draggable: "false", onerror: e => e.target.remove() }) : null, h("span", {}, h("i", { text: L.tag }), h("b", { text: L.n }), h("em", { text: "The ninth type has no body to measure. Open the file →" }))));
})();

/* ───────── craft, observables ───────── */
$("#craft-count").textContent = `${["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen"][window.CRAFT.length] || window.CRAFT.length} shapes. Orbs and lights make up most of today's military reports.`;
$("#craft-deck").append(deck(window.CRAFT.map(c => { const u = A.craft[c.g];
  const art = () => { const b = h("div", { class: "art" }); const fail = () => b.replaceChildren(h("div", { class: "tile" }, h("b", { text: c.n }))); if (u) b.append(h("img", { src: artUrl(u), alt: c.n + ", illustrated", loading: "lazy", draggable: "false", onerror: fail }), h("span", { class: "ai", text: "AI illustration" })); else fail(); return b; };
  const file = () => openDos({ left: u ? mediaFrame([["a", u, c.n]], c.n, "var(--hot)") : art(), meta: [h("span", { text: "Reported size " + c.size })], title: c.n, blocks: [["How it behaves", c.how], ["Key cases", c.cases], ["Often turns out to be", c.alike, true]], links: [ext("Find footage", ytFind(c.n + " UFO footage"))] });
  return h("article", { class: "pan craft" }, art(), h("div", { class: "pf" }, h("div", { class: "meta" }, h("span", { text: c.size })), h("h3", { text: c.n }), h("button", { class: "open", type: "button", "data-cur": "Open file", text: "Open the file →", onclick: file }))); })));
window.OBSERVABLES.forEach((o, i) => $("#obs").append(h("div", {}, h("b", { text: String(i + 1) }), h("h4", { text: o.n }), h("p", { text: o.t }))));
$("#obs-vid").append(mediaFrame([window.SECTION_VIDEO.observables], "5", "var(--hot)"), mediaFrame([["i", "USS Nimitz 2004 tic tac UFO.jpg", "Artist's reconstruction of the 2004 Nimitz encounter", "CC BY-SA 4.0"]], "2004", "var(--hot)"));

/* ───────── index rows ───────── */
const row = (no, title, tag, body, small, star) => h("details", {}, h("summary", { style: star ? "color:var(--hot)" : null }, h("span", { class: "no" + (small ? " sm" : ""), text: no }), h("h3", { text: title }), h("span", { class: "tag" }, tag)), h("div", { class: "rowbody" }, body));
const blk = (k, v, warn) => v ? h("p", { class: warn ? "warn" : null }, h("b", { text: k }), v) : null;
window.ORIGINS.forEach((o, i) => $("#origin-rows").append(row(pad(i + 1), o.n, o.k, [blk("The idea", o.idea), blk("Best argument", o.best), blk("Hardest problem", o.hard, true), blk("Who argues it", o.who)])));
window.FERMI.forEach((f, i) => $("#fermi-rows").append(row(pad(i + 1), f.n, f.k + (f.star ? " · where this page ends up" : ""), [blk("The idea", f.t), blk("The problem", f.x, true)], false, f.star)));
window.RETRIEVALS.forEach(r => $("#ret-rows").append(row(r.y, r.who, h("span", { class: "chip t-" + r.k, text: TIER[r.k].name }), [blk("The claim", r.what), blk("Where it stands", r.st, true)], true)));
window.PHYSICS.forEach((p, i) => $("#phys-rows").append(row(pad(i + 1), p.n, "", [h("p", { text: p.t })])));

/* ───────── programs ───────── */
(() => {
  const P = window.PROGRAMS, S = window.PSTATUS, tools = $("#prog-tools"), out = $("#prog-rows"); let f = "";
  $("#prog-count").textContent = `${P.length} programs, ${P.filter(p => p.st === "confirmed").length} of them confirmed.`;
  const draw = () => { out.replaceChildren(); let last = "", box;
    P.filter(p => !f || p.st === f).forEach(p => { if (p.c !== last) { last = p.c; out.append(h("div", { class: "country", text: p.c })); box = h("div", { class: "rows tight" }); out.append(box); }
      box.append(row(p.y, p.n, h("span", { class: "chip", style: `--c:${S[p.st].c}`, text: S[p.st].n }), [blk("Run by", p.a), blk("What it was", p.t, p.st !== "confirmed")], true)); }); reveal(out); };
  for (const k in S) tools.append(h("button", { type: "button", class: "chip", style: `--c:${S[k].c}`, "aria-pressed": "false", "data-cur": "Filter", text: S[k].n + " · " + P.filter(p => p.st === k).length, onclick: e => { f = f === k ? "" : k; $$("button", tools).forEach(b => b.setAttribute("aria-pressed", "false")); if (f) e.currentTarget.setAttribute("aria-pressed", "true"); draw(); } }));
  draw();
})();

/* ───────── voices ───────── */
const VOICE_YT = { "David Grusch": "RBAISwCZ2v0", "Jacques Vallée": "fyX8V1XXmQM", "David Fravor": "aB8zcAttP1E", "Karl Nell": "Rpl0FrdJWfs", "Jake Barber": "3dtA9w5ldHw", "Ryan Graves": "Lf6y9QHj5S8", "Beatriz Villarroel": "1zRWi_r3HRM", "James Lacatski": "rW02-PuPMJ8", "John Mack": "-U1WecFObQw", "Robert Salas": "R6qOppJ3PBk", "Charles Halt": "eSdDFUetIEc", "Bob Lazar": "iitR3nBa5Ps", "Alex Dietrich": "ZBtMbBPzqHY" };
(() => { const groups = {}; window.VOICES.forEach(v => (groups[v.c] = groups[v.c] || []).push(v));
  for (const g in groups) $("#voice-groups").append(h("div", { class: "vg" }, h("h3", { text: g }), h("div", { class: "names" }, groups[g].map(v => h("button", { type: "button", "data-cur": "Open file", text: v.n, onclick: () => openDos({ left: mediaFrame(VOICE_YT[v.n] ? [["y", VOICE_YT[v.n], v.n]] : [], v.n.split(" ").map(w => w[0]).join("").slice(0, 3), "var(--hot)"), meta: [h("span", { text: g })], title: v.n, blocks: [["Role", v.r], ["Why they matter", v.t]], links: [ext("Watch interviews", ytFind(v.n + " UAP interview")), ext("Background", wiki(v.n))] }) }))))); })();

/* ───────── thesis, films ───────── */
function filmDeck() {
  return deck(window.FILMS.map((f, i) => { const frame = h("div", { class: "media" }), id = window.FILM_YT[f.y];
    const face = h("a", { class: "face", href: id ? "https://www.youtube.com/watch?v=" + id : ytFind(f.n + " official trailer"), target: "_blank", rel: "noopener", "data-cur": "Trailer", "aria-label": "Play trailer: " + f.n }, h("div", { class: "poster" + (id ? " shot" : ""), style: `--h:${(18 + i * 29) % 360}` }, id ? h("img", { src: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, alt: "", loading: "lazy", draggable: "false", onerror: e => { e.target.parentElement.classList.remove("shot"); e.target.remove(); } }) : null, h("b", { text: String(f.y) }), h("div", {}, f.s ? h("span", { text: "Spielberg" }) : null, h("h4", { text: f.n }))), h("span", { class: "play" }));
    if (EMBED && id) face.addEventListener("click", ev => { ev.preventDefault(); frame.replaceChildren(h("iframe", { src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`, title: f.n + " trailer", allow: "autoplay; encrypted-media; picture-in-picture; fullscreen", allowfullscreen: true, referrerpolicy: "strict-origin-when-cross-origin" })); });
    frame.append(face); return h("article", { class: "pan" }, frame, h("p", { text: f.t })); }), "films");
}
const TH_CAP = ["They came down, and we called them gods", "One sky, three pyramids", "Something was added", "The view from the other side of the glass", "Same visitor, different costume", "What a secret this size would look like", "We were shown it in the dark first", "The proof may already be inside us"];
window.THESIS.forEach((t, i) => {
  const items = [A.thesis[i] ? ["a", A.thesis[i], TH_CAP[i]] : null, i === 0 ? ["i", "Pieter Bruegel the Elder - The Fall of the Rebel Angels - Google Art Project.jpg", "Bruegel, The Fall of the Rebel Angels, 1562", "PD"] : null, i === 3 ? window.SECTION_VIDEO.zoo : null];
  const inset = items.some(Boolean) ? h("div", { class: "inset art16" }, mediaFrame(items, ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][i], "var(--hot)")) : null;
  const films = i === 6 ? h("div", { class: "inset wide", style: "margin-left:calc(-1*var(--pad));margin-right:calc(-1*var(--pad))" }, filmDeck()) : null;
  $("#thesis-list").append(h("div", { class: "th" }, h("b", { text: String(i + 1) }), h("div", {}, h("h3", { text: t.n }), inset, h("p", { class: "say", text: t.t }), films,
    h("details", {}, h("summary", { class: "open", "data-cur": "Expand", text: "Pressure test →" }), h("div", { class: "rowbody" }, blk("What supports it", t.f), blk("What cuts against it", t.x, true))))));
});

/* ───────── Drake calculator ───────── */
(() => {
  const D = window.DRAKE, box = $("#drake"), vals = {}, sup = n => String(n).split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]).join("");
  const toV = (t, x) => t.log ? t.min * Math.pow(t.max / t.min, x / 1000) : t.min + (t.max - t.min) * x / 1000, toX = (t, v) => Math.round(t.log ? 1000 * Math.log(v / t.min) / Math.log(t.max / t.min) : 1000 * (v - t.min) / (t.max - t.min));
  const fmt = v => v >= 1e9 ? (v / 1e9).toFixed(1).replace(/\.0$/, "") + " billion" : v >= 1e6 ? (v / 1e6).toFixed(1).replace(/\.0$/, "") + " million" : v >= 100 ? Math.round(v).toLocaleString("en-US") : v >= 10 ? v.toFixed(0) : v >= 1 ? v.toFixed(1).replace(/\.0$/, "") : v >= .01 ? v.toFixed(2) : v.toExponential(1).replace(/e-(\d+)/, (m, d) => " × 10⁻" + sup(d));
  const presets = h("div", { class: "presets" }), outs = {}, ins = {}, N = h("b"), Ns = h("span");
  box.append(h("div", { class: "eq", html: "N = <i>R*</i> · <i>f<sub>p</sub></i> · <i>n<sub>e</sub></i> · <i>f<sub>l</sub></i> · <i>f<sub>i</sub></i> · <i>f<sub>c</sub></i> · <i>L</i>" }), presets);
  const calc = () => { let n = 1; D.terms.forEach(t => { n *= vals[t.id]; outs[t.id].textContent = fmt(vals[t.id]); }); N.textContent = fmt(n); Ns.textContent = n >= 1 ? "civilisations we could detect in the Milky Way right now." : "in this galaxy. On these numbers we are probably alone in it, with one such civilisation per " + fmt(1 / n) + " galaxies."; };
  D.terms.forEach(t => { ins[t.id] = h("input", { type: "range", id: "dr-" + t.id, min: 0, max: 1000, step: 1, oninput: e => { vals[t.id] = toV(t, +e.target.value); calc(); } }); outs[t.id] = h("output", { for: "dr-" + t.id });
    box.append(h("div", { class: "sl" }, h("b", { text: t.sym }), h("label", { for: "dr-" + t.id, text: t.n }), outs[t.id], ins[t.id], h("small", { text: t.note }))); });
  box.append(h("div", { class: "N" }, N, Ns));
  const apply = (p, btn) => { D.terms.forEach(t => { vals[t.id] = p.v[t.id]; ins[t.id].value = toX(t, p.v[t.id]); }); $$("button", presets).forEach(b => b.setAttribute("aria-pressed", b === btn ? "true" : "false")); calc(); };
  D.presets.forEach((p, i) => { const b = h("button", { type: "button", class: "chip plain", title: p.note, "data-cur": "Load", text: p.n, onclick: () => apply(p, b) }); presets.append(b); if (!i) apply(p, b); });
})();
["drake", "fermi", "zoo"].forEach(k => $("#math-vid").append(mediaFrame([window.SECTION_VIDEO[k]], "N", "var(--hot)")));

/* ───────── library, credits ───────── */
$("#lib").append(h("div", { class: "stack" }, mediaFrame([window.SECTION_VIDEO.phenomenon], "Film", "var(--hot)"), mediaFrame([window.SECTION_VIDEO.gobekli], "Dig", "var(--hot)")));
for (const k in window.LIBRARY) $("#lib").append(h("div", {}, h("h3", { text: k }), h("ul", {}, window.LIBRARY[k].map(([t, d]) => h("li", {}, h("a", { href: (k === "Read" ? "https://www.google.com/search?tbm=bks&q=" : "https://www.youtube.com/results?search_query=") + encodeURIComponent(t.replace(/\(.*?\)/g, "")), target: "_blank", rel: "noopener", text: t }), h("span", { text: d }))))));
$("#lib").append(h("div", {}, h("h3", { text: "Sources" }), h("ul", {}, window.SOURCES.map(([t, u]) => h("li", {}, h("a", { href: u, target: "_blank", rel: "noopener", text: t + " ↗" }))))));
$("#credits").append("Background photography: ", Object.values(window.BG).map(([f, lic, who], i) => [i ? ", " : "", h("a", { href: cPage(f), target: "_blank", rel: "noopener", text: who }), " (" + lic + ")"]), ". Hero video from the Planet Jumping asset set.");

new IntersectionObserver(es => document.body.classList.toggle("at-top", es[0].isIntersecting), { rootMargin: "-45% 0px -45% 0px" }).observe($("#top"));
armBg(document); reveal(document); collectPar(); parallax(); requestAnimationFrame(frame); requestAnimationFrame(portalFrame);
})();
