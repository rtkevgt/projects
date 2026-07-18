// Service Worker mínimo — necesario para que el navegador permita instalar la app.
// No hace caché agresivo de contenido para evitar que Ángela vea versiones desactualizadas
// después de que se le hagan cambios al panel.

const CACHE_NAME = "estudio-lash-admin-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Estrategia: siempre intenta ir a la red primero (para que los cambios se vean de inmediato).
// Si no hay conexión, intenta servir desde caché como respaldo básico.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
