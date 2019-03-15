import React from "react";
import { connect } from "react-redux";
import { Form, Button, Message, Checkbox, TextArea } from "semantic-ui-react";
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
      <>
        <Formik
          validate={this.validate}
          onSubmit={(values, actions) => this.submitForm(values, actions)}
          initialValues={{
            measurements: [{ type: "", value: "", unit: "" }],
            measuring_point: "",
            comment: "",
            polarity_test: false
          }}
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
                              <Form.Group
                                key={`measurement-input-${index}`}
                                inline
                              >
                                <Form.Field>
                                  <FastField
                                    list="optionsType"
                                    name={`measurements[${index}].type`}
                                    placeholder="type"
                                  />
                                </Form.Field>
                                <Form.Field>
                                  <FastField
                                    name={`measurements[${index}].value`}
                                    placeholder="value"
                                  />
                                </Form.Field>
                                <Form.Field>
                                  <FastField
                                    list="optionsUnit"
                                    name={`measurements[${index}].unit`}
                                    placeholder="unit"
                                  />
                                </Form.Field>
                                {props.values.measurements.length > 1 && (
                                  <Button
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
                            )
                          )}

                          <Button
                            circular
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

export default connect()(RecordingForm);
