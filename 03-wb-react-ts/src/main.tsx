import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { setupSW } from "./setupSW";
import "./index.css";
import App from "./App.tsx";

setupSW();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
