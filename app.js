(() => {
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const h = (tag, attrs, ...kids) => {
  const e = document.createElement(tag);
  for (const k in attrs || {}) {
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === "html") e.innerHTML = v; else if (k === "text") e.textContent = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? "" : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) e.append(c);
  return e;
};
const enc = f => encodeURIComponent(f).replace(/'/g, "%27");
/* Outside players load on an ordinary web host. Inside Claude's preview they are blocked, so videos open in a new tab there. */
const EMBED = /^https?:$/.test(location.protocol) && !/claude|anthropic/i.test(location.hostname);
const cImg = (f, w) => `https://commons.wikimedia.org/wiki/Special:FilePath/${enc(f)}?width=${w}`;
const cPage = f => `https://commons.wikimedia.org/wiki/File:${enc(f.replace(/ /g, "_"))}`;
const cPoster = (f, w) => `https://commons.wikimedia.org/w/thumb.php?f=${enc(f)}&w=${w}`;
const cVid = (f, hash, key) => { const e = enc(f.replace(/ /g, "_")); return `https://upload.wikimedia.org/wikipedia/commons/transcoded/${hash}/${e}/${e}.${key}`; };
const wiki = q => "https://en.wikipedia.org/w/index.php?search=" + encodeURIComponent(q);
const ytFind = q => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
const ext = (label, href) => h("a", { href, target: "_blank", rel: "noopener", text: label + " ↗" });
const TIER = window.TIERS;
const tierColor = k => `var(--${k})`;

/* ───────── media frames ───────── */
function tile(frame, text, color) {
  frame.querySelectorAll("img,video,iframe,.face,.cap,.src").forEach(n => n.remove());
  if (!frame.querySelector(".tile")) frame.prepend(h("div", { class: "tile", style: color ? `--c:${color}` : null }, h("b", { text })));
}
function show(frame, item, tileText, color) {
  frame.querySelectorAll("img,video,iframe,.face,.cap,.src,.tile").forEach(n => n.remove());
  if (!item) return tile(frame, tileText, color);
  const [kind, a, b, c] = item;
  if (kind === "i") {
    const doc = /memo|Record|Times|Call|Assessment|Tehran|Twining|Blue Book|fatima|Nürnberg|Utsuro|graph|GEIPAN|map/i.test(a);
    frame.append(
      h("img", { src: cImg(a, 900), alt: b, loading: "lazy", class: doc ? "doc" : null, onerror: () => tile(frame, tileText, color) }),
      h("div", { class: "cap", text: b }),
      h("a", { class: "src", href: cPage(a), target: "_blank", rel: "noopener", text: "Commons · " + c })
    );
  } else if (kind === "v") {
    const v = h("video", { controls: true, preload: "none", playsinline: true, poster: cPoster(a, 900), "aria-label": c });
    ["480p.vp9.webm", "360p.mpeg4.mov", "240p.vp9.webm"].forEach(k => v.append(h("source", { src: cVid(a, b, k), type: k.endsWith("mov") ? "video/quicktime" : "video/webm" })));
    v.append(h("a", { href: cPage(a), text: "Watch on Wikimedia Commons" }));
    frame.append(v, h("a", { class: "src", href: cPage(a), target: "_blank", rel: "noopener", text: "US government · public domain" }));
  } else if (kind === "y") {
    const face = h("a", { class: "face", href: "https://www.youtube.com/watch?v=" + a, target: "_blank", rel: "noopener", "aria-label": "Play: " + b },
      h("img", { src: `https://i.ytimg.com/vi/${a}/hqdefault.jpg`, alt: "", loading: "lazy", onerror: e => { e.target.remove(); face.prepend(h("div", { class: "tile", style: color ? `--c:${color}` : null }, h("b", { text: tileText }))); } }),
      h("span", { class: "play" }), h("span", { class: "cap", text: b }));
    if (EMBED) face.addEventListener("click", ev => {
      ev.preventDefault();
      frame.querySelectorAll(".face,.src").forEach(n => n.remove());
      frame.append(h("iframe", { src: `https://www.youtube-nocookie.com/embed/${a}?autoplay=1&rel=0`, title: b, allow: "autoplay; encrypted-media; picture-in-picture; fullscreen", allowfullscreen: true, referrerpolicy: "strict-origin-when-cross-origin" }));
    });
    frame.append(face, h("span", { class: "src", text: "YouTube" }));
  }
}
function mediaFrame(items, tileText, color) {
  const frame = h("div", { class: "media" });
  items = items || [];
  if (items.length > 1) {
    const tabs = h("div", { class: "tabs" });
    items.forEach((it, i) => tabs.append(h("button", { type: "button", "aria-pressed": i === 0 ? "true" : "false", "aria-label": (it[0] === "i" ? "Image: " : "Video: ") + (it[0] === "v" ? it[3] : it[2]), text: it[0] === "i" ? "▣" : "▶", onclick: ev => { tabs.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", "false")); ev.currentTarget.setAttribute("aria-pressed", "true"); show(frame, it, tileText, color); } })));
    frame.append(tabs);
  }
  show(frame, items[0], tileText, color);
  return frame;
}

/* ───────── hero index, key, reel ───────── */
[["01", "Footage", "#footage"], ["02", "Start here", "#start"], ["03", "Timeline", "#timeline"], ["04", "Sacred sites", "#sites"], ["05", "Beings", "#beings"], ["06", "Craft", "#craft"], ["07", "Origins", "#origins"], ["08", "The math", "#math"], ["09", "Retrievals", "#retrievals"], ["10", "Voices", "#voices"], ["11", "The thesis", "#thesis"]]
  .forEach(([n, t, href]) => $("#idx").append(h("a", { href }, h("b", { text: n }), t)));
for (const k in TIER) $("#key").append(h("span", {}, h("span", { class: "chip t-" + k, text: TIER[k].name }), TIER[k].desc));

window.REEL.forEach(r => {
  const item = r[0] === "v" ? ["v", r[1], r[2], r[3]] : ["y", r[1], r[3]];
  $("#reel").append(h("div", {}, mediaFrame([item], r[3], "var(--sig)"), h("h3", { text: r[3] }), h("p", { class: "mono", text: r[4] })));
});

/* ───────── timeline ───────── */
const state = { era: "", tier: "", q: "", vid: false };
const tools = $("#tools");
const chip = (label, group, val, cls) => h("button", { type: "button", class: "chip " + (cls || "plain"), "aria-pressed": state[group] === val ? "true" : "false", "data-g": group, "data-v": String(val), text: label, onclick: () => { state[group] = (group === "vid") ? !state.vid : (state[group] === val ? "" : val); drawTimeline(); syncChips(); } });
window.ERAS.forEach(e => tools.append(chip(e.span, "era", e.id)));
tools.append(h("span", { class: "sp" }));
for (const k in TIER) tools.append(chip(TIER[k].name, "tier", k, "t-" + k));
tools.append(h("span", { class: "sp" }), chip("▶ With video", "vid", true));
function syncChips() { tools.querySelectorAll("button.chip").forEach(b => { const g = b.dataset.g; b.setAttribute("aria-pressed", (g === "vid" ? state.vid : state[g] === b.dataset.v) ? "true" : "false"); }); }
$("#q").addEventListener("input", e => { state.q = e.target.value.trim().toLowerCase(); drawTimeline(); });
const yearText = e => e.y < 0 ? Math.round(-e.y) + " BCE" : String(Math.floor(e.y));
const hasVid = e => (window.MEDIA[e.t] || []).some(m => m[0] !== "i");
function card(e) {
  const links = h("div", { class: "links" }, ext("Read more", wiki(e.w)), e.v ? ext("Find footage", ytFind(e.v)) : null, (e.l || []).map(([t, u]) => ext(t, u)));
  return h("article", { class: "card t-" + e.k },
    mediaFrame(window.MEDIA[e.t], yearText(e), tierColor(e.k)),
    h("div", { class: "body" },
      h("div", { class: "row" }, h("span", { class: "mono", text: e.d }), h("span", { class: "chip t-" + e.k, title: TIER[e.k].desc, text: TIER[e.k].name })),
      h("h4", { text: e.t }), h("div", { class: "where", text: e.p }),
      h("details", {}, h("summary", { text: "Open the file" }), h("p", { text: e.s }), h("p", { class: "push" }, h("b", { text: "The pushback" }), e.c), links)));
}
function drawTimeline() {
  const tl = $("#tl"); tl.replaceChildren();
  let n = 0;
  window.ERAS.forEach(era => {
    if (state.era && state.era !== era.id) return;
    const rows = window.TIMELINE.filter(e => e.e === era.id && (!state.tier || e.k === state.tier) && (!state.vid || hasVid(e)) && (!state.q || (e.t + " " + e.p + " " + e.s + " " + e.c + " " + e.d + " " + (e.g || []).join(" ")).toLowerCase().includes(state.q)));
    if (!rows.length) return;
    n += rows.length;
    tl.append(h("div", { class: "era" }, h("h3", { text: era.name }), h("span", {}), h("span", { class: "mono", text: era.span + " · " + rows.length }), h("p", { text: era.note })), h("div", { class: "grid" }, rows.map(card)));
  });
  if (!n) tl.append(h("p", { class: "empty", text: "Nothing matches. Clear a filter or try another word." }));
}
$("#count").textContent = window.TIMELINE.length;
drawTimeline();

/* ───────── sacred sites ───────── */
window.SITES.forEach((s, i) => {
  const im = window.SITE_IMG[s.g];
  const frame = mediaFrame(im ? [["i", im[0], "", im[1]]] : [], s.n, "var(--myt)");
  frame.append(h("span", { class: "num", text: String(i + 1).padStart(2, "0") }), h("div", { class: "over" }, h("h3", { text: s.n }), h("span", { class: "mono", text: s.p + " · " + s.d })));
  $("#rail").append(h("article", { class: "site" }, frame, h("div", { class: "body" },
    h("span", { class: "mono", text: s.c }), h("p", { text: s.f }),
    h("details", {}, h("summary", { text: "The claim and the dig" }), h("div", { class: "ab", style: "margin-top:12px" }, h("div", {}, h("b", { text: "The sky-visitor reading" }), h("p", { text: s.a })), h("div", {}, h("b", { text: "What archaeologists found" }), h("p", { text: s.r })))))));
});
const rail = $("#rail"); const step = d => rail.scrollBy({ left: d * Math.min(rail.clientWidth * .8, 660), behavior: "smooth" });
$("#sprev").onclick = () => step(-1); $("#snext").onclick = () => step(1);

/* ───────── glyphs ───────── */
const svg = (vb, inner) => `<svg viewBox="${vb}" fill="none" stroke="#dfe7f7" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
const BEING_G = {
  grey: `<path d="M60 10c34 0 46 36 38 66-6 24-22 48-38 58-16-10-32-34-38-58C14 46 26 10 60 10z"/><path d="M33 74c8-8 20-6 24 4-8 8-20 6-24-4zM87 74c-8-8-20-6-24 4 8 8 20 6 24-4z" fill="#05070c"/><path d="M57 100h6M54 112h12"/>`,
  nordic: `<ellipse cx="60" cy="66" rx="26" ry="34"/><path d="M34 60c-6-34 12-50 26-50s32 16 26 50M34 60c-8 20-10 44-6 66M86 60c8 20 10 44 6 66M46 50c8-8 20-8 28 0"/><path d="M45 68h10M65 68h10M56 96c3 2 5 2 8 0"/>`,
  reptile: `<path d="M60 12c26 0 40 22 38 50-2 30-18 58-38 66-20-8-36-36-38-66C20 34 34 12 60 12z"/><path d="M30 58l22 8M90 58l-22 8M60 12v22M48 20l-4 14M72 20l4 14"/><ellipse cx="42" cy="70" rx="9" ry="5"/><ellipse cx="78" cy="70" rx="9" ry="5"/><path d="M42 65v10M78 65v10M52 102h16M40 40l6 6M80 40l-6 6M34 88l6-2M86 88l-6-2"/>`,
  mantis: `<path d="M60 126C44 100 22 74 20 40c14-16 66-16 80 0-2 34-24 60-40 86z"/><path d="M26 46c12-10 26-4 30 12-12 10-26 4-30-12zM94 46c-12-10-26-4-30 12 12 10 26 4 30-12z" fill="#05070c"/><path d="M48 28C40 10 30 6 22 8M72 28c8-18 18-22 26-20M56 96l4 6 4-6"/>`,
  white: `<path d="M60 8c24 0 34 28 30 58-4 28-16 56-30 66-14-10-26-38-30-66C26 36 36 8 60 8z"/><ellipse cx="44" cy="68" rx="11" ry="7" stroke="#9cd0ff" transform="rotate(14 44 68)"/><ellipse cx="76" cy="68" rx="11" ry="7" stroke="#9cd0ff" transform="rotate(-14 76 68)"/><path d="M40 14c-8 2-12 8-14 16M80 14c8 2 12 8 14 16M52 10c-2 6-2 10 0 14M68 10c2 6 2 10 0 14M56 104h8"/>`,
  goblin: `<circle cx="60" cy="68" r="34"/><path d="M28 56C10 44 6 26 8 16c14 4 26 14 30 28M92 56c18-12 22-30 20-40-14 4-26 14-30 28"/><circle cx="46" cy="64" r="9"/><circle cx="74" cy="64" r="9"/><path d="M46 88c8 6 20 6 28 0"/>`,
  hybrid: `<path d="M60 22c22 0 30 22 26 44-4 22-14 40-26 48-12-8-22-26-26-48-4-22 4-44 26-44z"/><ellipse cx="46" cy="70" rx="8" ry="6" fill="#05070c"/><ellipse cx="74" cy="70" rx="8" ry="6" fill="#05070c"/><path d="M44 24c-2-8 0-12 4-16M58 20c0-8 2-12 6-14M72 24c4-6 8-8 12-8M56 96h8"/>`,
  light: `<circle cx="60" cy="68" r="12" fill="#ffe2c2" stroke="none" class="blink"/><circle cx="60" cy="68" r="24" stroke="#ffb476"/><circle cx="60" cy="68" r="38" stroke-dasharray="2 7"/><circle cx="60" cy="68" r="52" stroke-dasharray="1 10" opacity=".6"/>`
};
const CRAFT_G = {
  orb: `<g class="float"><circle cx="100" cy="60" r="26" fill="#cfe3ff" stroke="none" opacity=".9"/><circle cx="92" cy="52" r="8" fill="#fff" stroke="none"/><circle cx="100" cy="60" r="38" stroke-dasharray="2 8"/></g>`,
  disc: `<g class="float"><ellipse cx="100" cy="66" rx="70" ry="13" fill="#131b2c"/><path d="M66 60c8-26 60-26 68 0"/><circle cx="60" cy="68" r="2.5" fill="#9cd0ff" class="blink"/><circle cx="100" cy="72" r="2.5" fill="#9cd0ff" class="blink"/><circle cx="140" cy="68" r="2.5" fill="#9cd0ff" class="blink"/></g>`,
  triangle: `<g class="float"><path d="M100 14l74 92H26z" fill="#090d16"/><circle cx="100" cy="30" r="5" fill="#fff" stroke="none"/><circle cx="44" cy="98" r="5" fill="#fff" stroke="none"/><circle cx="156" cy="98" r="5" fill="#fff" stroke="none"/><circle cx="100" cy="76" r="6" fill="#ff7a5c" stroke="none" class="blink"/></g>`,
  tictac: `<g class="float"><rect x="50" y="44" width="100" height="32" rx="16" fill="#eef2fb" stroke="none" transform="rotate(-10 100 60)"/><path d="M30 96h140" stroke-dasharray="2 9"/></g>`,
  cigar: `<g class="float"><rect x="18" y="50" width="164" height="20" rx="10" fill="#131b2c"/><circle cx="50" cy="60" r="2.5" fill="#ffd9b0" stroke="none"/><circle cx="75" cy="60" r="2.5" fill="#ffd9b0" stroke="none"/><circle cx="100" cy="60" r="2.5" fill="#ffd9b0" stroke="none"/><circle cx="125" cy="60" r="2.5" fill="#ffd9b0" stroke="none"/><circle cx="150" cy="60" r="2.5" fill="#ffd9b0" stroke="none"/></g>`,
  egg: `<g class="float"><ellipse cx="100" cy="52" rx="27" ry="36" fill="#f1f4fb" stroke="none"/><path d="M84 84l-12 22M116 84l12 22M100 88v18"/></g>`,
  cube: `<g class="float"><circle cx="100" cy="60" r="44"/><path d="M78 44h36v36H78zM92 34h36v36H92zM78 44l14-10M114 44l14-10M78 80l14-10M114 80l14-10" fill="#0a0f1a"/></g>`,
  boomerang: `<g class="float"><path d="M12 84L100 30l88 54-88-24z" fill="#090d16"/><circle cx="34" cy="76" r="3" fill="#fff" stroke="none"/><circle cx="66" cy="57" r="3" fill="#fff" stroke="none"/><circle cx="100" cy="40" r="3" fill="#fff" stroke="none"/><circle cx="134" cy="57" r="3" fill="#fff" stroke="none"/><circle cx="166" cy="76" r="3" fill="#fff" stroke="none"/></g>`,
  jelly: `<g class="float"><path d="M70 56c0-36 60-36 60 0z" fill="#1a2438"/><path d="M78 56c-2 16 4 26-2 44M92 56c2 18-4 24 0 48M108 56c-2 18 4 26 0 46M122 56c2 16-4 28 2 42"/></g>`,
  plasma: `<g class="blink"><circle cx="86" cy="58" r="26" fill="#ffb476" stroke="none" opacity=".55"/><circle cx="112" cy="64" r="22" fill="#ffd9b0" stroke="none" opacity=".6"/><circle cx="100" cy="54" r="12" fill="#fff" stroke="none"/></g><path d="M40 100c20-8 40 8 60 0s40 8 60 0" stroke-dasharray="2 7"/>`
};
const dl = pairs => h("dl", {}, pairs.filter(p => p[1]).map(([k, v, warn]) => [h("dt", { text: k }), h("dd", { class: warn ? "warn" : null, text: v })]));
const more = (label, ...kids) => h("details", {}, h("summary", { text: label }), kids);


/* ───────── lineup: reported heights, drawn to one scale ───────── */
(() => {
  const FT = 52, BASE = 470, W = 1030;
  const fig = (x, ft, o) => {
    const H = ft * FT, top = BASE - H, hr = o.head * H, hy = top + hr * 1.15, sh = top + hr * 2.3 + H * .025, hip = BASE - H * .46, sw = o.sw * H, hw = o.hw * H, aw = o.limb * H, c = o.c;
    const head = o.tri ? `<path d="M${x - hr * 1.5} ${top + hr * .5}Q${x} ${top - hr * .5} ${x + hr * 1.5} ${top + hr * .5}L${x} ${top + hr * 2.5}z" fill="${c}"/>` : `<ellipse cx="${x}" cy="${hy}" rx="${hr * (o.hwid || 1)}" ry="${hr * 1.15}" fill="${c}"/>`;
    return `<g ${o.ghost ? 'opacity=".5"' : ""}><g fill="${o.ghost ? "none" : c}" stroke="${c}" stroke-linecap="round" stroke-linejoin="round" ${o.ghost ? 'stroke-dasharray="3 6"' : ""}>
      <path d="M${x - sw} ${sh}L${x + sw} ${sh}L${x + hw} ${hip}L${x - hw} ${hip}z" stroke-width="${o.ghost ? 1.5 : aw}"/>
      <path d="M${x - sw} ${sh}L${x - sw - H * .035} ${hip + H * .1}M${x + sw} ${sh}L${x + sw + H * .035} ${hip + H * .1}M${x - hw * .55} ${hip}L${x - hw * .75} ${BASE - aw / 2}M${x + hw * .55} ${hip}L${x + hw * .75} ${BASE - aw / 2}" stroke-width="${o.ghost ? 1.5 : aw}" fill="none"/>
      <path d="M${x} ${hy + hr}L${x} ${sh}" stroke-width="${o.ghost ? 1.5 : aw * .9}"/></g>${o.ghost ? `<ellipse cx="${x}" cy="${hy}" rx="${hr}" ry="${hr * 1.15}" fill="none" stroke="${c}" stroke-dasharray="3 6"/>` : head}${(o.extra || (() => ""))(x, top, hr, hy, H, sh, hip)}
      <text x="${x}" y="${BASE + 30}" text-anchor="middle" font-family="Instrument Serif,Georgia,serif" font-size="25" fill="#e8ecf5">${o.n}</text>
      <text x="${x}" y="${BASE + 50}" text-anchor="middle" font-family="Geist Mono,monospace" font-size="11" letter-spacing="1.4" fill="#8d96ab">${o.h}</text></g>`;
  };
  const eyes = (dx, rx, ry, rot) => (x, top, hr, hy) => `<ellipse cx="${x - hr * dx}" cy="${hy + hr * .2}" rx="${hr * rx}" ry="${hr * ry}" fill="#05070c" transform="rotate(${rot} ${x - hr * dx} ${hy + hr * .2})"/><ellipse cx="${x + hr * dx}" cy="${hy + hr * .2}" rx="${hr * rx}" ry="${hr * ry}" fill="#05070c" transform="rotate(${-rot} ${x + hr * dx} ${hy + hr * .2})"/>`;
  const figs = [
    [90, 3, { n: "Little men", h: "UNDER 3 FT", head: .17, sw: .13, hw: .1, limb: .07, c: "#b9f0dc", extra: (x, top, hr, hy) => `<path d="M${x - hr} ${hy - hr * .3}l${-hr * .9} ${-hr * .9}l${hr * .5} ${hr * 1.2}zM${x + hr} ${hy - hr * .3}l${hr * .9} ${-hr * .9}l${-hr * .5} ${hr * 1.2}z" fill="#b9f0dc"/>` + eyes(.42, .26, .26, 0)(x, top, hr, hy) }],
    [220, 4, { n: "Grey", h: "3.5 TO 4.5 FT", head: .13, hwid: 1.05, sw: .085, hw: .06, limb: .035, c: "#aeb6c6", extra: eyes(.45, .36, .22, 24) }],
    [350, 5.75, { n: "You", h: "5 FT 9 IN", head: .065, sw: .12, hw: .085, limb: .05, c: "#8d96ab", ghost: true }],
    [490, 6.5, { n: "Nordic", h: "6 TO 7 FT", head: .062, sw: .125, hw: .085, limb: .05, c: "#f1e3c2", extra: (x, top, hr, hy, H, sh) => `<path d="M${x - hr * 1.05} ${hy - hr * .5}Q${x - hr * 1.9} ${sh} ${x - hr * 1.5} ${sh + H * .09}M${x + hr * 1.05} ${hy - hr * .5}Q${x + hr * 1.9} ${sh} ${x + hr * 1.5} ${sh + H * .09}" stroke="#e7c873" stroke-width="${hr * .55}" fill="none" stroke-linecap="round"/>` }],
    [630, 6.5, { n: "Mantis", h: "6 TO 7 FT", head: .05, tri: true, sw: .075, hw: .05, limb: .024, c: "#9bd08a", extra: (x, top, hr) => `<path d="M${x - hr * .6} ${top + hr * .2}Q${x - hr * 2.4} ${top - hr * 2.4} ${x - hr * 3.4} ${top - hr * 1.4}M${x + hr * .6} ${top + hr * .2}Q${x + hr * 2.4} ${top - hr * 2.4} ${x + hr * 3.4} ${top - hr * 1.4}" stroke="#9bd08a" stroke-width="2" fill="none"/><ellipse cx="${x - hr * .85}" cy="${top + hr * .75}" rx="${hr * .5}" ry="${hr * .3}" fill="#05070c" transform="rotate(28 ${x - hr * .85} ${top + hr * .75})"/><ellipse cx="${x + hr * .85}" cy="${top + hr * .75}" rx="${hr * .5}" ry="${hr * .3}" fill="#05070c" transform="rotate(-28 ${x + hr * .85} ${top + hr * .75})"/>` }],
    [765, 7, { n: "Reptilian", h: "6 TO 8 FT", head: .066, sw: .15, hw: .1, limb: .06, c: "#c9a25c", extra: (x, top, hr, hy, H, sh, hip) => `<path d="M${x + H * .08} ${hip}Q${x + H * .24} ${BASE - H * .1} ${x + H * .1} ${BASE - 6}Q${x + H * .2} ${BASE - 2} ${x + H * .3} ${BASE - 10}" stroke="#c9a25c" stroke-width="${H * .03}" fill="none" stroke-linecap="round"/><path d="M${x - hr * .5} ${top + 2}l${hr * .25} ${-hr * .6}l${hr * .25} ${hr * .5}l${hr * .25} ${-hr * .6}l${hr * .25} ${hr * .6}" stroke="#c9a25c" stroke-width="2" fill="none"/>` + eyes(.42, .3, .1, 0)(x, top, hr, hy) }],
    [930, 7.5, { n: "Tall White", h: "UP TO 8 FT", head: .062, sw: .095, hw: .065, limb: .034, c: "#eef3ff", extra: (x, top, hr, hy) => `<ellipse cx="${x - hr * .42}" cy="${hy + hr * .15}" rx="${hr * .34}" ry="${hr * .2}" fill="#6db6ff" transform="rotate(16 ${x - hr * .42} ${hy})"/><ellipse cx="${x + hr * .42}" cy="${hy + hr * .15}" rx="${hr * .34}" ry="${hr * .2}" fill="#6db6ff" transform="rotate(-16 ${x + hr * .42} ${hy})"/>` }]
  ];
  let grid = "";
  for (let f = 1; f <= 8; f++) grid += `<path d="M30 ${BASE - f * FT}H${W - 46}" stroke="rgba(190,210,255,.14)" stroke-dasharray="${f % 2 ? "2 8" : "0"}"/><text x="${W - 40}" y="${BASE - f * FT + 4}" font-family="Geist Mono,monospace" font-size="11" fill="#8d96ab">${f} FT</text>`;
  $("#lineup").innerHTML = `<svg viewBox="0 0 ${W} 540" role="img" aria-label="Height comparison of seven reported being types against an average human"><path d="M30 ${BASE}H${W - 46}" stroke="rgba(190,210,255,.4)"/>${grid}${figs.map(([x, ft, o]) => fig(x, ft, o)).join("")}</svg>`;
})();

window.BEINGS.forEach(b => {
  const im = window.BEING_IMG[b.g];
  const art = h("div", { class: "art", html: svg("0 0 120 140", BEING_G[b.g] || "") });
  if (im) art.append(h("img", { src: cImg(im[0], 600), alt: b.n, loading: "lazy", onerror: e => e.target.remove() }), h("a", { class: "src", style: "position:absolute;right:8px;top:8px;z-index:3;font:500 10px var(--mono);color:#dfe6f5;background:rgba(6,8,14,.6);padding:4px 6px;border-radius:5px", href: cPage(im[0]), target: "_blank", rel: "noopener", text: "Commons · " + im[1] }));
  $("#beingsGrid").append(h("article", { class: "unit" }, art, h("div", { class: "body" }, h("span", { class: "mono", text: b.tag }), h("h3", { text: b.n }),
    more("Profile", dl([["Look", b.look], ["Behaviour", b.does], ["Said to come from", b.from], ["Key cases", b.cases], ["Reality check", b.check, true]])))));
});
window.CRAFT.forEach(c => $("#craftGrid").append(h("article", { class: "unit" }, h("div", { class: "art wide", html: svg("0 0 200 120", CRAFT_G[c.g] || "") }), h("div", { class: "body" }, h("span", { class: "mono", text: c.size }), h("h3", { text: c.n }),
  more("Profile", dl([["How it behaves", c.how], ["Key cases", c.cases], ["Often turns out to be", c.alike, true]]))))));
window.OBSERVABLES.forEach((o, i) => $("#obs").append(h("div", {}, h("b", { text: String(i + 1) }), h("h4", { text: o.n }), h("p", { text: o.t }))));
$("#obsVid").append(mediaFrame([window.SECTION_VIDEO.observables], "5", "var(--sig)"), mediaFrame([["i", "USS Nimitz 2004 tic tac UFO.jpg", "Artist's reconstruction of the 2004 Nimitz encounter", "CC BY-SA 4.0"]], "2004", "var(--sig)"));

window.ORIGINS.forEach(o => $("#originGrid").append(h("article", { class: "unit" }, h("div", { class: "body" }, h("span", { class: "mono", text: o.k }), h("h3", { text: o.n }), h("p", { style: "font-size:14.5px;color:#d5dbea;margin-top:4px", text: o.idea }),
  more("For and against", dl([["Best argument", o.best], ["Hardest problem", o.hard, true], ["Who argues it", o.who]]))))));

/* ───────── Drake calculator ───────── */
(() => {
  const D = window.DRAKE, box = $("#drake"), vals = {};
  const toV = (t, x) => t.log ? t.min * Math.pow(t.max / t.min, x / 1000) : t.min + (t.max - t.min) * x / 1000;
  const toX = (t, v) => Math.round(t.log ? 1000 * Math.log(v / t.min) / Math.log(t.max / t.min) : 1000 * (v - t.min) / (t.max - t.min));
  const fmt = v => v >= 1e9 ? (v / 1e9).toFixed(1).replace(/\.0$/, "") + " billion" : v >= 1e6 ? (v / 1e6).toFixed(1).replace(/\.0$/, "") + " million" : v >= 100 ? Math.round(v).toLocaleString("en-US") : v >= 10 ? v.toFixed(0) : v >= 1 ? v.toFixed(1).replace(/\.0$/, "") : v >= 0.01 ? v.toFixed(2) : v.toExponential(1).replace("e-", " × 10⁻").replace(/⁻(\d+)/, (m, d) => "⁻" + d.split("").map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[c]).join(""));
  const presets = h("div", { class: "presets" });
  box.append(h("div", { class: "eq", html: "N = <i>R*</i> · <i>f<sub>p</sub></i> · <i>n<sub>e</sub></i> · <i>f<sub>l</sub></i> · <i>f<sub>i</sub></i> · <i>f<sub>c</sub></i> · <i>L</i>" }), presets);
  const outs = {}, ins = {};
  D.terms.forEach(t => {
    ins[t.id] = h("input", { type: "range", id: "dr-" + t.id, min: 0, max: 1000, step: 1, oninput: e => { vals[t.id] = toV(t, +e.target.value); calc(); } });
    outs[t.id] = h("output", { for: "dr-" + t.id });
    box.append(h("div", { class: "sl" }, h("b", { text: t.sym }), h("label", { for: "dr-" + t.id, text: t.n }), outs[t.id], ins[t.id], h("small", { text: t.note })));
  });
  const N = h("b"), Ns = h("span");
  box.append(h("div", { class: "N" }, N, Ns));
  function calc() {
    let n = 1; D.terms.forEach(t => { n *= vals[t.id]; outs[t.id].textContent = fmt(vals[t.id]); });
    N.textContent = fmt(n);
    Ns.textContent = n >= 1 ? "civilisations we could detect in the Milky Way right now." : "in this galaxy. On these numbers we are probably alone in it, with one such civilisation per " + fmt(1 / n) + " galaxies.";
  }
  function apply(p, btn) { D.terms.forEach(t => { vals[t.id] = p.v[t.id]; ins[t.id].value = toX(t, p.v[t.id]); }); presets.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", b === btn ? "true" : "false")); calc(); }
  D.presets.forEach((p, i) => { const b = h("button", { type: "button", class: "chip plain", title: p.note, text: p.n, onclick: () => apply(p, b) }); presets.append(b); if (i === 0) apply(p, b); });
})();
["drake", "fermi", "zoo"].forEach(k => $("#mathVid").append(mediaFrame([window.SECTION_VIDEO[k]], "N", "var(--amber)")));
window.FERMI.forEach(f => {
  const u = h("article", { class: "unit", style: f.star ? "border-color:var(--amber)" : null },
    f.star ? mediaFrame([window.SECTION_VIDEO.zooArt], "Zoo", "var(--amber)") : null,
    h("div", { class: "body" }, h("span", { class: "mono", style: f.star ? "color:var(--amber)" : null, text: f.k + (f.star ? " · where this page ends up" : "") }), h("h3", { text: f.n }),
      more("The idea and its problem", h("p", { style: "font-size:14.5px;color:#d5dbea;margin-top:10px", text: f.t }), dl([["The problem", f.x, true]]))));
  $("#fermiGrid").append(u);
});

/* ───────── retrievals, physics, voices ───────── */
window.RETRIEVALS.forEach(r => $("#retRows").append(h("div", { class: "rw", style: `--c:${tierColor(r.k)}` }, h("b", { text: r.y }), h("span", { text: r.who }), h("span", { text: r.what }), h("span", {}, h("span", { class: "chip t-" + r.k, style: "margin-bottom:6px", text: TIER[r.k].name }), h("br"), r.st))));
window.PHYSICS.forEach(p => $("#physics").append(h("details", {}, h("summary", { text: p.n }), h("p", { text: p.t }))));
const groups = {};
window.VOICES.forEach(v => (groups[v.c] = groups[v.c] || []).push(v));
for (const g in groups) $("#voiceGroups").append(h("div", { class: "vgroup" }, h("h3", { text: g }), h("div", { class: "people" }, groups[g].map(v => h("details", {}, h("summary", {}, h("b", { text: v.n }), h("span", { text: v.r })), h("p", { text: v.t }), h("div", { class: "links" }, ext("Watch interviews", ytFind(v.n + " UAP interview")), ext("Background", wiki(v.n))))))));
$("#voiceGroups").prepend(h("div", { class: "split" }, mediaFrame([window.SECTION_VIDEO.vallee], "Vallée", "var(--sig)"), mediaFrame([["y", "RBAISwCZ2v0", "David Grusch, the first interview"]], "Grusch", "var(--sig)")));

/* ───────── thesis and films ───────── */
function filmStrip() {
  const strip = h("div", { class: "films", style: "padding-left:0;padding-right:0" });
  window.FILMS.forEach((f, i) => {
    const frame = h("div", { class: "media" }), id = window.FILM_YT[f.y];
    const face = h("a", { class: "face", href: id ? "https://www.youtube.com/watch?v=" + id : ytFind(f.n + " official trailer"), target: "_blank", rel: "noopener", "aria-label": "Play trailer: " + f.n },
      h("div", { class: "poster", style: `--h:${(205 + i * 31) % 360}` }, h("b", { text: String(f.y) }), h("div", {}, f.s ? h("span", { class: "mono", text: "Spielberg" }) : null, h("h3", { text: f.n }))), h("span", { class: "play" }));
    if (EMBED && id) face.addEventListener("click", ev => { ev.preventDefault(); frame.replaceChildren(h("iframe", { src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`, title: f.n + " trailer", allow: "autoplay; encrypted-media; picture-in-picture; fullscreen", allowfullscreen: true, referrerpolicy: "strict-origin-when-cross-origin" })); });
    frame.append(face);
    strip.append(h("div", { class: "film" }, frame, h("p", { text: f.t })));
  });
  return strip;
}
window.THESIS.forEach((t, i) => {
  const inset = i === 6 ? h("div", { class: "inset", style: "max-width:none" }, filmStrip()) : i === 0 ? h("div", { class: "inset" }, mediaFrame([["i", "Pieter Bruegel the Elder - The Fall of the Rebel Angels - Google Art Project.jpg", "Bruegel, The Fall of the Rebel Angels, 1562", "PD"]], "I", "var(--amber)")) : i === 3 ? h("div", { class: "inset" }, mediaFrame([window.SECTION_VIDEO.zoo], "IV", "var(--amber)")) : null;
  $("#thesisList").append(h("div", { class: "th" }, h("b", { text: String(i + 1) }), h("div", {}, h("h3", { text: t.n }), h("p", { class: "say", text: t.t }), inset,
    more("What supports it, and what would break it", h("div", {}, h("p", {}, h("b", { text: "What supports it" }), t.f), h("p", {}, h("b", { text: "What cuts against it" }), t.x))))));
});

