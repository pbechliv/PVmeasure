import React from "react";
import { connect } from "react-redux";
import { Grid } from "semantic-ui-react";
import RecordingForm from "../components/RecordingForm";
import { setFetchHeaders } from "../lib";
import { HOST_URL } from "..";
import * as actions from "../store/actions";

class RecordingsListPage extends React.Component {
  async componentDidMount() {
    this.fetchGroup();
    this.fetchRecordings();
  }

  async fetchGroup() {
    const headers = setFetchHeaders("GET");
    try {
      const response = await fetch(
        `${HOST_URL}/measurement_groups/${this.props.match.params.id}/`,
        headers
      );
      if (response.ok) {
        const responseData = await response.json();
        this.props.setCurrentGroup(responseData);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async fetchRecordings() {
    const headers = setFetchHeaders("GET");
    try {
      const response = await fetch(
        `${HOST_URL}/recordings/?group=${this.props.match.params.id}`,
        headers
      );
      if (response.ok) {
        const responseData = await response.json();
        this.props.setRecordings(responseData);
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

const mapStateToProps = state => ({
  recordings: state.main.recordings
});

const mapDispatchToProps = {
  setCurrentGroup: actions.setCurrentGroup,
  setRecordings: actions.setRecordings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordingsListPage);
