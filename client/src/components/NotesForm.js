import React from "react";
import { connect } from "react-redux";
import { Form, Button, Message, TextArea, Label } from "semantic-ui-react";
import { Formik, ErrorMessage, FastField, Field } from "formik";
import Dropzone from "react-dropzone";
import { toastr } from "react-redux-toastr";
import * as actions from "../store/actions";
import { setFetchHeaders } from "../lib";
import { SERVER2_URL } from "..";

class NoteForm extends React.Component {
  state = {
    formError: "",
    file: null,
    preview: null
  };

  handleFileChange = files => {
    if (!files) {
      return;
    }
    let file = files[0];
    let preview = URL.createObjectURL(file);
    console.log(file.name);
    console.log(preview);
    this.setState({ file, preview });
  };

  async submitForm(values, actions) {
    const postData = new FormData();
    postData.append("user", this.props.userId);
    if (this.state.file) postData.append("image", this.state.file);
    postData.append("title", values.title);
    postData.append("comment", values.comment);
    const headers = setFetchHeaders("POST", postData);
    const response = await fetch(SERVER2_URL + "/notes/", headers);
    if (response.ok) {
      const responseData = await response.json();
      toastr.success("You successfully created a note");
      this.props.addNote(responseData);
      if (responseData._error)
        this.setState({ formError: responseData._error[0] });
    } else if (response.status === 400) {
      toastr.error("Something went wrong...");
    }
    actions.setSubmitting(false);
  }

  validate(values, actions) {
    let errors = {};
    if (!values.title) {
      errors.title = "This field may not be blank.";
    }
    return errors;
  }

  render() {
    const { currentNote } = this.props;
    return (
      <Formik
        enableReinitialize
        validate={this.validate}
        onSubmit={(values, actions) => this.submitForm(values, actions)}
        initialValues={
          currentNote
            ? currentNote
            : {
                title: "",
                comment: ""
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
                <FastField name="title" type="text" />
                <Message error>
                  <ErrorMessage name="title" />
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
              <Dropzone multiple={false} onDrop={this.handleFileChange}>
                {props => (
                  <div
                    style={{ marginBottom: "15px" }}
                    {...props.getRootProps()}
                  >
                    <Label style={{ cursor: "pointer", width: "100%" }}>
                      Select Image
                    </Label>{" "}
                    <input {...props.getInputProps()} />
                    {this.state.file && (
                      <>
                        <p>{this.state.file.name.substring(0, 22)}</p>
                        <img
                          style={{ width: "100%" }}
                          src={this.state.preview}
                          alt=""
                        />
                      </>
                    )}
                  </div>
                )}
              </Dropzone>
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
                {currentNote && (
                  <Button
                    type="button"
                    color="blue"
                    floated="right"
                    disabled={props.isSubmitting}
                    onClick={() => this.props.setCurrentNote(null)}
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
  currentNote: state.main.currentNote
});

const mapDispatchToProps = {
  addNote: actions.addNote,
  setCurrentNote: actions.setCurrentNote
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteForm);
