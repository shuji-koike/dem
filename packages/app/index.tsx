import "./firebase"
import "./index.css"

import * as Sentry from "@sentry/react"
import React from "react"
import { createRoot } from "react-dom/client"

Sentry.init({
  dsn: import.meta.env["VITE_SENTRY_DSN"],
  integrations: [
    new Sentry.BrowserTracing(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  environment: import.meta.env["MODE"],
})

const App = React.lazy(() => import("./app"))

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.querySelector("#root")!)
root.render(
  <React.Suspense>
    <App />
  </React.Suspense>,
)
