const expectedCaches = ["static-v1"];

async function precacheResources() {
  try {
    const cache = await caches.open("static-v1");
    cache.addAll(["/mouse.svg"]);
    // cache.addAll(["/camel.svg", "/elephant.svg"]);
  } catch (error) {
    console.error("Failed to precache resources:", error);
  }
}

async function clearUnusedCaches() {
  try {
    const cacheKeys = await caches.keys();
    Promise.all(
      cacheKeys.map((key) => {
        if (!expectedCaches.includes(key)) {
          return caches.delete(key);
        }
      })
    );
    console.log("V1 now ready to handle fetches guys!");
  } catch (error) {
    console.error("Failed to clear unused caches:", error);
  }
}

function putInCache() {}

self.addEventListener("install", (event: ExtendableEvent) => {
  console.log("V1 installing…");

  // execute precaching logic while installing the Service Worker
  event.waitUntil(precacheResources());
});

self.addEventListener("activate", (event: ExtendableEvent) => {
  // Make sure that previous version of caches are cleared
  // We will only serve cached resources that are listed in expectedCaches
  event.waitUntil(clearUnusedCaches());
});

self.addEventListener("fetch", async (event: FetchEvent) => {
  console.log("from the service worker fetch event: ", event);
  const url = new URL(event.request.url);

  // serve the mouse SVG from the cache if the request is
  // same-origin and the path is '/sheep.svg'
  if (url.origin == location.origin && url.pathname == "/sheep.svg") {
    event.respondWith(caches.match("/mouse.svg"));
  }
});
