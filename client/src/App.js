import React from "react";
import { connect } from "react-redux";
import { Switch, Route, withRouter } from "react-router-dom";
import AuthPage from "./containers/AuthPage";
import {
  userIsAuthenticated,
  userIsNotAuthenticated
} from "./auth/authWrapper";
import GroupListPage from "./containers/GroupListPage";
import RecordingsListPage from "./containers/RecordingsListPage";
import Navbar from "./components/Navbar";
import { Container } from "semantic-ui-react";
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";
import FailuresPage from "./containers/FailuresPage";

const protectedAuthPage = userIsNotAuthenticated(AuthPage);
const protectedGroupListPage = userIsAuthenticated(GroupListPage);
const protectedRecordingsListPage = userIsAuthenticated(RecordingsListPage);
const protectedFailuresPage = userIsAuthenticated(FailuresPage);

const App = props => {
  return (
    <>
      <Route path="/login" exact component={protectedAuthPage} />
      <Container>
        {props.isAuthenticated && <Navbar />}
        <Switch>
          <Route path="/" exact component={protectedGroupListPage} />
          <Route
            path="/recordings/:id"
            exact
            component={protectedRecordingsListPage}
          />
          <Route path="/failures" exact component={protectedFailuresPage} />
        </Switch>
      </Container>
    </>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.main.isAuthenticated
});

export default withRouter(connect(mapStateToProps)(App));
