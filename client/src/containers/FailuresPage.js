import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import {
  Segment,
  Header,
  Grid,
  Card,
  Icon,
  Message,
  Popup
} from "semantic-ui-react";
import { setFetchHeaders } from "../lib";
import { SERVER2_URL } from "..";
import * as actions from "../store/actions";
import PlantForm from "../components/PlantForm";
import FailureForm from "../components/FailureForm";
import CardActions from "../components/CardActions";

class FailuresPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plantFormOpen: false,
      plantListOpen: false,
      failureFormOpen: true
    };
  }

  async fetchPlants() {
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

  async fetchFailures(id) {
    const headers = setFetchHeaders("GET");
    let url = `${SERVER2_URL}/failures/`;
    if (id) {
      url += `?plant=${id}`;
    } else if (this.props.match.params.id) {
      url += `?plant=${this.props.match.params.id}`;
    }
    try {
      const response = await fetch(url, headers);
      if (response.ok) {
        const responseData = await response.json();
        this.props.setFailures(responseData);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async componentDidMount() {
    this.fetchPlants();
    this.fetchFailures();
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

  async deleteFailure(failure) {
    toastr.confirm(`Are you sure you want to delete ${failure.name}?`, {
      onOk: async () => {
        const headers = setFetchHeaders("DELETE");
        try {
          const response = await fetch(
            `${SERVER2_URL}/failures/${failure.id}/`,
            headers
          );
          if (response.ok) {
            toastr.warning(`${failure.name} has been successfully deleted...`);
            this.props.removeFailure(failure);
          }
        } catch (e) {
          console.log(e);
          toastr.error(`Something went wrong...`);
        }
      }
    });
  }

  render() {
    const pagePlant = this.props.plants.results.find(
      p => p.id == this.props.match.params.id
    );
    return (
      <Grid stackable>
        {/* LIST AND FORM OF PLANTS */}
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
                            onClick={() => this.fetchFailures(plant.id)}
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
                          <CardActions
                            pullRight
                            deleteAction={() => this.deletePlant(plant)}
                            editAction={() => {
                              this.setState({ plantFormOpen: true });
                              this.props.setCurrentPlant(plant);
                            }}
                          />
                        </Card.Header>
                      </Card.Content>
                    </Card>
                  ))}
                </Segment>
              )}
            </Segment.Group>
          )}
        </Grid.Column>
        {/* LIST OF FAILURES */}
        <Grid.Column width={8}>
          <Segment.Group>
            <Segment inverted color="black">
              <Header sub style={{ display: "inline-block", margin: 0 }}>
                {pagePlant
                  ? `List of ${pagePlant.name} failures`
                  : "List of all Failures"}
              </Header>
            </Segment>
            <Segment>
              {this.props.failures.count === 0 ? (
                <Message info>There are no failures submitted</Message>
              ) : (
                this.props.failures.results.map((failure, index) => (
                  <Card fluid key={`failure-${index}`}>
                    <Card.Content>
                      <Card.Header>
                        <span
                          style={{
                            display: "inline-block"
                          }}
                        >
                          {failure.name}
                        </span>
                        <CardActions
                          pullRight
                          deleteAction={() => this.deleteFailure(failure)}
                          editAction={() => {
                            this.props.history.push(
                              `/failures/${failure.plant}`
                            );
                            this.fetchFailures(failure.plant);
                            this.props.setCurrentFailure(failure);
                          }}
                        />
                      </Card.Header>

                      <Card.Description>
                        <Popup
                          trigger={
                            <span>
                              Estimated cost of failure per year:{" "}
                              {failure.ecfl_y.toFixed(2)} €
                            </span>
                          }
                        >
                          <p>
                            ecfl = (Plant nominal power * Feed-In tariff *
                            Plant's annual energy yield * 0.99 ^ years of
                            activity * percentage of failure) / (10 ^2)
                          </p>
                        </Popup>
                      </Card.Description>
                    </Card.Content>
                  </Card>
                ))
              )}
            </Segment>
          </Segment.Group>
        </Grid.Column>
        {/* FAILURES FORM */}
        {this.props.match.params.id && (
          <Grid.Column width={4}>
            <Segment.Group>
              <Segment inverted color="black">
                <Header sub style={{ display: "inline-block", margin: 0 }}>
                  Submit the failure
                </Header>
                <Icon
                  link
                  style={{ float: "right" }}
                  name={
                    this.state.failureFormOpen
                      ? "caret square up outline"
                      : "caret square down outline"
                  }
                  size="large"
                  onClick={() =>
                    this.setState({
                      failureFormOpen: !this.state.failureFormOpen
                    })
                  }
                />
              </Segment>
              {this.state.failureFormOpen && (
                <Segment>
                  <FailureForm />
                </Segment>
              )}
            </Segment.Group>
          </Grid.Column>
        )}
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  plants: state.main.plants,
  failures: state.main.failures
});

const mapDispatchToProps = {
  setPlants: actions.setPlants,
  removePlant: actions.removePlant,
  setCurrentPlant: actions.setCurrentPlant,
  setCurrentFailurePlant: actions.setCurrentFailurePlant,
  setFailures: actions.setFailures,
  removeFailure: actions.removeFailure,
  setCurrentFailure: actions.setCurrentFailure
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FailuresPage);
