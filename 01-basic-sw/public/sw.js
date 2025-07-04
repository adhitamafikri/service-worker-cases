var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const expectedCaches = ["static-v1"];
function precacheResources() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cache = yield caches.open("static-v1");
            cache.addAll(["/mouse.svg"]);
            // cache.addAll(["/camel.svg", "/elephant.svg"]);
        }
        catch (error) {
            console.error("Failed to precache resources:", error);
        }
        // return caches
        //   .open("static-v1")
        //   .then((cache) => {
        //     cache.addAll(["/mouse.svg"]);
        //     // cache.addAll(["/camel.svg", "/elephant.svg"]);
        //   })
        //   .catch((error) => );
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
            console.log("V1 now ready to handle fetches guys!");
        }
        catch (error) {
            console.error("Failed to clear unused caches:", error);
        }
    });
}
function putInCache() { }
self.addEventListener("install", (event) => {
    console.log("V1 installing…");
    // execute precaching logic while installing the Service Worker
    event.waitUntil(precacheResources());
});
self.addEventListener("activate", (event) => {
    // delete any caches that aren't in expectedCaches
    // which will get rid of static-v1
    // event.waitUntil(
    //   caches
    //     .keys()
    //     .then((keys) =>
    //       Promise.all(
    //         keys.map((key) => {
    //           if (!expectedCaches.includes(key)) {
    //             return caches.delete(key);
    //           }
    //         })
    //       )
    //     )
    //     .then(() => {
    //       console.log("V1 now ready to handle fetches guys!");
    //     })
    // );
    // Make sure that previous version of caches are cleared
    event.waitUntil(clearUnusedCaches());
});
self.addEventListener("fetch", (event) => __awaiter(this, void 0, void 0, function* () {
    console.log("from the service worker fetch event: ", event);
    const url = new URL(event.request.url);
    // serve the mouse SVG from the cache if the request is
    // same-origin and the path is '/sheep.svg'
    if (url.origin == location.origin && url.pathname == "/sheep.svg") {
        event.respondWith(caches.match("/mouse.svg"));
    }
}));
