import { ThemeProvider } from "@primer/components"
import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"

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
    <BrowserRouter>
      <ThemeProvider>
        <MatchContextProvider>
          <Switch>
            <Route>
              <Layout menu={menu}>{routes}</Layout>
            </Route>
          </Switch>
        </MatchContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

const routes = (
  <Switch>
    <Route path="/files/*" component={DemoPage}></Route>
    <Route path="/files" component={DemoList}></Route>
    <Route path="/results" component={Results}></Route>
    <Route path="/matches" component={MatchList}></Route>
    <Route path="/sandbox" component={Sandbox}></Route>
    <Route path="/sample">
      <DemoPage path="/static/sample.json" />
    </Route>
    <Route path="/" component={Home}></Route>
  </Switch>
)
