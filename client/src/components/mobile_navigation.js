import React from "react";
import { Navbar, Dropdown } from "react-bootstrap"
import RekModal from './rek_modal';
import Search from "./nav_search";
import Logo from "../assets/logo.png";

const MobileNavigation = (props) => {
  const username = localStorage.getItem("username");
  const profilePic = localStorage.getItem("profilePic");
  const hasPodcast = localStorage.getItem("hasPodcast");
  return(
    <Navbar bg="white" fixed={"top"} id="mobile-nav">
      <Navbar.Brand href="/" className="text-primary rekr-brand">
        <img src={Logo} alt="rekr logo" />
      </Navbar.Brand>
      <Search />
      <Dropdown>
        <Dropdown.Toggle as="div" >
          <img src={profilePic} alt="avatar" className="rounded-circle" width="35px"/>
        </Dropdown.Toggle>
        <Dropdown.Menu alignRight={true}>
          <Dropdown.Item href={`/u/${username}`} >Profile</Dropdown.Item>
          {hasPodcast === "true" ?
            <Dropdown.Item href="/podcast-dashboard">Podcast Dashboard</Dropdown.Item>
            : <Dropdown.Item href="/create-podcast">Have a Podcast?</Dropdown.Item>}
          <Dropdown.Item onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}>Sign Out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <RekModal>
        <div href="#" className="rek-btn btn btn-secondary">Rek</div>
      </RekModal>
    </Navbar>
  )
}

export default MobileNavigation;
