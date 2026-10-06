import { createRoot } from "react-dom/client";
// Same faces and weights as before, served from this site: no extra connections
// to Google before the text can be drawn.
import "@fontsource/playfair-display/latin-500.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
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
