// ST Trip：画面を保存しておく（旅先で電波がなくても開ける）。データは IndexedDB に
const CACHE = "st-trip-6";
const CORE = ["./", "index.html", "trip.js", "trip.css", "manifest.webmanifest", "icon-180.png", "icon-192.png", "ic/add.png", "ic/app.png", "ic/home.png", "ic/hotel.png", "ic/memo.png", "ic/pack.png", "ic/photo.png", "ic/place.png", "ic/plan.png", "ic/resv.png", "ic/set.png", "ic/train.png", "ui/bg.jpg", "ui/board.png", "ui/btn-sm.png", "ui/btn.png", "ui/card-on.png", "ui/card.png", "ui/fab.png", "ui/gate.png", "ui/gate-open.png", "ui/header.png", "ui/panel.png", "ui/tabbar.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("st-trip-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open("st-trip-fonts").then(async (c) => (await c.match(e.request)) || fetch(e.request).then((r) => { c.put(e.request, r.clone()); return r; })));
    return;
  }
  if (u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); } return r; }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((h) => h || caches.match("index.html"))));
});
