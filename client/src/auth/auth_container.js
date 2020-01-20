import React from "react";
import { Navbar } from "react-bootstrap"
import SignUpForm from "./sign_up_form";
import LogInForm from "./login_form";
import { TwitterSignIn, Tooltip } from '../components';
import RekrExplained from '../assets/infographic_1.png';
import Logo from "../assets/logo.png";

class AuthContainer extends React.Component {
  state = {
    redirectToReferrer: false
  }

  handleLogIn = () => {
    try {
      window.location.href = this.props.location.state.from;
    } catch {
      window.location.href = "/";
    }
  }


  render() {
    const warning = this.props.location.search.split('warning=')[1];
    return (
      <div>
        <Navbar bg="white" expand="md" className="auth-nav">
          <Navbar.Brand href="/" className="text-primary rekr-brand">
            <img src={Logo} alt="rekr logo" />
          </Navbar.Brand>
          <LogInForm handleLogIn={this.handleLogIn} />
        </Navbar>
        <div className="auth-container row">
          <div id="auth-left" className="col-sm-6">
            <h1 id="the-rules">The Rules:</h1>
            <ol>
              <li>
                <h1>Make a <Tooltip tooltip="Rek (n) 1. A public donation. 2. A recommendation with skin in the game."><span className="dotted">Rek</span></Tooltip>.</h1>
              </li>
              <li>
                <h1>Tag up to 3 Topics to get listed on Topic Boards.</h1>
              </li>
              <li>
                <h1>Earn 10% on all <Tooltip tooltip="re-Rek (n) 1. A Rek that occurs based on the influence of your initial Rek."><span className="dotted">re-Reks</span></Tooltip>.</h1>
              </li>
              <li>
                <h1>Climb the Topic Boards as your <Tooltip tooltip={"Rek (n) 1. A public donation. 2. A recommendation with skin in the game."}><span className="dotted">Rek</span></Tooltip> spurs more <Tooltip tooltip="re-Rek (n) 1. A Rek that occurs based on the influence of your initial Rek."><span className="dotted">re-Reks</span></Tooltip>.</h1>
              </li>
            </ol>
            <img src={RekrExplained} alt="rekr info graphic" />
          </div>
          <div id="auth-right" className="col-sm-6">
            {warning ? <div id="auth-warning" className="error nice-error" >You must sign up before you can do that action.</div> : null}
            <div id="sign-in-btns">
              <TwitterSignIn />
              <a href="/password-reset/request" style={{ fontSize: "12px" }}>I Forgot My Password</a>
            </div>
            <h2>Sign Up</h2>
            <SignUpForm handleLogIn={this.handleLogIn} />
          </div>
        </div>
      </div>
    )
  }
}

export default AuthContainer;
