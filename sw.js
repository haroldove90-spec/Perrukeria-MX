const CACHE_NAME = 'la-perrukeria-mx-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.tsx',
  '/components/ClientView.tsx',
  '/components/AdminView.tsx',
  '/components/FloatingWhatsAppButton.tsx',
  '/hooks/useGeolocation.ts',
  'https://appdesignmex.com/perrukeriamx.png',
  'https://appdesignmex.com/dog01.png',
  'https://appdesignmex.com/dog02.png',
  'https://appdesignmex.com/dog03.png',
  'https://appdesignmex.com/dog04.png',
  'https://appdesignmex.com/dog05.png',
  'https://appdesignmex.com/dog06.png',
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Activate worker immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache).catch(err => {
            console.error('Failed to cache all urls:', err);
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200) {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(err => {
            console.error('Fetch failed:', err);
            // You can return a custom offline page here if you want
        });
      })
    );
});
