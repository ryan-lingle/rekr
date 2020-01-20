import React from "react";

const MobileNavBottom = ({ path }) => {
  function current(_path_) {
    return _path_ === path;
  }
  return(
    <div id="mobile-nav-bottom">
      <div id="mobile-tabs">
        <a href="/" className={current("/") ? "nav-current" : ""}>
          <i className="fa fa-home nav-icon" />
          Home
        </a>
        <a href="/bookmarks" className={current("/bookmarks") ? "nav-current" : ""}>
          <i className="fa fa-bookmark nav-icon" />
          Bookmarks
        </a>
        <a href="/notifications" className={current("/notifications") ? "nav-current" : ""}>
          <i className="fa fa-bell nav-icon" />
          Notifications
        </a>
      </div>
    </div>
  )
}

export default MobileNavBottom;
