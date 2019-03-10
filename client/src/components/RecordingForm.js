import React from "react";
import { connect } from "react-redux";
import { Container } from "semantic-ui-react";
import { Form, Button, Message } from "semantic-ui-react";
import { Formik, ErrorMessage, FastField, FieldArray } from "formik";

class RecordingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formError: ""
    };
  }

  render() {
    return (
      <Formik>
        {props => {
          return (
            <Form
              onSubmit={props.handleSubmit}
              error={
                Object.values(props.errors).length > 0 || !!this.state.formError
              }
            >
              <Form.Field required>
                <label>Measuring point</label>
                <FastField name="measuring_point" type="text" />
                <Message error>
                  <ErrorMessage name="measuring_point" />
                </Message>
              </Form.Field>
              <FieldArray>
                  
              </FieldArray>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

export default connect()(RecordingForm);
