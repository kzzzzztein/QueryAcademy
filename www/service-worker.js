// Service worker for query.academy - caches the local app shell (HTML/CSS/JS
// content files + icons) so the app opens instantly and works offline once
// visited, without touching CDN resources (Pyodide, sql.js, CodeMirror, etc.
// - those are large, already versioned in their own URLs, and better left to
// the browser's normal HTTP cache) or api/*.php calls (always dynamic/
// session-dependent, never safe to cache).
//
// CACHE_VERSION is tied to the same ?v= number used elsewhere in this
// project (see index.html) - bump it on every deploy, same as those, and
// old caches get cleaned up automatically on the next visit.
const CACHE_VERSION = "v31";
const CACHE_NAME = `query-academy-${CACHE_VERSION}`;

const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./data.js",
  "./manifest.json",
  "./csharp-content-entry.js",
  "./csharp-content-pro.js",
  "./csharp-content-master.js",
  "./python-content-entry.js",
  "./python-content-pro.js",
  "./python-content-master.js",
  "./excel-content-entry.js",
  "./excel-content-pro.js",
  "./excel-content-master.js",
  "./cloud-content-entry.js",
  "./cloud-content-pro.js",
  "./cloud-content-master.js",
  "./powerbi-content-entry.js",
  "./powerbi-content-pro.js",
  "./powerbi-content-master.js",
  "./javascript-content-entry.js",
  "./javascript-content-pro.js",
  "./javascript-content-master.js",
  "./api-content-entry.js",
  "./api-content-pro.js",
  "./api-content-master.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only handle same-origin GET requests - everything else (CDN scripts,
  // fonts, and every api/*.php call) passes straight through to the network.
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.includes("/api/")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached); // offline and not cached - nothing more to do

      // Stale-while-revalidate: serve the cached app shell instantly if we
      // have it, and quietly refresh the cache in the background - the ?v=
      // query strings already change on every real deploy, so this stays
      // correct without needing a hard cache-first/network-first choice.
      return cached || network;
    })
  );
});
