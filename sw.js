const CACHE='milk-meadow-v2.1.6';
const FILES=['./','./index.html','./style.css','./app.mjs','./core.mjs','./business.mjs','./map.mjs','./scene.mjs','./phaser.min.js','./cows-walk-2d.png','./live.mjs','./cows-live-2d.png','./terrain-2d.png','./props-2d.png','./Jua-Regular.ttf','./buildings-2d.png','./manifest.webmanifest','./icon-2d.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('milk-meadow-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).catch(()=>{if(e.request.mode==='navigate')return caches.match('./index.html');return Response.error();})));});

self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting();});
