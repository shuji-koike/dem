import React from "react";
import { Switch, Route } from "react-router-dom";
import List from "@material-ui/core/List";
import { faHome, faTrophy, faFile } from "@fortawesome/free-solid-svg-icons";
import { Home } from "./Home";
import { DemoView } from "./demo/DemoView";
import { DemoList } from "./demo/DemoList";
import { Dashboard, NavItem } from "./Dashboard";
import { Results } from "./Results";
import { Matches } from "./Matches";

export function App() {
  return (
    <Switch>
      <Route path="/dem/*" component={DemoView}></Route>
      <Route>
        <Dashboard title="demhub" nav={nav}>
          <Switch>
            <Route path="/results" component={Results}></Route>
            <Route path="/matches" component={Matches}></Route>
            <Route path="/files" component={DemoList}></Route>
            <Route path="/" exact component={Home}></Route>
          </Switch>
        </Dashboard>
      </Route>
    </Switch>
  );
}

const nav = (
  <List>
    <NavItem icon={faHome} to="/" exact label="Home" />
    <NavItem icon={faTrophy} to="/results?content=demo" label="Results" />
    <NavItem icon={faFile} to="/files" label="Files" />
  </List>
);