/* ───────── library ───────── */
for (const k in window.LIBRARY) $("#lib").append(h("div", {}, h("h3", { text: k }), h("ul", {}, window.LIBRARY[k].map(([t, d]) => h("li", {}, h("a", { href: (k === "Read" ? "https://www.google.com/search?tbm=bks&q=" : "https://www.youtube.com/results?search_query=") + encodeURIComponent(t.replace(/\(.*?\)/g, "")), target: "_blank", rel: "noopener", text: t }), h("span", { text: d }))))));
$("#lib").append(h("div", {}, h("h3", { text: "Primary sources" }), h("ul", {}, window.SOURCES.map(([t, u]) => h("li", {}, h("a", { href: u, target: "_blank", rel: "noopener", text: t + " ↗" }))))));
$("#lib").prepend(h("div", {}, mediaFrame([window.SECTION_VIDEO.phenomenon], "Film", "var(--sig)"), h("div", { style: "height:14px" }), mediaFrame([window.SECTION_VIDEO.gobekli], "Dig", "var(--sig)")));

/* ───────── nav, progress, reveal ───────── */
const links = [...document.querySelectorAll("#pill a")];
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { links.forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id)); const on = $("#pill a.on"); if (on) on.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" }); } }), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach(s => io.observe(s));
const prog = $("#prog");
addEventListener("scroll", () => { const d = document.documentElement; prog.style.width = (100 * d.scrollTop / Math.max(1, d.scrollHeight - d.clientHeight)) + "%"; }, { passive: true });
if (!matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); rv.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".head, .facts, .two, .th, .drake, .rows").forEach(el => { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add("rv"); rv.observe(el); } });
}

