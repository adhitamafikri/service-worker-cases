var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const expectedCaches = ["static-v2"];
function precacheResources() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cache = yield caches.open("static-v2");
            // cache.addAll(["/mouse.svg"]);
            cache.addAll(["/camel.svg", "/elephant.svg"]);
        }
        catch (error) {
            console.error("Failed to precache resources:", error);
        }
    });
}
function clearUnusedCaches() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cacheKeys = yield caches.keys();
            Promise.all(cacheKeys.map((key) => {
                if (!expectedCaches.includes(key)) {
                    return caches.delete(key);
                }
            }));
            console.log("v2 now ready to handle fetches guys!");
        }
        catch (error) {
            console.error("Failed to clear unused caches:", error);
        }
    });
}
function putInCache() { }
self.addEventListener("install", (event) => {
    console.log("v2 installing…");
    // execute precaching logic while installing the Service Worker
    event.waitUntil(precacheResources());
});
self.addEventListener("activate", (event) => {
    // Make sure that previous version of caches are cleared
    // We will only serve cached resources that are listed in expectedCaches
    event.waitUntil(clearUnusedCaches());
});
self.addEventListener("fetch", (event) => __awaiter(this, void 0, void 0, function* () {
    console.log("from the service worker fetch event: ", event);
    const url = new URL(event.request.url);
    if (url.origin == location.origin) {
        if (url.pathname == "/sheep.svg") {
            event.respondWith(caches.match("/camel.svg"));
        }
        if (url.pathname == "/mouse.svg") {
            event.respondWith(caches.match("/elephant.svg"));
        }
    }
}));
