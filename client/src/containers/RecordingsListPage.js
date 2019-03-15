import React from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";
import RecordingForm from "../components/RecordingForm";
import { setFetchHeaders } from "../lib";
import { HOST_URL } from "..";
import * as actions from "../store/actions";

class RecordingsListPage extends React.Component {
  async componentDidMount() {
    const headers = setFetchHeaders("GET");
    try {
      const response = await fetch(
        HOST_URL + "/measurement_groups/" + this.props.match.params.id + "/",
        headers
      );
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        this.props.setCurrentGroup(responseData);
      }
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    return (
      <Grid stackable>
        <Grid.Column width={10}>
          <RecordingForm />
        </Grid.Column>
        <Grid.Column width={6}>List</Grid.Column>
      </Grid>
    );
  }
}

const mapDispatchToProps = {
  setCurrentGroup: actions.setCurrentGroup
};

export default connect(
  null,
  mapDispatchToProps
)(RecordingsListPage);
