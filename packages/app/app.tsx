import { faFile, faHome } from "@fortawesome/free-solid-svg-icons"
import { List, CssBaseline, ThemeProvider } from "@mui/material"
import { ErrorBoundary } from "@sentry/react"
import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import sample from "../../static/sample.dem.json?url"
import { Layout, MenuItem } from "./components/layout"
import { AnalyticsProvider } from "./firebase"
import { DemoList } from "./pages/DemoList"
import { DemoPage } from "./pages/DemoPage"
import { Home } from "./pages/Home"
import { Results } from "./pages/Results"
import { theme } from "./theme"

export default function App() {
  return (
    <ErrorBoundary showDialog={import.meta.env.PROD}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <React.Suspense fallback="">
          <BrowserRouter>
            <AnalyticsProvider>
              <AppContextProvider>
                <Layout menu={menu}>
                  <React.Suspense fallback="">
                    <React.StrictMode>{routes}</React.StrictMode>
                  </React.Suspense>
                </Layout>
              </AppContextProvider>
            </AnalyticsProvider>
          </BrowserRouter>
        </React.Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

const routes = (
  <Routes>
    <Route path="/files/*" element={<DemoPage />} />
    <Route path="/files" element={<DemoList />} />
    <Route path="/results" element={<Results />} />
    <Route path="/sample" element={<DemoPage path={sample} />} />
    <Route path="/" element={<Home />} />
  </Routes>
)

export const menu = (
  <List>
    <MenuItem icon={faHome} to="/" label="Home" />
    <MenuItem icon={faFile} to="/files" label="Files" />
  </List>
)

interface AppState {
  match?: Match | null
  setMatch: (match: Match | null | undefined) => void
}

export const AppContext = React.createContext<AppState>({
  setMatch() {},
})

export const AppContextProvider: React.VFC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [match, setMatch] = React.useState<AppState["match"]>()
  return (
    <AppContext.Provider value={{ match, setMatch }}>
      {children}
    </AppContext.Provider>
  )
}
