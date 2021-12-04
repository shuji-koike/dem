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

export const App: React.VFC = () => {
  return (
    <React.Suspense fallback={<></>}>
      <BrowserRouter>
        <ThemeProvider>
          <AppContextProvider>
            <Layout menu={menu}>
              <React.Suspense fallback={<></>}>
                <React.StrictMode>{routes}</React.StrictMode>
              </React.Suspense>
            </Layout>
          </AppContextProvider>
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
    <Route path="/sample" element={<DemoPage path="/static/sample.json" />} />
    <Route path="/" element={<Home />} />
  </Routes>
)

interface AppState {
  match: Match | null
  setMatch: (match: Match) => void
  tick: number
  setTick: (tick: number) => void
}

export const AppContext = React.createContext<AppState>({
  match: null,
  setMatch() {},
  tick: 0,
  setTick() {},
})

export const AppContextProvider: React.VFC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [match, setMatch] = React.useState<Match | null>(null)
  const [tick, setTick] = React.useState(0)
  return (
    <AppContext.Provider value={{ match, setMatch, tick, setTick }}>
      {children}
    </AppContext.Provider>
  )
}
