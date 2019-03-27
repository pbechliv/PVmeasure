import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Button, Message, Checkbox, TextArea } from "semantic-ui-react";
import { Formik, ErrorMessage, FastField, FieldArray } from "formik";
import { toastr } from "react-redux-toastr";
import { setFetchHeaders } from "../lib";
import { HOST_URL } from "..";
import * as actions from "../store/actions";

class RecordingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formError: ""
    };
  }

  async submitForm(values, actions) {
    const postData = new FormData();
    postData.append("group", this.props.match.params.id);
    postData.append("measuring_point", values.measuring_point);
    postData.append("measurements", JSON.stringify(values.measurements));
    postData.append("polarity_test", values.polarity_test);
    postData.append("comment", values.comment);
    const headers = setFetchHeaders("POST", postData);
    const response = await fetch(`${HOST_URL}/recordings/`, headers);
    if (response.ok) {
      toastr.success("You successfully created a new recording");
      const responseData = await response.json();
      this.props.addRecording(responseData);
      if (responseData._error)
        this.setState({ formError: responseData._error[0] });
    } else if (response.status === 400) {
      toastr.error("Something went wrong...");
    }
    actions.setSubmitting(false);
  }

  validate(values, actions) {
    let errors = {
      measurements: values.measurements.map(i => "")
    };
    if (!values.measuring_point) {
      errors.measuring_point = "This field may not be blank.";
    }
    values.measurements.forEach((mr, index) => {
      if (!mr.type && !!mr.value && !!mr.unit) {
        errors.measurements.splice(index, 1, "You must select a type");
      }
      if (!!mr.type && !mr.value && !!mr.unit) {
        errors.measurements.splice(index, 1, "You must set a value");
      }
      if (!!mr.type && !!mr.value && !mr.unit) {
        errors.measurements.splice(index, 1, "You must select a unit");
      }
      if (
        (["voc", "vmppp"].includes(mr.type.toLowerCase()) &&
          ["a", "kw", "ohm", "°c", "w/m2"].includes(mr.unit.toLowerCase())) ||
        (["isc", "imppp"].includes(mr.type.toLowerCase()) &&
          ["v", "kw", "ohm", "°c", "w/m2"].includes(mr.unit.toLowerCase())) ||
        (["pmppp"].includes(mr.type.toLowerCase()) &&
          ["a", "v", "ohm", "°c", "w/m2"].includes(mr.unit.toLowerCase())) ||
        (["tmod", "temp"].includes(mr.type.toLowerCase()) &&
          ["a", "v", "ohm", "kw", "w/m2"].includes(mr.unit.toLowerCase())) ||
        (["irr"].includes(mr.type.toLowerCase()) &&
          ["a", "v", "ohm", "kw", "°c"].includes(mr.unit.toLowerCase()))
      ) {
        errors.measurements.splice(
          index,
          1,
          "Unit or type selected is not correct"
        );
      }
      if (["voc", "vmppp"].includes(mr.type.toLowerCase()) && mr.value < 0) {
        errors.measurements.splice(
          index,
          1,
          "The value should not be negative"
        );
      }
    });
    if (
      errors.measurements.filter(mr => {
        return Object.values(mr).filter(value => !!value).length > 0;
      }).length === 0
    ) {
      delete errors.measurements;
    }
    return errors;
  }
  render() {
    const { currentRecording } = this.props;
    return (
      <>
        <Formik
          validate={this.validate}
          enableReinitialize
          onSubmit={(values, actions) => this.submitForm(values, actions)}
          initialValues={
            currentRecording
              ? currentRecording
              : {
                  measurements: [{ type: "", value: "", unit: "" }],
                  measuring_point: "",
                  comment: "",
                  polarity_test: false
                }
          }
        >
          {props => {
            return (
              <Form
                onSubmit={props.handleSubmit}
                error={
                  Object.values(props.errors).length > 0 ||
                  !!this.state.formError
                }
              >
                <Form.Field required>
                  <label>Measuring point</label>
                  <FastField name="measuring_point" type="text" />
                  <Message error>
                    <ErrorMessage name="measuring_point" />
                  </Message>
                </Form.Field>
                <Form.Field>
                  <label>Measurements</label>
                  <FieldArray name="measurements">
                    {arrayProps => {
                      return (
                        <div>
                          {props.values.measurements.map(
                            (measurement, index) => (
                              <div key={`measurement-input-${index}`}>
                                <Form.Group inline>
                                  <Form.Field
                                    style={{
                                      maxWidth: "100px",
                                      padding: "0 2px 0 0"
                                    }}
                                  >
                                    <FastField
                                      style={{ maxWidth: "90px" }}
                                      list="optionsType"
                                      name={`measurements[${index}].type`}
                                      placeholder="type"
                                      type="text"
                                    />
                                  </Form.Field>
                                  <Form.Field
                                    style={{
                                      maxWidth: "100px",
                                      padding: "0 2px 0 0"
                                    }}
                                  >
                                    <FastField
                                      style={{ maxWidth: "90px" }}
                                      name={`measurements[${index}].value`}
                                      placeholder="value"
                                      type="number"
                                    />
                                  </Form.Field>
                                  <Form.Field
                                    style={{
                                      maxWidth: "100px",
                                      padding: "0 2px 0 0"
                                    }}
                                  >
                                    <FastField
                                      style={{ maxWidth: "90px" }}
                                      list="optionsUnit"
                                      name={`measurements[${index}].unit`}
                                      placeholder="unit"
                                      type="text"
                                    />
                                  </Form.Field>
                                  {props.values.measurements.length > 1 && (
                                    <Button
                                      compact
                                      size="mini"
                                      type="button"
                                      color="red"
                                      circular
                                      onClick={() => arrayProps.remove(index)}
                                    >
                                      -
                                    </Button>
                                  )}
                                </Form.Group>
                                <Message error>
                                  <ErrorMessage
                                    name={`measurements[${index}]`}
                                  />
                                </Message>
                              </div>
                            )
                          )}

                          <Button
                            circular
                            disabled={
                              props.values.measurements.filter(
                                mr =>
                                  Object.values(mr).filter(val => val === "")
                                    .length > 0
                              ).length > 0
                            }
                            compact
                            color="yellow"
                            type="button"
                            onClick={() =>
                              arrayProps.push({ type: "", value: "", unit: "" })
                            }
                          >
                            +
                          </Button>
                        </div>
                      );
                    }}
                  </FieldArray>
                </Form.Field>
                <Form.Field inline>
                  <Checkbox
                    label="Polarity test"
                    name="polarity_test"
                    checked={props.values.polarity_test}
                    onChange={(e, data) =>
                      props.setFieldValue(data.name, data.checked)
                    }
                    onBlur={props.handleBlur}
                  />
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
                </Form.Field>
                <Button
                  type="button"
                  color="yellow"
                  onClick={props.handleReset}
                  disabled={!props.dirty || props.isSubmitting}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  color="black"
                  disabled={props.isSubmitting}
                >
                  Submit
                </Button>
              </Form>
            );
          }}
        </Formik>
        <datalist id="optionsUnit">
          <option value="V" />
          <option value="A" />
          <option value="kW" />
          <option value="Ohm" />
          <option value="°C" />
          <option value="W/m2" />
        </datalist>

        <datalist id="optionsType">
          <option value="Voc" />
          <option value="Vmpp" />
          <option value="Isc" />
          <option value="Impp" />
          <option value="Pmpp" />
          <option value="Tmod" />
          <option value="Temp" />
          <option value="Irr" />
        </datalist>
      </>
    );
  }
}

const mapStateToProps = state => ({
  currentRecording: state.main.currentRecording
});

const mapDispatchToProps = {
  addRecording: actions.addRecording
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RecordingForm)
);
