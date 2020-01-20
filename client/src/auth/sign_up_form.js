import React from "react";
import { Form } from "react-bootstrap"
import { Mutation } from "react-apollo";
import { SIGN_UP_USER } from "../actions";
import { ErrorMessage } from "../components";

const SignUpForm = (props) => {
  let email, username, password, passwordCopy, rek;
  const rekId = localStorage.getItem('rekId');

  const handleLogIn = ({ createUser }) => {
    localStorage.setItem('id', createUser.id);
    localStorage.setItem('token', createUser.token);
    localStorage.setItem('username', createUser.username);
    localStorage.setItem('profilePic', createUser.profilePic);
    localStorage.setItem('email', createUser.email);
    localStorage.setItem('hasPodcast', createUser.hasPodcast);
    props.handleLogIn();
  }

  return(
    <Mutation mutation={SIGN_UP_USER} onCompleted={handleLogIn} >
      {(logIn, { error }) => (
        <div>
          <ErrorMessage error={error} />
          <div>
            <Form id="sign-up-form" onSubmit={(e) => {
              e.preventDefault();
              const variables = {
                email: email.value,
                username: username.value,
                password: password.value,
                passwordCopy: passwordCopy.value,
                rekId: rek.value
              };
              logIn({ variables })
            }}>
              <Form.Group >
                <Form.Label>Username</Form.Label>
                <Form.Control type="username" placeholder="Username" ref={node => { username = node }} />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" ref={node => { email = node }} />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" ref={node => { password = node }} />
              </Form.Group>
              <Form.Group controlId="reenter-password">
                <Form.Label>Re-Enter Password</Form.Label>
                <Form.Control type="password" placeholder="Password" ref={node => { passwordCopy = node }} />
              </Form.Group>
              <input type="hidden" value={rekId || undefined} ref={node => { rek = node }} />
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </Form>
          </div>
        </div>)
      }
    </Mutation>
  )
}

export default SignUpForm;
