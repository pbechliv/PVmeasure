import React from "react";
import { connect } from "react-redux";
import { Form, Button, Message, TextArea } from "semantic-ui-react";
import { Formik, ErrorMessage, FastField } from "formik";
import { toastr } from "react-redux-toastr";
import * as actions from "../store/actions";
import { setFetchHeaders } from "../lib";
import { HOST_URL } from "..";

class GroupForm extends React.Component {
  state = {
    formError: ""
  };

  async submitForm(values, actions) {
    const postData = new FormData();
    postData.append("user", this.props.userId);
    postData.append("name", values.name);
    postData.append("date", values.date);
    postData.append("comment", values.comment);
    const headers = setFetchHeaders("POST", postData);
    const response = await fetch(HOST_URL + "/measurement_groups/", headers);
    if (response.ok) {
      const responseData = await response.json();
      this.props.addGroup(responseData);
      if (responseData._error)
        this.setState({ loginError: responseData._error[0] });
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
    return (
      <Formik
        validate={this.validate}
        onSubmit={(values, actions) => this.submitForm(values, actions)}
        initialValues={{
          name: "",
          date: "",
          comment: ""
        }}
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
                <label>Date</label>
                <FastField name="date" type="date" />
                <Message error>
                  <ErrorMessage name="date" />
                </Message>
              </Form.Field>
              <Form.Field>
                <label htmlFor="comment">Comments...</label>
                <TextArea
                  id="comment"
                  name="comment"
                  value={props.values.comment}
                  onChange={(e, data) =>
                    props.setFieldValue(data.name, data.value)
                  }
                  onBlur={props.handleBlur}
                />
                <Message error>
                  <ErrorMessage name="comment" />
                </Message>
              </Form.Field>
              <Message error>{this.state.formError}</Message>
              <Button
                color="yellow"
                onClick={props.handleReset}
                disabled={!props.dirty || props.isSubmitting}
              >
                Reset
              </Button>
              <Button type="submit" color="black" disabled={props.isSubmitting}>
                Submit
              </Button>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.main.userId
});

const mapDispatchToProps = {
  addGroup: actions.addGroup
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupForm);
