const CACHE = 'kioskina-app-v1';
const CORE = ['./', './manifest.webmanifest', './icon.svg'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const page = await fetch('./', { cache: 'reload' });
    if (!page.ok) throw new Error('No se pudo preparar la aplicación sin conexión.');
    await cache.put('./', page.clone());
    const html = await page.text();
    const assets = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^\"]+)"/g)].map(match => match[1]);
    await cache.addAll([...CORE.slice(1), ...assets]);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE && key.startsWith('kioskina-app-')) await caches.delete(key);
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && ['document', 'script', 'style', 'image', 'manifest'].includes(request.destination)) await cache.put(request, response.clone());
      return response;
    } catch {
      if (request.mode === 'navigate') return (await cache.match('./')) || Response.error();
      return Response.error();
    }
  })());
});
