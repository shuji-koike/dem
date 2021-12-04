import { ThemeProvider } from "@primer/components"
import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Layout } from "./components/layout"
import { menu } from "./components/nav"
import { DemoList } from "./pages/DemoList"
import { DemoPage } from "./pages/DemoPage"
import { Home } from "./pages/Home"
import { MatchList } from "./pages/MatchList"
import { Results } from "./pages/Results"
import { Sandbox } from "./pages/Sandbox"
import { MatchContextProvider } from "./store/MatchContext"

export const App: React.VFC = () => {
  return (
    <React.Suspense fallback={<></>}>
      <BrowserRouter>
        <ThemeProvider>
          <MatchContextProvider>
            <Layout menu={menu}>
              <React.Suspense fallback={<></>}>
                <React.StrictMode>{routes}</React.StrictMode>
              </React.Suspense>
            </Layout>
          </MatchContextProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.Suspense>
  )
}

const routes = (
  <Routes>
    <Route path="/files/*" element={<DemoPage />} />
    <Route path="/files" element={<DemoList />} />
    <Route path="/results" element={<Results />} />
    <Route path="/matches" element={<MatchList />} />
    <Route path="/sandbox" element={<Sandbox />} />
    <Route path="/sample" element={<DemoPage path="/static/sample.json" />} />
    <Route path="/" element={<Home />} />
  </Routes>
)