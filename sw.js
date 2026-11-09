const CACHE="milk-meadow-v3.2.4-bfe38502dfdd";
const FILES=["./", "./app.mjs", "./assets/Jua-Regular.ttf", "./assets/buildings-2d.png", "./assets/classic/cow-0.png", "./assets/classic/cow-1.png", "./assets/classic/cow-2.png", "./assets/classic/cow-3.png", "./assets/classic/cow-4.png", "./assets/classic/cow-5.png", "./assets/classic/pasture.webp", "./assets/classic/product-0.png", "./assets/classic/product-1.png", "./assets/classic/product-2.png", "./assets/classic/product-3.png", "./assets/classic/product-4.png", "./assets/classic/product-5.png", "./assets/classic/prop-0.png", "./assets/classic/prop-1.png", "./assets/classic/prop-10.png", "./assets/classic/prop-11.png", "./assets/classic/prop-2.png", "./assets/classic/prop-3.png", "./assets/classic/prop-4.png", "./assets/classic/prop-5.png", "./assets/classic/prop-6.png", "./assets/classic/prop-7.png", "./assets/classic/prop-8.png", "./assets/classic/prop-9.png", "./assets/cows-2d.png", "./assets/cows-live-2d.png", "./assets/cows-walk-2d.png", "./assets/farm.png", "./assets/fonts/LINESeedKR-Bd.woff2", "./assets/fonts/LINESeedKR-Rg.woff2", "./assets/icon-180.png", "./assets/icon-192.png", "./assets/icon-2d.png", "./assets/icon-512.png", "./assets/props-2d.png", "./assets/ranch-2d.png", "./assets/terrain-2d.png", "./business.mjs", "./classic-app.mjs", "./classic-core.mjs", "./classic.css", "./core.mjs", "./expanded.html", "./index.html", "./live.mjs", "./manifest.webmanifest", "./map.mjs", "./phaser.min.js", "./save-queue.mjs", "./scene.mjs", "./style.css"];

self.addEventListener('install', event => event.waitUntil(
  caches.open(CACHE).then(cache => cache.addAll(FILES.map(url =>
    new Request(url, {cache: 'reload'})))).then(() => self.skipWaiting())
));
self.addEventListener('activate', event => event.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(key =>
    key.startsWith('milk-meadow-') && key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim())
));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if(event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if(url.pathname.endsWith('/update.html') || url.pathname.endsWith('/sw.js')) {
    event.respondWith(fetch(event.request, {cache: 'no-store'})); return;
  }
  event.respondWith(caches.open(CACHE).then(cache => cache.match(event.request))
    .then(hit => hit || fetch(event.request).catch(() => {
      if(event.request.mode === 'navigate') return caches.open(CACHE).then(cache => cache.match('./index.html'));
      return Response.error();
    })));
});
self.addEventListener('message', event => {
  if(event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
