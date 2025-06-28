export function setupSW() {
  if ("serviceWorker" in navigator) {
    // window.addEventListener("load", () => {
    //   navigator.serviceWorker
    //     .register("/sw.js")
    //     .then((registration) => {
    //       console.log(
    //         "Service Worker registered with scope:",
    //         registration.scope
    //       );
    //     })
    //     .catch((error) => {
    //       console.error("Service Worker registration failed:", error);
    //     });
    // });

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("SW registered!", reg, reg.scope))
      .catch((err) => console.log("Boo!", err));

    setTimeout(() => {
      const img = new Image();
      img.src = "/mouse.svg";
      document.querySelector<HTMLDivElement>("#sw-img")!.appendChild(img);
    }, 3000);
  } else {
    console.warn("Service Workers are not supported in this browser.");
  }
}
