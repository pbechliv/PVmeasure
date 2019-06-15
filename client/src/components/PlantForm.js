import React from "react";
import { connect } from "react-redux";
import { Form, Button, Message } from "semantic-ui-react";
import { Formik, ErrorMessage, FastField } from "formik";
import { toastr } from "react-redux-toastr";
import * as actions from "../store/actions";
import { setFetchHeaders } from "../lib";
import { SERVER2_URL } from "..";

class PlantForm extends React.Component {
  state = {
    formError: ""
  };

  async submitForm(values, actions) {
    const postData = new FormData();
    postData.append("user", this.props.userId);
    postData.append("name", values.name);
    postData.append("nominal_power", values.nominal_power);
    postData.append("commissioning_date", values.commissioning_date);
    postData.append("feed_in_tariff", values.feed_in_tariff);
    postData.append("longitude", values.longitude);
    postData.append("latitude", values.latitude);
    const headers = setFetchHeaders("POST", postData);
    const response = await fetch(SERVER2_URL + "/plants/", headers);
    if (response.ok) {
      const responseData = await response.json();
      toastr.success("You successfully created a new PV plant");
      this.props.addPlant(responseData);
      if (responseData._error)
        this.setState({ formError: responseData._error[0] });
    } else if (response.status === 400) {
      toastr.error("Something went wrong...");
    }
    actions.setSubmitting(false);
  }

  validate(values, actions) {
    let errors = {};
    if (!values.name) {
      errors.name = "This field may not be blank.";
    }
    return errors;
  }

  render() {
    const { currentPlant } = this.props;
    return (
      <Formik
        enableReinitialize
        validate={this.validate}
        onSubmit={(values, actions) => this.submitForm(values, actions)}
        initialValues={
          currentPlant
            ? currentPlant
            : {
                name: "",
                commissioning_date: new Date().toISOString().substr(0, 10),
                nominal_power: "",
                feed_in_tariff: "",
                longitude: "",
                latitude: ""
              }
        }
      >
        {props => {
          return (
            <Form
              onSubmit={props.handleSubmit}
              error={
                Object.values(props.errors).length > 0 || !!this.state.formError
              }
            >
              <Form.Field required>
                <label>Name</label>
                <FastField name="name" type="text" />
                <Message error>
                  <ErrorMessage name="name" />
                </Message>
              </Form.Field>
              <Form.Field>
                <label>Commissioning Date</label>
                <FastField name="commissioning_date" type="date" />
                <Message error>
                  <ErrorMessage name="commissioning_date" />
                </Message>
              </Form.Field>
              <Form.Field>
                <label>Nominal Power</label>
                <FastField name="nominal_power" type="number" step="0.1" />
                <Message error>
                  <ErrorMessage name="nominal_power" />
                </Message>
              </Form.Field>
              <Form.Field>
                <label>Feed-in Tariff</label>
                <FastField name="feed_in_tariff" type="number" step="0.1" />
                <Message error>
                  <ErrorMessage name="feed_in_tariff" />
                </Message>
              </Form.Field>
              <Form.Field>
                <label>Longitude</label>
                <FastField name="longitude" type="number" step="0.1" />
                <Message error>
                  <ErrorMessage name="longitude" />
                </Message>
              </Form.Field>
              <Form.Field>
                <label>Latitude</label>
                <FastField name="latitude" type="number" step="0.1" />
                <Message error>
                  <ErrorMessage name="latitude" />
                </Message>
              </Form.Field>
              <Message error>{this.state.formError}</Message>
              <Button.Group>
                <Button
                  type="submit"
                  color="black"
                  disabled={props.isSubmitting}
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  color="yellow"
                  onClick={props.handleReset}
                  disabled={!props.dirty || props.isSubmitting}
                >
                  Reset
                </Button>
                {currentPlant && (
                  <Button
                    type="button"
                    color="blue"
                    floated="right"
                    disabled={props.isSubmitting}
                    onClick={() => this.props.setCurrentPlant(null)}
                  >
                    New
                  </Button>
                )}
              </Button.Group>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.main.userId,
  currentPlant: state.main.currentPlant
});

const mapDispatchToProps = {
  addPlant: actions.addPlant,
  setCurrentPlant: actions.setCurrentPlant
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlantForm);
