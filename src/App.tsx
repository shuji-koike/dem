import { faFile, faHome, faTrophy } from "@fortawesome/free-solid-svg-icons"
import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { Layout, MenuItem, NavItem } from "./Layout"
import { DemoList } from "./pages/DemoList"
import { DemoPage } from "./pages/DemoPage"
import { Home } from "./pages/Home"
import { MatchList } from "./pages/MatchList"
import { Results } from "./pages/Results"
import { SampleMatch, Sandbox } from "./pages/Sandbox"
import { MatchContextProvider } from "./store/MatchContext"

export const App: React.VFC = () => {
  return (
    <BrowserRouter>
      <MatchContextProvider>
        <Switch>
          <Route>
            <Layout nav={nav} menu={menu}>
              {routes}
            </Layout>
          </Route>
        </Switch>
      </MatchContextProvider>
    </BrowserRouter>
  )
}

const routes = (
  <Switch>
    <Route path="/results" component={Results}></Route>
    <Route path="/matches" component={MatchList}></Route>
    <Route path="/files/*" component={DemoPage}></Route>
    <Route path="/files" component={DemoList}></Route>
    <Route path="/sample" component={SampleMatch}></Route>
    <Route path="/sandbox" component={Sandbox}></Route>
    <Route path="/" component={Home}></Route>
  </Switch>
)

const nav = (
  <>
    <NavItem icon={faHome} to="/" label="Home" />
    <NavItem icon={faFile} to="/files" label="Files" />
    <NavItem icon={faTrophy} to="/results" label="Results" />
  </>
)

const menu = (
  <>
    <MenuItem icon={faHome} to="/" exact label="Home" />
    <MenuItem icon={faFile} to="/files" label="Files" />
    <MenuItem icon={faTrophy} to="/results" label="Results" />
  </>
)
