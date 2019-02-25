import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import AuthPage from "./containers/AuthPage";
import {
  userIsAuthenticated,
  userIsNotAuthenticated
} from "./auth/authWrapper";
import ListPage from "./containers/ListPage";

const protectedAuthPage = userIsNotAuthenticated(AuthPage);
const protectedListPage = userIsAuthenticated(ListPage);

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" exact component={protectedAuthPage} />
        <Route path="/" exact component={protectedListPage} />
      </Switch>
    );
  }
}

export default App;
