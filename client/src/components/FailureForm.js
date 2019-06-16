import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Button, Message, Popup, Icon } from "semantic-ui-react";
import { Formik, ErrorMessage, FastField } from "formik";
import { toastr } from "react-redux-toastr";
import * as actions from "../store/actions";
import { setFetchHeaders } from "../lib";
import { SERVER2_URL } from "..";
import { failureOptions } from "../catalogue/failures2";

class FailureForm extends React.Component {
  state = {
    formError: ""
  };

  async submitForm(values, actions) {
    const postData = new FormData();
    postData.append("plant", this.props.match.params.id);
    postData.append("name", JSON.parse(values.failure).name);
    postData.append(
      "performance_losses_mean",
      JSON.parse(values.failure).performance_losses_mean
    );
    postData.append(
      "performance_losses_sigma",
      JSON.parse(values.failure).performance_losses_sigma
    );
    postData.append("percentage", values.percentage);
    const headers = setFetchHeaders("POST", postData);
    const response = await fetch(SERVER2_URL + "/failures/", headers);
    if (response.ok) {
      const responseData = await response.json();
      toastr.success("The failure was succesfully submitted");
      this.props.addFailure(responseData);
      if (responseData._error)
        this.setState({ formError: responseData._error[0] });
    } else if (response.status === 400) {
      toastr.error("Something went wrong...");
    }
    actions.setSubmitting(false);
  }

  validate(values, actions) {
    let errors = {};
    if (!values.failure) {
      errors.failure = "Please select the type of failure";
    }
    if (!values.percentage) {
      errors.percentage = "This field may not be blank.";
    }
    return errors;
  }

  render() {
    const failureOpts = failureOptions.map(f => (
      <option key={`failopt-${f.name}`} value={JSON.stringify(f)}>
        {f.name}
      </option>
    ));
    const { currentFailure } = this.props;
    return (
      <Formik
        enableReinitialize
        validate={this.validate}
        onSubmit={(values, actions) => this.submitForm(values, actions)}
        initialValues={
          currentFailure
            ? {
                failure: JSON.stringify({
                  name: currentFailure.name,
                  performance_losses_mean:
                    currentFailure.performance_losses_mean,
                  performance_losses_sigma:
                    currentFailure.performance_losses_sigma
                }),
                percentage: currentFailure.percentage
              }
            : {
                failure: "",
                percentage: ""
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
                <label>Failure</label>
                <FastField name="failure" component="select">
                  <option value="" />
                  {failureOpts}
                </FastField>
                <Message error>
                  <ErrorMessage name="failure" />
                </Message>
              </Form.Field>
              <Form.Field required>
                <label>
                  <Popup trigger={<Icon name="info circle" />}>
                    The percentage of the number of faulty components compared
                    to the total number of this specific component
                  </Popup>
                  Percentage (%)
                </label>
                <FastField name="percentage" type="number" />
                <Message error>
                  <ErrorMessage name="percentage" />
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
                {currentFailure && (
                  <Button
                    type="button"
                    color="green"
                    floated="right"
                    disabled={props.isSubmitting}
                    onClick={() => this.props.setCurrentFailure(null)}
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
  currentFailure: state.main.currentFailure
});

const mapDispatchToProps = {
  addFailure: actions.addFailure,
  setCurrentFailure: actions.setCurrentFailure
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FailureForm)
);
