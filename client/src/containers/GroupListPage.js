import React from "react";
import GroupForm from "../components/GroupForm";
import { Container, Segment, Header, Grid } from "semantic-ui-react";

class GroupListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  render() {
    return (
      <Grid container stackable>
        <Grid.Column width={4}>
          <Segment.Group compact>
            <Segment inverted color="black">
              <Header> Start a new measurement group</Header>
            </Segment>
            <Segment>
              <GroupForm />
            </Segment>
          </Segment.Group>
        </Grid.Column>
        <Grid.Column width={12}>List</Grid.Column>
      </Grid>
    );
  }
}

export default GroupListPage;
