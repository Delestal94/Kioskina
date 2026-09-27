const CACHE_NAME = "kioskina-shell-v2";
const INITIAL_ASSETS = ["/", "/manifest.webmanifest", "/runtime-config.json", "/icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(INITIAL_ASSETS))
      .then(async () => {
        const cache = await caches.open(CACHE_NAME);
        const shell = await cache.match("/");
        if (!shell) throw new Error("No se encontró el shell de la aplicación.");
        const html = await shell.text();
        const assetUrls = [...new Set([...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
          .map((match) => match[1])
          .filter((value) => typeof value === "string" && /\.(?:js|css|svg|png|woff2)$/.test(new URL(value, self.location.origin).pathname))
          .map((value) => new URL(value, self.location.origin).href))];
        await cache.addAll(assetUrls);
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("kioskina-shell-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (url.pathname === "/runtime-config.json") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await (await caches.open(CACHE_NAME)).put(request, response.clone());
        }
        return response;
      } catch {
        return (await caches.match(request)) || Response.error();
      }
    })());
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok && response.type === "basic") {
          await (await caches.open(CACHE_NAME)).put("/", response.clone());
        }
        return response;
      } catch {
        return (await caches.match(new URL("/", self.location.origin))) || Response.error();
      }
    })());
    return;
  }

  const staticAsset = /\.(?:js|css|svg|png|woff2)$/.test(url.pathname) || url.pathname === "/manifest.webmanifest";
  if (!staticAsset) return;

  event.respondWith(
    caches.match(request).then(async (cached) => {
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok && response.type === "basic") {
        await (await caches.open(CACHE_NAME)).put(request, response.clone());
      }
      return response;
    }),
  );
});
