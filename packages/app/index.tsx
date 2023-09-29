import "./firebase"
import "./index.css"

import * as Sentry from "@sentry/react"
import { Integrations } from "@sentry/tracing"
import React from "react"
import { createRoot } from "react-dom/client"

Sentry.init({
  dsn: "https://d6b8415d99f44c6b8820ce57e3d742c7@o576396.ingest.sentry.io/6159893",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
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
