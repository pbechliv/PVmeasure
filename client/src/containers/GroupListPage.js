import React from "react";
import { connect } from "react-redux";
import GroupForm from "../components/GroupForm";
import { Segment, Header, Grid, Card } from "semantic-ui-react";
import { setFetchHeaders } from "../lib";
import { HOST_URL } from "..";
import * as actions from "../store/actions";

class GroupListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const headers = setFetchHeaders("GET");
    try {
      const response = await fetch(HOST_URL + "/measurement_groups/", headers);
      if (response.ok) {
        const responseData = await response.json();
        this.props.setGroups(responseData);
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <Grid container stackable>
        <Grid.Column width={4}>
          <Segment.Group compact>
            <Segment inverted color="black">
              <Header> Start a new group of measurements</Header>
            </Segment>
            <Segment>
              <GroupForm />
            </Segment>
          </Segment.Group>
        </Grid.Column>
        <Grid.Column width={12}>
          {this.props.groups.results.map((group, index) => (
            <Card key={`group-${index}`}>
              <Card.Content>
                <Card.Header>
                  {group.name ? group.name : "Recordings"}
                  {group.date ? ` - ${group.date}` : ""}
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
  groups: state.main.groups
});

const mapDispatchToProps = {
  setGroups: actions.setGroups
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupListPage);
