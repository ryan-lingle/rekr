import React from "react";
import Search from "./nav_search";
import { Navbar } from "react-bootstrap"
import Logo from "../assets/logo.png";

const NoAuthNav = () => (
  <Navbar bg="white" expand="md" fixed={"top"} className="no-auth-nav">
    <div href="/" className="text-primary rekr-brand">
      <img src={Logo} alt="rekr logo" />
    </div>
    <div id="no-auth-left">
      <Search />
      <a href="/login" className="rek-btn btn btn-secondary">Sign Up</a>
    </div>
  </Navbar>
)

export default NoAuthNav;
