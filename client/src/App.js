import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import AuthPage from "./containers/AuthPage";
import {
  userIsAuthenticated,
  userIsNotAuthenticated
} from "./auth/authWrapper";
import GroupListPage from "./containers/GroupListPage";
import RecordingsListPage from "./containers/RecordingsListPage";

const protectedAuthPage = userIsNotAuthenticated(AuthPage);
const protectedGroupListPage = userIsAuthenticated(GroupListPage);
const protectedRecordingsListPage = userIsAuthenticated(RecordingsListPage);

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" exact component={protectedAuthPage} />
        <Route path="/" exact component={protectedGroupListPage} />
        <Route
          path="/recordings/:id"
          exact
          component={protectedRecordingsListPage}
        />
      </Switch>
    );
  }
}

export default App;
