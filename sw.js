// =============================================================
//  Guarda la app en el teléfono/tablet para que funcione SIN internet.
//  Abre siempre al instante con la copia guardada y, si hay internet,
//  descarga la versión nueva en segundo plano (se ve al volver a abrir).
//
//  Al subir una versión nueva, cambia el nombre de CACHE (ej. v1-6).
//  Las ventas NO están aquí: viven en el teléfono y no se borran.
// =============================================================
const CACHE = 'caja-mmm-v1-7-pwa';
const FILES = [
  './', './index.html', './manifest.json', './instalar.js',
  './icon.svg', './icon-180.png', './icon-192.png', './icon-512.png', './icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const guardado = await c.match(req, { ignoreSearch: true })
      || (req.mode === 'navigate' ? await c.match('./index.html') : undefined);

    const deInternet = fetch(req).then(r => {
      if (r.ok) c.put(req, r.clone());
      return r;
    }).catch(() => undefined);

    if (guardado) {
      e.waitUntil(deInternet);          // actualiza en segundo plano
      return guardado;
    }
    return (await deInternet) || Response.error();
  })());
});
