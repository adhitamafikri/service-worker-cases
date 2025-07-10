export async function setupSW() {
  if ("serviceWorker" in navigator) {
    try {
      console.log("-----------------------------------");
      console.log("FROM THE PROJECT 03-wb-react-ts");
      console.log("-----------------------------------\n\n\n");

      const { Workbox } = await import("workbox-window");
      const wb = new Workbox("/sw.js");
      await wb.register();
      console.log("Workbox SW registered!", wb);

      const swVersion = await wb.messageSW({ type: "GET_VERSION" });
      console.log("Service Worker Version:", swVersion);

      const timeout = setTimeout(() => {
        const img1 = new Image();
        img1.src = "/sheep.svg";
        document.querySelector<HTMLDivElement>("#sw-img-1")!.appendChild(img1);

        const img2 = new Image();
        img2.src = "/mouse.svg";
        document.querySelector<HTMLDivElement>("#sw-img-2")!.appendChild(img2);
        clearTimeout(timeout);
      }, 3000);
    } catch (error) {
      console.error("Error loading Workbox:", error);
    }
  } else {
    console.warn("Service Worker is not supported in this browser.");
  }
}
