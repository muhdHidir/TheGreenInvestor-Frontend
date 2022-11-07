import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import LoadingSpinner from "./components/LoadingSpinner";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

import React, { Suspense } from "react";
import "./i18n.js";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  /*Note that: App js is injected into the root div*/

  <BrowserRouter>
    <Suspense fallback={<LoadingSpinner />}>
      <App />
    </Suspense>
  </BrowserRouter>
);

serviceWorker.unregister();
