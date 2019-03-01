import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import AuthPage from "./containers/AuthPage";
import {
  userIsAuthenticated,
  userIsNotAuthenticated
} from "./auth/authWrapper";
import GroupListPage from "./containers/GroupListPage";

const protectedAuthPage = userIsNotAuthenticated(AuthPage);
const protectedGroupListPage = userIsAuthenticated(GroupListPage);

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" exact component={protectedAuthPage} />
        <Route path="/" exact component={protectedGroupListPage} />
      </Switch>
    );
  }
}

export default App;
