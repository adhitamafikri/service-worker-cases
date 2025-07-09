const SW_VERSION = "v1.0.0";
const expectedCaches = ["static-v1"];

async function precacheResources() {
  try {
    const cache = await caches.open("static-v1");
    // cache.addAll(["/mouse.svg"]);
    cache.addAll(["/camel.svg", "/elephant.svg"]);
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
    console.log("v2 now ready to handle fetches guys!");
  } catch (error) {
    console.error("Failed to clear unused caches:", error);
  }
}

function putInCache() {}

self.addEventListener("install", (event: ExtendableEvent) => {
  console.log("v2 installing…");

  // execute precaching logic while installing the Service Worker
  event.waitUntil(precacheResources());
});

self.addEventListener("activate", (event: ExtendableEvent) => {
  // Make sure that previous version of caches are cleared
  // We will only serve cached resources that are listed in expectedCaches
  event.waitUntil(clearUnusedCaches());
});

self.addEventListener("fetch", async (event: FetchEvent) => {
  console.log("from the service worker fetch event: ", event.request.url);
  const url = new URL(event.request.url);

  if (url.origin == location.origin) {
    if (url.pathname == "/sheep.svg") {
      event.respondWith(caches.match("/camel.svg"));
    }
    if (url.pathname == "/mouse.svg") {
      event.respondWith(caches.match("/elephant.svg"));
    }
  }
});

self.addEventListener("message", (event: ExtendableMessageEvent) => {
  if (event.data.type === "GET_VERSION") {
    event.ports[0].postMessage(SW_VERSION);
  }
});
