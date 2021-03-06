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
      errors.name = "This field may not be blank";
    }
    if (!values.commissioning_date) {
      errors.commissioning_date = "This field may not be blank";
    }
    if (!values.nominal_power) {
      errors.nominal_power = "This field may not be blank";
    }
    if (!values.feed_in_tariff) {
      errors.feed_in_tariff = "This field may not be blank";
    }
    if (
      Number(values.feed_in_tariff) > 1 ||
      Number(values.feed_in_tariff) < 0
    ) {
      errors.feed_in_tariff = "Value must be between 0 and 1";
    }
    if (!values.longitude) {
      errors.longitude = "This field may not be blank";
    }
    if (!values.latitude) {
      errors.latitude = "This field may not be blank";
    }
    const regex = /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}/;
    if (!regex.test(values.longitude)) {
      errors.longitude =
        "Longitude format is wrong, please use WGS84, eg. 30.30";
    }
    if (!regex.test(values.latitude)) {
      errors.latitude = "Latitude format is wrong, please use WGS84, eg. 30.30";
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
              <Form.Field required>
                <label>Commissioning Date</label>
                <FastField name="commissioning_date" type="date" />
                <Message error>
                  <ErrorMessage name="commissioning_date" />
                </Message>
              </Form.Field>
              <Form.Field required>
                <label>Nominal Power (kW)</label>
                <FastField name="nominal_power" type="number" step="0.1" />
                <Message error>
                  <ErrorMessage name="nominal_power" />
                </Message>
              </Form.Field>
              <Form.Field required>
                <label>Feed-in Tariff (€)</label>
                <FastField name="feed_in_tariff" type="number" step="0.1" />
                <Message error>
                  <ErrorMessage name="feed_in_tariff" />
                </Message>
              </Form.Field>
              <Form.Field required>
                <label>Longitude</label>
                <FastField name="longitude" type="number" step="0.1" />
                <Message error>
                  <ErrorMessage name="longitude" />
                </Message>
              </Form.Field>
              <Form.Field required>
                <label>Latitude</label>
                <FastField name="latitude" type="number" step="0.1" />
                <Message error>
                  <ErrorMessage name="latitude" />
                </Message>
              </Form.Field>
              <Message error>{this.state.formError}</Message>
              <Button.Group fluid>
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
                    color="green"
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
