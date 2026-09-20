import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { initSentry } from "./lib/sentry";

// Before anything renders, so a crash during the first paint is still caught.
// No-op unless VITE_SENTRY_DSN is set.
initSentry();

createRoot(document.getElementById("root")).render(
  // ErrorBoundary is outermost so it catches failures from the providers too,
  // not only from the routed pages beneath them.
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
