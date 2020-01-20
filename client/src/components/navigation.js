import React from 'react'
import DesktopNavigation from "./desktop_navigation";
import MobileNavigation from "./mobile_navigation";
import MobileNavBottom from "./mobile_nav_bottom";

const Navigation = ({ location }) => {
  return(
    <div>
      <div className="d-none d-md-block">
        <DesktopNavigation path={location.pathname} />
      </div>
      <div className="d-block d-md-none">
        <MobileNavigation />
      </div>
      <div className="d-block d-md-none">
        <MobileNavBottom path={location.pathname} />
      </div>
    </div>
  )
}

export default Navigation;
