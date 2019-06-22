import React from "react";
import { connect } from "react-redux";
import { Form, Button, Message } from "semantic-ui-react";
import { Formik, ErrorMessage } from "formik";
import { fetchTokenPair } from "../auth/authActions";
import { setFetchHeaders } from "../lib";
import { SERVER1_URL } from "..";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { formError: "" };
  }

  async submitForm(values, actions) {
    const postData = new FormData();
    postData.append("username", values.username);
    postData.append("password", values.password);
    const headers = setFetchHeaders("POST", postData, true);
    const response = await fetch(`${SERVER1_URL}/api/auth/users/`, headers);
    if (response.ok) {
      await this.props.fetchTokenPair(values.username, values.password);
    }
    if (response.status === 400) {
      const responseData = await response.json();
      let errors = {};
      if (responseData.username) errors.username = responseData.username[0];
      if (responseData.password) errors.password = responseData.password[0];
      actions.setErrors(errors);
      if (responseData._error)
        this.setState({ formError: responseData._error[0] });
    }
    actions.setSubmitting(false);
  }

  validate(values, actions) {
    let errors = {};
    if (!values.username) {
      errors.username = "This field may not be blank";
    }
    if (!values.password) {
      errors.password = "This field may not be blank";
    }
    if (
      values.password === values.confirmPassword &&
      values.password.length < 8
    ) {
      errors.password = "Password should be at least 8 characters long";
    }
    if (
      values.password !== values.confirmPassword &&
      values.password.length >= 8 &&
      values.confirmPassword.length >= 8
    ) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  }

  render() {
    return (
      <Formik
        validate={this.validate}
        initialValues={{ username: "", password: "", confirmPassword: "" }}
        onSubmit={(values, actions) => this.submitForm(values, actions)}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            dirty,
            handleSubmit,
            isSubmitting,
            handleChange,
            handleBlur,
            handleReset
          } = props;
          return (
            <Form
              error={Object.values(errors).length > 0 || !!this.state.formError}
              size="large"
              onSubmit={handleSubmit}
            >
              <Form.Field error={errors.username && touched.username}>
                <label htmlFor="username">Username</label>
                <input
                  name="username"
                  placeholder="Select your username"
                  type="text"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Message error>
                  <ErrorMessage name="username" />
                </Message>
              </Form.Field>
              <Form.Field error={errors.password && touched.password}>
                <label htmlFor="password">Password</label>
                <input
                  name="password"
                  placeholder="Enter a password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Message error>
                  <ErrorMessage name="password" />
                </Message>
              </Form.Field>
              <Form.Field
                error={errors.confirmPassword && touched.confirmPassword}
              >
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  name="confirmPassword"
                  placeholder="Enter your password again"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Message error>
                  <ErrorMessage name="confirmPassword" />
                </Message>
              </Form.Field>
              <Message error>{this.state.formError}</Message>
              <Button
                type="button"
                floated="left"
                color="yellow"
                onClick={handleReset}
                disabled={!dirty || isSubmitting}
              >
                Reset
              </Button>
              <Button
                floated="right"
                type="submit"
                color="black"
                disabled={isSubmitting}
              >
                Sign up
              </Button>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

const mapDispatchToProps = {
  fetchTokenPair
};

export default connect(
  null,
  mapDispatchToProps
)(RegisterForm);
