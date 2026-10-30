// ST 司令室：画面だけ保存しておく（GitHub の情報は 毎回 その場で取りにいく）
const CACHE = "st-cmd-4";
const CORE = ["./", "index.html", "cmd.js", "cmd.css", "manifest.webmanifest", "icon-180.png", "icon-192.png", ...["skull","lock","run","apps","push","set","ok","ng","busy","play","refresh"].map((k) => `ic/${k}.png`), ...["bg-main.jpg","bg-lock.jpg","btn.png","btn-on.png","btn-sm.png","btn-ng.png","card.png","key.png","key-on.png","tabbar.png","header.png","pill-ok.png","pill-ng.png","pill-busy.png"].map((k) => `ui/${k}`)];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("st-cmd-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  // ネット優先（新しい版をすぐ使う）。つながらないときだけ 保存分
  e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); } return r; }).catch(() => caches.match(e.request, { ignoreSearch: true }).then((h) => h || caches.match("index.html"))));
});
