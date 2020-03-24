import { faFile, faHome, faTrophy } from "@fortawesome/free-solid-svg-icons";
import List from "@material-ui/core/List";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Dashboard, NavItem } from "./Dashboard";
import { DemoList } from "./demo/DemoList";
import { DemoView } from "./demo/DemoView";
import { Home } from "./Home";
import { Matches } from "./Matches";
import { Results } from "./Results";

export function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/dem/*" component={DemoView}></Route>
        <Route>
          <Dashboard title="demhub" nav={<Nav />}>
            <MainSwitch />
          </Dashboard>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

function MainSwitch() {
  return (
    <Switch>
      <Route path="/results" component={Results}></Route>
      <Route path="/matches" component={Matches}></Route>
      <Route path="/files" component={DemoList}></Route>
      <Route path="/" exact component={Home}></Route>
    </Switch>
  );
}

function Nav() {
  return (
    <List>
      <NavItem icon={faHome} to="/" exact label="Home" />
      <NavItem icon={faTrophy} to="/results?content=demo" label="Results" />
      <NavItem icon={faFile} to="/files" label="Files" />
    </List>
  );
}
