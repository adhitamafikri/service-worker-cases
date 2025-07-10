import { registerRoute, Route } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

const SW_VERSION = "v1.0.0";
const cacheNames = {
  images: `images-${SW_VERSION}`,
  scripts: `scripts-${SW_VERSION}`,
  styles: `styles-${SW_VERSION}`,
};

// Define route for caching images
// const imageRoute = new Route(
//   ({ request }) => request.destination === "image",
//   new NetworkFirst({
//     cacheName: cacheNames.images,
//     plugins: [
//       new ExpirationPlugin({
//         maxAgeSeconds: 60 * 5, // 5 minutes
//       }),
//     ],
//   })
// );

// Define route for caching scripts
const scriptsRoute = new Route(
  ({ request }) => request.destination === "script",
  new NetworkFirst({
    cacheName: cacheNames.scripts,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50, // Limit to 50 scripts
        maxAgeSeconds: 60 * 60 * 24, // 1 day
      }),
    ],
  })
);

// Define route for caching styles
const stylesRoute = new Route(
  ({ request }) => request.destination === "style",
  new NetworkFirst({
    cacheName: cacheNames.styles,
  })
);

// register the routes
// These routes will handle requests for images, scripts, and styles
// registerRoute(imageRoute);
registerRoute(scriptsRoute);
registerRoute(stylesRoute);

// Precache particular resources during the install phase
async function precacheResources() {
  try {
    const cache = await caches.open(cacheNames.images);
    cache.addAll(["/camel.svg", "/elephant.svg"]);
  } catch (error) {
    console.error("Failed to precache resources:", error);
  }
}

// We want to clear any caches that were used by previous versions of the Service Worker
async function clearUnusedCaches() {
  try {
    const cacheKeys = await caches.keys();
    const expectedCaches = Object.values(cacheNames);
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
  console.log("from the service worker fetch event new URL(): ", url.pathname);

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
