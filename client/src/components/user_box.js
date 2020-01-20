import React from "react";
import HashtagCard from "./hashtag_card";
import { toSats } from "../utils";

export default class UserBox extends React.Component {
  state = {
    showTags: false
  }

  hashtagList = () => {
    const hashtags = this.props.followedHashtags;
    if (this.state.showTags) {
      return(
        <div className="hashtags">
          {hashtags.length > 0 ?
            hashtags.map(hashtag =>
              <HashtagCard {...hashtag} key={hashtag.id} width={"100%"} X={true}/>)
              : <div id="no-topic-msg">
                  <div>You aren't following any Topics yet.</div>
                  <br></br>
                  <div>Recomended Topics:</div>
                  <a href="/hashtag/bitcoin">bitcoin</a>
                </div>}
        </div>
      )
    }
  }

  render() {
    const { username, profilePic, satoshis,
      bookmarks, following, followers, reks } = this.props;
    return(
      <div id="user-box" >
        <div id="user-box-flex">
          <a href={`/u/${username}`} >
            <img src={profilePic} alt="avatar" className="rounded-circle profile-pic" id="user-box-profile-pic" />
          </a>
          <a id="user-box-username" href={`/u/${username}`} >
            {username}
          </a>
        </div>
        <a id="user-box-satoshis" href={`/u/${username}?tab=satoshis`} >
          {toSats(satoshis)}
        </a>
        <div id="user-box-counts">
          <a className="user-box-count" href={`/u/${username}?tab=reks`}>
            <div className="count">{reks.count}</div>
            <div className="count-label">Reks</div>
          </a>
          <a className="user-box-count" href={`/u/${username}?tab=bookmarks`}>
            <div className="count">{bookmarks.count}</div>
            <div className="count-label">Bookmarks</div>
          </a>
          <a className="user-box-count" href={`/u/${username}?tab=following`}>
            <div className="count">{following.count}</div>
            <div className="count-label">Following</div>
          </a>
          <a className="user-box-count" href={`/u/${username}?tab=followers`}>
            <div className="count">{followers.count}</div>
            <div className="count-label">Followers</div>
          </a>
        </div>
        <div className="d-block d-lg-none">
          <div
            onClick={() => this.setState(({ showTags }) => { return { showTags: !showTags } })}
            id="user-box-satoshis">
            Followed Hashtags
          </div>
          {this.hashtagList()}
        </div>
      </div>
    )
  }
}
