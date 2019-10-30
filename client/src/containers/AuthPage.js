import React, { Component } from "react";
import { Segment, Grid } from "semantic-ui-react";
import { startAnim } from "../auth/myAnimation";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      state: "login"
    };
  }

  componentDidMount() {
    startAnim();
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
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
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
                <div
                  style={{
                    marginBottom: "1rem"
                  }}
                >
                  {this.state.state === "signup" ? (
                    <small
                      style={{
                        cursor: "pointer",
                        color: "grey"
                      }}
                      onClick={() => this.setState({ state: "login" })}
                    >
                      Back to login
                    </small>
                  ) : (
                    <small
                      style={{
                        cursor: "pointer",
                        color: "grey"
                      }}
                      onClick={() => this.setState({ state: "signup" })}
                    >
                      Sign up if you don't have an account
                    </small>
                  )}
                </div>
                {this.state.state === "login" ? (
                  <LoginForm />
                ) : (
                  <RegisterForm />
                )}
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid>
      </>
    );
  }
}
export default AuthPage;
