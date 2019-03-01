import React, { Component } from "react";
import { connect } from "react-redux";
import { Segment, Grid, Form, Button, Message } from "semantic-ui-react";
import { Formik, ErrorMessage } from "formik";
import { fetchTokenPair } from "../auth/authActions";
import { startAnim } from "../auth/esaAnimation";

class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.state = { loginError: "" };
  }
  componentDidMount() {
    // startAnim();
  }

  validate(values, actions) {
    let errors = {};
    if (!values.username) {
      errors.username = "This field may not be blank.";
    }
    if (!values.password) {
      errors.password = "This field may not be blank.";
    }
    return errors;
  }

  async login(values, actions) {
    const response = await this.props.fetchTokenPair(
      values.username,
      values.password
    );
    if (response.status === 400) {
      const responseData = await response.json();
      let errors = {};
      if (responseData.username) errors.username = responseData.username[0];
      if (responseData.password) errors.password = responseData.password[0];
      actions.setErrors(errors);
      if (responseData._error)
        this.setState({ loginError: responseData._error[0] });
    }
    actions.setSubmitting(false);
  }

  render() {
    return (
      <>
        <div
          id="bgr"
          style={{ position: "fixed", top: 0, bottom: 0, zIndex: -1 }}
        />
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "15px"
          }}
        >
          <img src={"/uniwa.png"} height="200px" alt="" />
        </div>
        <Grid textAlign="center" style={{ height: "100vh" }}>
          <Grid.Column verticalAlign="middle">
            <Segment.Group compact size="huge" style={{ minWidth: "320px" }}>
              <Segment inverted color="black">
                PV Measurements
              </Segment>
              <Segment style={{ backgroundColor: "rgba(240,240,240,0.9)" }}>
                <Formik
                  validate={this.validate}
                  initialValues={{ username: "", password: "" }}
                  onSubmit={(values, actions) => this.login(values, actions)}
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
                        error={
                          Object.values(errors).length > 0 ||
                          !!this.state.loginError
                        }
                        size="large"
                        onSubmit={handleSubmit}
                      >
                        <Form.Field
                          required
                          error={errors.username && touched.username}
                        >
                          <label htmlFor="username">Username</label>
                          <input
                            name="username"
                            placeholder="Enter your username"
                            type="text"
                            value={values.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <Message error>
                            <ErrorMessage name="username" />
                          </Message>
                        </Form.Field>
                        <Form.Field
                          required
                          error={errors.password && touched.password}
                        >
                          <label htmlFor="password">Password</label>
                          <input
                            name="password"
                            placeholder="Enter your password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <Message error>
                            <ErrorMessage name="password" />
                          </Message>
                        </Form.Field>
                        <Message error>{this.state.loginError}</Message>
                        <Button
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
                          Log in
                        </Button>
                      </Form>
                    );
                  }}
                </Formik>
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

const mapDispatchToProps = {
  fetchTokenPair
};

export default connect(
  null,
  mapDispatchToProps
)(AuthPage);
