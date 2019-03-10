import React from "react";
import { connect } from "react-redux";
import { Container } from "semantic-ui-react";
import RecordingForm from "../components/RecordingForm";

class RecordingsListPage extends React.Component {
  render() {
    return (
      <Container>
        <RecordingForm />
      </Container>
    );
  }
}

export default connect()(RecordingsListPage);
