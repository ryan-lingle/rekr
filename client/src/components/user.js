import React from "react";
import FollowButton from "./follow_button";

const User = ({ id, current, followedByCurrentUser, username, profilePic }) => {
  return(
    <div className="user item">
      <a href={"/u/" + username}>
        <img src={profilePic} alt={"avatar"} className="rounded-circle user-profile-pic profile-pic" width={"60px"} />
      </a>
      <a className="user-username" href={"/u/" + username}>
        {username}
      </a>
      <FollowButton
        current={current}
        followeeId={id}
        following={followedByCurrentUser}
        type={'user'}
      />
    </div>
  )
}

export default User;
