/* MTsN 1 Kota Semarang — Service Worker (PWA offline) */
const CACHE = 'mtsn1-v1';
const CORE = [
  './',
  './index.html',
  './profil.html',
  './program.html',
  './berita.html',
  './prestasi.html',
  './fasilitas.html',
  './ppdb.html',
  './kontak.html',
  './kebijakan.html',
  './css/style.css',
  './js/main.js',
  './manifest.webmanifest',
  './assets/logo.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/data/agenda.json',
  './assets/data/ppdb.json',
  './assets/data/prestasi.json',
  './assets/data/guru.json',
  './assets/data/alumni.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(request, { ignoreSearch: true }).then((hit) => {
      const net = fetch(request).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
