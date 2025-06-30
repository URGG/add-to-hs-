const CACHE_NAME = 'leslie-card-v1';
const urlsToCache = [
  '/index.html',
  '/leslie-business-card/index.html',
  '/manifest.json',
  '/leslie-192.png',
  '/leslie-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.5.3/qrcode.min.js'
];

self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[ServiceWorker] Caching assets');
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // You can return a fallback page here if needed
      });
    })
  );
});