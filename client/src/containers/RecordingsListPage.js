import React from "react";
import { connect } from "react-redux";
import { Grid, Icon, Table } from "semantic-ui-react";
import { toastr } from "react-redux-toastr";
import RecordingForm from "../components/RecordingForm";
import { setFetchHeaders } from "../lib";
import { SERVER1_URL } from "..";
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
        `${SERVER1_URL}/measurement_groups/${this.props.match.params.id}/`,
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
        `${SERVER1_URL}/recordings/?group=${this.props.match.params.id}`,
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

  async deleteRecording(recording) {
    toastr.confirm(`Are you sure you want to delete this recording?`, {
      onOk: async () => {
        const headers = setFetchHeaders("DELETE");
        try {
          const response = await fetch(
            `${SERVER1_URL}/measurement_groups/${recording.id}/`,
            headers
          );
          if (response.ok) {
            toastr.warning(`The recording has been successfully deleted...`);
            this.props.removeGroup(recording);
          }
        } catch (e) {
          console.log(e);
          toastr.error(`Something went wrong...`);
        }
      }
    });
  }
  render() {
    return (
      <Grid stackable>
        <Grid.Column width={10}>
          <RecordingForm />
        </Grid.Column>
        <Grid.Column width={6}>
          {this.props.recordings.results.map((recording, index) => (
            <Table
              compact
              unstackable
              textAlign="left"
              key={`recording-${index}`}
            >
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Spot</Table.HeaderCell>
                  <Table.HeaderCell>Measurements</Table.HeaderCell>
                  <Table.HeaderCell>Comment</Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>{recording.measuring_point}</Table.Cell>
                  <Table.Cell>
                    {recording.measurements.map((m, i) => (
                      <div key={`mr-${i}`}>
                        <strong>{m.type}:</strong>&nbsp;
                        {m.value} {m.unit}
                      </div>
                    ))}
                    {recording.polarity_test && (
                      <div>
                        <strong>Polarity</strong>&nbsp;
                        <Icon name="check" />
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell>{recording.comment}</Table.Cell>
                  <Table.Cell textAlign="center">
                    <div style={{ marginBottom: "10px" }}>
                      <Icon
                        onClick={() =>
                          this.props.setCurrentRecording(recording)
                        }
                        link
                        color="orange"
                        name="edit"
                      />
                    </div>
                    <div>
                      <Icon
                        onClick={() => this.props.deleteRecording(recording)}
                        link
                        color="red"
                        name="remove"
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          ))}
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  recordings: state.main.recordings
});

const mapDispatchToProps = {
  setCurrentGroup: actions.setCurrentGroup,
  setRecordings: actions.setRecordings,
  removeRecording: actions.removeRecording,
  setCurrentRecording: actions.setCurrentRecording
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordingsListPage);
