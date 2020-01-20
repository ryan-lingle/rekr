import React from "react";
import { Tooltip, ErrorMessage } from ".";
import Rek from "./rek";
import User from "./user";
import Episode from "./episode"
import createStream from "./stream";
import FollowButton from "./follow_button";
import Wallet from "./user_wallet.js";
import ImageEditor from "./image_editor";
import { FormControl } from "react-bootstrap";
import { Mutation } from "react-apollo";
import {
  UPDATE_USER,
  DELETE_USER,
  REK_STREAM,
  FOLLOWING_STREAM,
  FOLLOWER_STREAM,
  BOOKMARK_STREAM } from "../actions";

import { toSats } from "../utils";

const tabs = ['reks', 'bookmarks', 'following', 'followers'];

const tabMap = {
  reks: {
    component: Rek,
    query: REK_STREAM
  },
  following: {
    component: User,
    query: FOLLOWING_STREAM
  },
  followers: {
    component: User,
    query: FOLLOWER_STREAM
  },
  bookmarks: {
    component: Episode,
    query: BOOKMARK_STREAM
  }
}


export default class UserNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      editBio: false,
    }
    if (tabs.includes(this.props.tab)) {
      this.state.tab = this.props.tab
    } else {
      this.state.tab = this.props.current ? "satoshis" : "reks";
    }
  }

  userBio = () => {
    const bio = () => (
      <div>
        <div className="bio-username">{this.props.username}</div>
        {this.props.current && !this.props.bio ?
          <div className="create-bio" onClick={() => this.setState({ editBio: true })}>
            Write Bio
           </div>
          : <div className={this.props.bio ? "bio-description" : null}>{this.props.bio}</div>}
      </div>
    )

    const edit = () => {
      let username, bio;
      return(
        <Mutation mutation={UPDATE_USER} >
          {(updateUser, { error }) => (
            <div>
              <ErrorMessage error={error} />
              <form id="edit-user-form" onSubmit={async (e) => {
                e.preventDefault();
                const { data, error } = await updateUser({ variables: {
                  username: username.value,
                  bio: bio.value
                }});
                if (!error) {
                  localStorage.setItem('username', data.updateUser.username);
                  window.location.href = `/u/${data.updateUser.username}`;
                }
              }}>
                <FormControl
                  type="text"
                  ref={node => { username = node }}
                  defaultValue={this.props.username}
                />
                <FormControl
                  ref={node => { bio = node }}
                  defaultValue={this.props.bio}
                  as="textarea"
                  maxLength="150"
                  rows="3"
                  placeholder="Write a Bio..."
                />
                <button className="btn btn-secondary">Update</button>
                <button className="btn btn-secondary" onClick={(e) => {
                  e.preventDefault();
                  this.setState({ editBio: false });
                }} >Cancel</button>
                <Mutation mutation={DELETE_USER} onCompleted={() => {
                  localStorage.clear();
                  window.location.reload();
                }}>
                  {(deleteUser, { error}) =>
                    <a id="delete-user" onClick={() => {
                      if (window.confirm('ARE YOU SURE YOU WANT TO DELETE THIS ACCOUNT?')) {
                        deleteUser();
                      }
                    }} >Delete this Account</a>
                  }
                </Mutation>
              </form>
            </div>
          )}
        </Mutation>
      )
    }

    return(
      <div className="user-bio">
        {this.props.current && !this.state.editBio ?
          <Tooltip tooltip={'Edit Profile'}>
            <i className="fa fa-pencil edit-user" onClick={() => this.setState({ editBio: true })} />
          </Tooltip>
          : null}
        {this.state.editBio ? edit() : bio()}
      </div>
    )
  }


  editAvatar = () => {
    document.getElementById('avatar-input').click()
  }

  handleFileUpload = ({ target }) => {
    this.setState({
      image: target.files[0]
    })
  }

  removeFile = () => {
    this.setState({
      image: null
    })
  }

  render() {
    const { tab } = this.state;
    const onSats = tab === "satoshis";
    const { component, query } = tabMap[tab] || {};
    const Stream = createStream(component);

    return(
      <div id="user-profile-parent">
        <div className="pic-and-bio">
          {this.props.current ?
            <Tooltip tooltip={'Edit Profile Pic'}>
              <img
                src={this.props.profilePic}
                id="user-profile-avatar"
                className="current-user-avatar"
                alt="avatar"
                onClick={this.props.current ? this.editAvatar : null}
              />
            </Tooltip>
            : <img
                src={this.props.profilePic}
                id="user-profile-avatar"
                alt={"avatar"}
              />}
          <div>
            {this.userBio()}
            <div className="d-block d-md-none">
              <FollowButton
                current={this.props.current}
                followeeId={this.props.id}
                following={this.props.followedByCurrentUser}
                type={'user'}
              />
            </div>
          </div>
        </div>
        <div className="sub-nav-wrapper">
          <div className="sub-nav">
            {this.props.current ?
              <div className={`sub-nav-tab sub-nav-sats ${onSats ? 'current-sub-nav-tab' : null}`} onClick={() => { this.setState({ tab: "satoshis" })}} >
                <div className="text-center font-weight-bold">{toSats(this.props.satoshis, false)}</div>
                <div>Sats</div>
              </div>
              : null}
            {tabs.map((_tab_, i) => {
              const current = _tab_ === tab;
              return(
                <div key={i} className={`sub-nav-tab ${current ? 'current-sub-nav-tab' : null}`} onClick={() => { this.setState({ tab: _tab_ })}}>
                  <div className="text-center font-weight-bold">{toSats(this.props[_tab_].count, false)}</div>
                  <div>{capitalize(_tab_)}</div>
                </div>
              )
            })}
            <div className="d-none d-md-block">
              <FollowButton
                current={this.props.current}
                followeeId={this.props.id}
                following={this.props.followedByCurrentUser}
                type={'user'}
              />
            </div>
            <input type="file" id="avatar-input" accept="image/jpeg,image/png,image/webp" onChange={this.handleFileUpload} />
          </div>
        </div>
        {onSats ?
          <Wallet satoshis={this.props.satoshis} />
          :  <Stream query={query} variables={{ userId: this.props.id }} />}
        {this.state.image ? <ImageEditor image={this.state.image} removeFile={this.removeFile} /> : null}
      </div>
    )
  }
}

function capitalize(string) {
  const split = string.split('')
  split[0] = split[0].toUpperCase();
  return split.join('')
}
