import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ASTEROID_GLB_URL, preloadAsteroidGltf } from "./asteroidPreload.js";

function injectAsteroidPreloadLink() {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = ASTEROID_GLB_URL;
  link.as = "fetch";
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

injectAsteroidPreloadLink();
preloadAsteroidGltf();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
