import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import { Segment, Header, Grid, Card, Icon } from "semantic-ui-react";
import { setFetchHeaders } from "../lib";
import { SERVER2_URL } from "..";
import * as actions from "../store/actions";
import PlantForm from "../components/PlantForm";

class FailuresPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plantFormOpen: false,
      plantListOpen: false
    };
  }

  async componentDidMount() {
    const headers = setFetchHeaders("GET");
    try {
      const response = await fetch(`${SERVER2_URL}/plants/`, headers);
      if (response.ok) {
        const responseData = await response.json();
        this.props.setPlants(responseData);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async deletePlant(plant) {
    toastr.confirm(`Are you sure you want to delete ${plant.name}?`, {
      onOk: async () => {
        const headers = setFetchHeaders("DELETE");
        try {
          const response = await fetch(
            `${SERVER2_URL}/plants/${plant.id}/`,
            headers
          );
          if (response.ok) {
            toastr.warning(`${plant.name} has been successfully deleted...`);
            this.props.removePlant(plant);
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
          <Segment.Group>
            <Segment inverted color="black">
              <Header sub style={{ display: "inline-block", margin: 0 }}>
                Create a new PV plant
              </Header>
              <Icon
                link
                style={{ float: "right" }}
                name={
                  this.state.plantFormOpen
                    ? "caret square up outline"
                    : "caret square down outline"
                }
                size="large"
                onClick={() =>
                  this.setState({ plantFormOpen: !this.state.plantFormOpen })
                }
              />
            </Segment>
            {this.state.plantFormOpen && (
              <Segment>
                <PlantForm />
              </Segment>
            )}
          </Segment.Group>
          {this.props.plants.results.length > 0 && (
            <Segment.Group>
              <Segment inverted color="black">
                <Header sub style={{ display: "inline-block", margin: 0 }}>
                  Choose a PV plant
                </Header>
                <Icon
                  link
                  style={{ float: "right" }}
                  name={
                    this.state.plantListOpen
                      ? "caret square up outline"
                      : "caret square down outline"
                  }
                  size="large"
                  onClick={() =>
                    this.setState({ plantListOpen: !this.state.plantListOpen })
                  }
                />
              </Segment>
              {this.state.plantListOpen && (
                <Segment>
                  {this.props.plants.results.map((plant, index) => (
                    <Card key={`plant-${index}`}>
                      <Card.Content>
                        <Card.Header>
                          <Link
                            to={`/failures/${plant.id}`}
                            style={{
                              display: "inline-block",
                              cursor: "pointer",
                              color:
                                this.props.match.params.id == plant.id
                                  ? "#4183c4"
                                  : ""
                            }}
                          >
                            {plant.name ? plant.name : "Recordings"}
                            {plant.date ? ` - ${plant.commissioning_date}` : ""}
                          </Link>
                          <div
                            style={{ float: "right", display: "inline-block" }}
                          >
                            <div style={{ marginBottom: "10px" }}>
                              <Icon
                                link
                                name="edit"
                                color="orange"
                                onClick={() =>
                                  this.props.setCurrentPlant(plant)
                                }
                              />
                            </div>
                            <div>
                              <Icon
                                link
                                name="remove"
                                color="red"
                                onClick={() => this.deletePlant(plant)}
                              />
                            </div>
                            <div />
                          </div>
                        </Card.Header>
                      </Card.Content>
                    </Card>
                  ))}
                </Segment>
              )}
            </Segment.Group>
          )}
        </Grid.Column>
        <Grid.Column width={12} />
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  plants: state.main.plants
});

const mapDispatchToProps = {
  setPlants: actions.setPlants,
  removePlant: actions.removePlant,
  setCurrentPlant: actions.setCurrentPlant
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FailuresPage);
