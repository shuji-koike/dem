import { faFile, faHome, faTrophy } from "@fortawesome/free-solid-svg-icons"
import { List, CssBaseline, ThemeProvider } from "@mui/material"
import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import sample from "../../static/sample.dem.json.gz?url"
import { Layout, MenuItem } from "./components/layout"
import { DemoList } from "./pages/DemoList"
import { DemoPage } from "./pages/DemoPage"
import { Home } from "./pages/Home"
import { MatchList } from "./pages/MatchList"
import { Results } from "./pages/Results"
import { theme } from "./theme"

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContextProvider>
          <React.Suspense fallback="">
            <Layout menu={menu}>
              <React.Suspense fallback="">
                <React.StrictMode>{routes}</React.StrictMode>
              </React.Suspense>
            </Layout>
          </React.Suspense>
        </AppContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

const routes = (
  <Routes>
    <Route path="/files/*" element={<DemoPage />} />
    <Route path="/files" element={<DemoList />} />
    <Route path="/results" element={<Results />} />
    <Route path="/matches" element={<MatchList />} />
    <Route path="/sample" element={<DemoPage path={sample} />} />
    <Route path="/" element={<Home />} />
  </Routes>
)

export const menu = (
  <List>
    <MenuItem icon={faHome} to="/" label="Home" />
    <MenuItem icon={faFile} to="/files" label="Files" />
    <MenuItem icon={faTrophy} to="/sample" label="Sample" />
  </List>
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
