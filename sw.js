const CACHE_NAME = 'mahaoffice-pwa-v2.4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './maha-logo.png',
  './maha-icon-512.png',
  'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => Promise.allSettled(ASSETS.map((u) => c.add(u)))));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))));
  self.clients.claim();
});

// Network-First: Always fetch latest update when online; serve cached copy when offline!
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((netRes) => {
        const copy = netRes.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, copy)).catch(() => {});
        return netRes;
      })
      .catch(() => caches.match(e.request))
  );
});
