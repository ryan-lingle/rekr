import React from "react";
import { Mutation } from "react-apollo";
import { TOGGLE_FOLLOW } from "../actions";
import { ErrorMessage } from ".";

export default class FollowButton extends React.Component {

  state = {
    following: this.props.following
  }

  enter = ({ target }) => {
    target.innerHTML = "Unfollow";
  }

  leave = ({ target }) => {
    target.innerHTML = "Following";
  }

  toggle = ({ toggleFollow }) => {
    this.setState({ following: toggleFollow })
  }

  render() {
    if (this.props.current) {
      return(<div className="follow-btn"></div>)
    }


    const { followeeId, hashtagId, type } = this.props;

    if (!this.state.following) {
      return(
        <Mutation mutation={TOGGLE_FOLLOW} onCompleted={this.toggle} >
          {(toggleFollow, { error }) => (
            <div>
              <ErrorMessage error={error} />
              <div onClick={() => toggleFollow({ variables: { followeeId, hashtagId, type } })} className="btn btn-secondary follow-btn">Follow</div>
            </div>
          )}
        </Mutation>
      )
    } else {
      return(
        <Mutation mutation={TOGGLE_FOLLOW} onCompleted={this.toggle} >
          {(toggleFollow, { error }) => (
            <div>
              <ErrorMessage error={error} />
              <div onClick={() => toggleFollow({ variables: { followeeId, hashtagId } })} onMouseEnter={this.enter} onMouseLeave={this.leave} className="btn btn-primary follow-btn unfollow-btn">Following</div>
            </div>
          )}
        </Mutation>
      )
    }

  }
};
