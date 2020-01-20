import React from "react";
import { Mutation } from "react-apollo";
import { LOGIN_USER } from "../actions";
import { ErrorMessage } from "../components";

const SignUpForm = (props) => {
  let username, password;

  const handleLogIn = ({ logIn }) => {
    localStorage.setItem('id', logIn.id);
    localStorage.setItem('token', logIn.token);
    localStorage.setItem('username', logIn.username);
    localStorage.setItem('profilePic', logIn.profilePic);
    localStorage.setItem('email', logIn.email);
    localStorage.setItem('hasPodcast', logIn.hasPodcast);
    props.handleLogIn();
  }

  return(
    <Mutation mutation={LOGIN_USER} onCompleted={handleLogIn} >
      {(logIn, { error }) => (
        <span className="login-inline">
          <form id="login-form" onSubmit={(e) => {
              e.preventDefault();
              const variables = {
                username: username.value,
                password: password.value
              };
              logIn({ variables })
            }}>
            <input
              className="form-control"
              type="text"
              placeholder="Username"
              ref={node => { username = node }}
            />
            <input
              className="form-control"
              type="password"
              placeholder="Password"
              ref={node => { password = node }}
            />
            <button className="btn btn-primary">Sign In</button>
          </form>
          <ErrorMessage
            error={error}
            position={{
              top: "55px",
              right: "70px"
            }}
          />
        </span>
      )}
    </Mutation>
  )
}

export default SignUpForm;
