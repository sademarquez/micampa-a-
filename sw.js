const CACHE_NAME = 'mi-campana-ia-cache-v1'; // Nombre de caché actualizado
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
  // Los assets de esm.sh son cacheados por el navegador y el propio CDN.
  // Tailwind es CDN.
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto: ', CACHE_NAME);
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => {
        console.error('Fallo al cachear durante la instalación:', err);
      })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  // Estrategia: Network falling back to cache para navegación. Cache first para assets.
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
        .then(response => response || caches.match('/index.html')) // Fallback general a index.html para SPAs
        .catch(() => new Response("Estás offline. No se pudo cargar la página.", { headers: { 'Content-Type': 'text/html' } }))
    );
  } else if (URLS_TO_CACHE.includes(event.request.url) || URLS_TO_CACHE.includes(new URL(event.request.url).pathname)) {
    // Cache First para assets estáticos pre-cacheados
     event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(networkResponse => {
                // Opcional: cachear dinámicamente nuevos assets si es necesario
                // if (networkResponse && networkResponse.status === 200) {
                //   const responseToCache = networkResponse.clone();
                //   caches.open(CACHE_NAME).then(cache => {
                //     cache.put(event.request, responseToCache);
                //   });
                // }
                return networkResponse;
            });
        }).catch(() => {
             if (event.request.destination === 'image') {
                // Podría retornar un placeholder SVG para imágenes offline
             }
             // Para otros assets, simplemente fallar si no está en caché y la red falla.
        })
    );
  } else {
    // Para todas las demás peticiones (ej. APIs, CDNs externos), ir a la red.
    // No intentar cachear respuestas de API por defecto en este SW básico.
    event.respondWith(fetch(event.request).catch(() => {
        // Podría retornar un JSON de error estándar para fallos de API si es relevante
        return new Response(JSON.stringify({ error: "Conexión de red perdida" }), { headers: { 'Content-Type': 'application/json' }});
    }));
  }
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Borrando caché antiguo: ', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'Nueva Notificación Mi Campaña', body: 'Tienes una nueva actualización de Mi Campaña IA.' };
  const title = data.title;
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png' // Opcional: para la barra de notificaciones de Android
  };
  event.waitUntil(self.registration.showNotification(title, options));
});