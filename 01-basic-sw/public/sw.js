self.addEventListener("install", (event) => {
  console.log("V1 installing…");

  // cache a mouse SVG
  event.waitUntil(
    caches.open("static-v1").then((cache) => cache.add("/mouse.svg"))
  );
});

self.addEventListener("activate", (event) => {
  console.log("V1 now ready to handle fetches!");
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // serve the sheep SVG from the cache if the request is
  // same-origin and the path is '/mouse.svg'
  if (url.origin == location.origin && url.pathname == "/sheep.svg") {
    event.respondWith(caches.match("/mouse.svg"));
  }
});
