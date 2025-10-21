const cacheName = 'diario-de-bordo-v3';

const urlsCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/icons/icon192.png',
    '/icons/icon512.png',
    '/icons/favicon.ico',
    '/manifest.json'
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        console.log('Service Worker instalado com sucesso!'),
        caches.open(cacheName).then((cache) => cache.addAll(urlsCache))
    )
});
self.addEventListener('fetch', (event) => {
    console.log('fazendo fetch');

    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        console.log('Service Worker ativado com sucesso!'),
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.filter((name) => name !== cacheName).map((name) => caches.delete(name))
        ))
    )
});
