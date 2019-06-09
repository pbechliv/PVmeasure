import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import GroupForm from "../components/GroupForm";
import { Segment, Header, Grid, Card, Icon } from "semantic-ui-react";
import { setFetchHeaders } from "../lib";
import { SERVER2_URL } from "..";
import * as actions from "../store/actions";

class NoteListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const headers = setFetchHeaders("GET");
    try {
      const response = await fetch(`${SERVER2_URL}/notes/`, headers);
      if (response.ok) {
        const responseData = await response.json();
        this.props.setNotes(responseData);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async deleteNote(note) {
    toastr.confirm(`Are you sure you want to delete this note?`, {
      onOk: async () => {
        const headers = setFetchHeaders("DELETE");
        try {
          const response = await fetch(
            `${SERVER2_URL}/measurement_groups/${note.id}/`,
            headers
          );
          if (response.ok) {
            toastr.warning(`The note has been successfully deleted...`);
            this.props.removeNote(note);
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
        <Grid.Column width={4}>
          <Segment.Group compact>
            <Segment inverted color="black">
              <Header> Create a new note</Header>
            </Segment>
            <Segment>
              <GroupForm />
            </Segment>
          </Segment.Group>
        </Grid.Column>
        <Grid.Column width={12}>
          {this.props.notes.results.map((note, index) => (
            <Card key={`group-${index}`}>
              <Card.Content>
                <Card.Header>
                  {note.title}
                  <div style={{ float: "right", display: "inline-block" }}>
                    <div style={{ marginBottom: "10px" }}>
                      <Icon
                        link
                        name="edit"
                        color="orange"
                        onClick={() => this.props.setCurrentNote(note)}
                      />
                    </div>
                    <div>
                      <Icon
                        link
                        name="remove"
                        color="red"
                        onClick={() => this.deleteNote(note)}
                      />
                    </div>
                    <div />
                  </div>
                </Card.Header>
              </Card.Content>
            </Card>
          ))}
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  notes: state.main.notes
});

const mapDispatchToProps = {
  setNotes: actions.setNotes,
  removeNote: actions.removeNote,
  setCurrentNote: actions.setCurrentNote
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteListPage);
