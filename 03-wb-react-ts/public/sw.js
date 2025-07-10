const s = ["static-v2"];
async function a() {
  try {
    (await caches.open("static-v2")).addAll(["/camel.svg", "/elephant.svg"]);
  } catch (e) {
    console.error("Failed to precache resources:", e);
  }
}
async function t() {
  try {
    const e = await caches.keys();
    Promise.all(
      e.map((c) => {
        if (!s.includes(c))
          return caches.delete(c);
      })
    ), console.log("v2 now ready to handle fetches guys!");
  } catch (e) {
    console.error("Failed to clear unused caches:", e);
  }
}
self.addEventListener("install", (e) => {
  console.log("v2 installing…"), e.waitUntil(a());
});
self.addEventListener("activate", (e) => {
  e.waitUntil(t());
});
self.addEventListener("fetch", async (e) => {
  console.log("from the service worker fetch event: ", e);
  const c = new URL(e.request.url);
  c.origin == location.origin && (c.pathname == "/sheep.svg" && e.respondWith(caches.match("/camel.svg")), c.pathname == "/mouse.svg" && e.respondWith(caches.match("/elephant.svg")));
});
