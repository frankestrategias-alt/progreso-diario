const CACHE_NAME = 'networker-pro-v10-ultra';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json?v=2',
    '/index.css',
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.filter((name) => name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                );
            })
        ])
    );
});

self.addEventListener('fetch', (event) => {
    // Aggressive Network-First for navigation (HTML)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                    return response;
                })
                .catch(() => caches.match('/index.html'))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then(netResponse => {
                return caches.open(CACHE_NAME).then(cache => {
                    // Only cache GET requests and valid origins
                    if (event.request.method === 'GET' && event.request.url.startsWith('http')) {
                        cache.put(event.request, netResponse.clone());
                    }
                    return netResponse;
                });
            });
        })
    );
});
