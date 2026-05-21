const VERSION = '2.0';
const CACHE = 'v2motor-' + VERSION;
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// 回應版本查詢
self.addEventListener('message', e => {
  if (e.data === 'getVersion') {
    e.source.postMessage({ type: 'version', version: VERSION });
  }
  if (e.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
