import React from "react";
import { Mutation } from "react-apollo";
import { RESET_PASSWORD_REQUEST, RESET_PASSWORD } from "../actions";
import { ErrorMessage } from "../components";
import { NotificationManager } from 'react-notifications';

export default class PasswordReset extends React.Component {
  email = React.createRef()
  password = React.createRef()
  passwordCopy = React.createRef()

  state = {
    email: null
  }

  onRequest = ({ resetPasswordRequest }) => {
    this.setState({ email: resetPasswordRequest });
  }

  onUpdate = ({ resetPassword }) => {
    if (resetPassword) {
      NotificationManager.info('Password Updated');
      setTimeout(() => window.location.href = "/login", 2000);
    }
  }

  render() {
    const { params } = this.props.match;

    if (params.token === "request") {
      if (this.state.email) {
        return(
          <div className="message-box">
            <h1>
              An email has been sent to <strong>{this.state.email}</strong>.
              <br></br>
              Please check that email for further directions.
            </h1>
          </div>
        )
      } else {
        return(
          <Mutation mutation={RESET_PASSWORD_REQUEST} onCompleted={this.onRequest} >
            {(resetPassword, { error }) => (
              <div>
                <ErrorMessage error={error} />
                <form id="password-reset" onSubmit={(e) => {
                  e.preventDefault();
                  resetPassword({ variables: { email: this.email.current.value }})
                }}>
                  <h3>Enter Your Email</h3>
                  <input className="form-control" ref={this.email} placeholder="Your Email..." />
                </form>
              </div>
            )}
          </Mutation>
        )
      }
    } else {
      return(
        <Mutation mutation={RESET_PASSWORD} onCompleted={this.onUpdate} >
          {(resetPassword, { error }) => (
            <div id="password-reset-wrapper">
              <h3>Update your Password</h3>
              <ErrorMessage error={error} />
              <form id="password-reset" onSubmit={(e) => {
                e.preventDefault();
                resetPassword({ variables: {
                  token: params.token,
                  password: this.password.current.value,
                  passwordCopy: this.passwordCopy.current.value
                }})
              }}>
                <div className="form-group">
                  <div className="form-label">New Password</div>
                  <input type="password"  className="form-control" ref={this.password} placeholder="password" />
                </div>
                <div className="form-group">
                  <div className="form-label">Re-Enter Password</div>
                  <input type="password" className="form-control" ref={this.passwordCopy} placeholder="password" />
                </div>
                <button className="btn btn-primary" >
                  Update Password
                </button>
              </form>
            </div>
          )}
        </Mutation>
      )
    }
  }
}

