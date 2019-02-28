import React from "react";
import { connect } from "react-redux";
import { Segment, Grid, Form, Button, Message } from "semantic-ui-react";
import { Formik, ErrorMessage, FastField } from "formik";
import "semantic-ui-css/semantic.min.css";

class GroupForm extends React.Component {
  render() {
    return (
      <Formik
        initialValues={{
          name: "",
          date: ""
        }}
      >
        {props => {
          return (
            <Form>
              <Form.Field>
                <label>Name</label>
                <FastField name="name" type="text" />
              </Form.Field>
              <Form.Field>
                <label>Date</label>
                <FastField name="date" type="date" />
              </Form.Field>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

export default GroupForm;
