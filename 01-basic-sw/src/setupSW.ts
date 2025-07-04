export function setupSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("SW registered!", reg, reg.scope))
      .catch((err) => console.log("Boo!", err));

    const timeout = setTimeout(() => {
      const img1 = new Image();
      img1.src = "/sheep.svg";
      document.querySelector<HTMLDivElement>("#sw-img-1")!.appendChild(img1);

      const img2 = new Image();
      img2.src = "/mouse.svg";
      document.querySelector<HTMLDivElement>("#sw-img-2")!.appendChild(img2);
      clearTimeout(timeout);
    }, 3000);
  } else {
    console.warn("Service Workers are not supported in this browser.");
  }
}
