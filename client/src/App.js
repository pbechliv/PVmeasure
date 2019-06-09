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
import NotesListPage from "./containers/NoteListPage";
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";

const protectedAuthPage = userIsNotAuthenticated(AuthPage);
const protectedGroupListPage = userIsAuthenticated(GroupListPage);
const protectedRecordingsListPage = userIsAuthenticated(RecordingsListPage);
const protectedNotesListPage = userIsAuthenticated(NotesListPage);

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
          <Route path="/notes" exact component={protectedNotesListPage} />
        </Switch>
      </Container>
    </>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.main.isAuthenticated
});

export default withRouter(connect(mapStateToProps)(App));