/* ───────── hero sky (WebGL) ───────── */
(() => {
  const c = $("#sky"); let gl;
  try { gl = c.getContext("webgl", { antialias: false, alpha: false }); } catch (e) {}
  if (!gl) { c.remove(); return; }
  const vs = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  const fs = `precision highp float;uniform vec2 r;uniform float t;uniform vec2 m;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*noise(p);p=p*2.03+vec2(17.1,3.7);a*=.5;}return s;}
void main(){vec2 uv=(gl_FragCoord.xy-.5*r)/r.y;uv+=m*.03;float rad=length(uv)+1e-4;vec2 dir=uv/rad;
float depth=.42/rad+t*.05;vec2 p=dir*(1.7+.3*sin(depth*.6))+vec2(depth*.9,depth*.55);
float sw=fbm(p*1.25+vec2(0.,t*.012));float w=fbm(p*1.9+sw*1.8);float cloud=smoothstep(.36,.84,w);
vec3 col=mix(vec3(.012,.026,.07),vec3(.12,.24,.46),cloud);col=mix(col,vec3(.74,.86,1.),pow(cloud,3.)*.8);
float warm=smoothstep(-.05,.95,dot(dir,normalize(vec2(.85,-.52))))*cloud;col=mix(col,vec3(1.,.6,.3)*(.45+w),warm*.6);
col*=mix(.03,1.,smoothstep(.03,.55,rad));
vec2 g=uv*95.;float s=hash(floor(g));float star=step(.986,s)*smoothstep(.14,0.,length(fract(g)-.5))*(.55+.45*sin(t*1.4+s*40.));
col+=star*(1.-cloud*.85)*vec3(.9,.95,1.);col*=1.-.3*dot(uv,uv);col+=(hash(gl_FragCoord.xy+t)-.5)*.022;
gl_FragColor=vec4(pow(max(col,0.),vec3(.92)),1.);}`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { c.remove(); return; }
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const ur = gl.getUniformLocation(pr, "r"), ut = gl.getUniformLocation(pr, "t"), um = gl.getUniformLocation(pr, "m");
  let mx = 0, my = 0, visible = true, raf = 0;
  const size = () => { const k = Math.min(devicePixelRatio || 1, 1.5) * .6; c.width = Math.max(2, c.clientWidth * k | 0); c.height = Math.max(2, c.clientHeight * k | 0); gl.viewport(0, 0, c.width, c.height); };
  size(); addEventListener("resize", size);
  addEventListener("pointermove", e => { mx = e.clientX / innerWidth - .5; my = .5 - e.clientY / innerHeight; }, { passive: true });
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const draw = ms => { gl.uniform2f(ur, c.width, c.height); gl.uniform1f(ut, still ? 12 : 12 + ms / 1000); gl.uniform2f(um, mx, my); gl.drawArrays(gl.TRIANGLES, 0, 3); if (visible && !still) raf = requestAnimationFrame(draw); };
  new IntersectionObserver(es => { visible = es[0].isIntersecting; cancelAnimationFrame(raf); if (visible) raf = requestAnimationFrame(draw); }).observe(c);
  draw(0);
})();
})();
