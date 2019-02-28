import React from "react";
import GroupForm from "../components/GroupForm";
import { Container } from "semantic-ui-react";

class ListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  render() {
    return (
      <Container textAlign="center">
        <GroupForm />
      </Container>
    );
  }
}

export default ListPage;
