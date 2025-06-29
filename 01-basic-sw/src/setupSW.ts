export function setupSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("SW registered!", reg, reg.scope))
      .catch((err) => console.log("Boo!", err));

    const timeout = setTimeout(() => {
      const img = new Image();
      img.src = "/mouse.svg";
      document.querySelector<HTMLDivElement>("#sw-img")!.appendChild(img);
      clearTimeout(timeout);
    }, 3000);
  } else {
    console.warn("Service Workers are not supported in this browser.");
  }
}
