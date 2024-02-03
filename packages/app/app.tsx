import { CssBaseline, ThemeProvider } from "@mui/material"
import { ErrorBoundary } from "@sentry/react"
import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Layout } from "./components/layout"
import { menu } from "./components/menu"
import { AnalyticsProvider } from "./firebase"
import { theme } from "./theme"

const Home = React.lazy(() => import("./pages/Home"))
const DemoPage = React.lazy(() => import("./pages/DemoPage"))
const DemoList = React.lazy(() => import("./pages/DemoList"))

export default function App() {
  return (
    <ErrorBoundary showDialog={import.meta.env.PROD}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <React.Suspense fallback="">
          <BrowserRouter>
            <AnalyticsProvider>
              <Layout menu={menu}>
                <React.Suspense fallback="">
                  <React.StrictMode>{routes}</React.StrictMode>
                </React.Suspense>
              </Layout>
            </AnalyticsProvider>
          </BrowserRouter>
        </React.Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

const routes = (
  <Routes>
    <Route path="/dem/*" element={<DemoPage />} />
    <Route path="/files" element={<DemoList />} />
    <Route path="/" element={<Home />} />
  </Routes>
)
