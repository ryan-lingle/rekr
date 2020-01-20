import React from "react";
import HashtagCard from "./hashtag_card";
import { useFollowedHashtags } from "../hooks";

function HashtagBox(props) {
  const hashtags = useFollowedHashtags(props.hashtags);

  const buildHashtags = () => {
    return hashtags.map(hashtag => {
      return(
        <HashtagCard {...hashtag} key={hashtag.id} width={"100%"} X={true}/>
      )
    })
  }
  return(
    <div id="hashtag-box">
      <h3 id="hashtag-box-heading">Followed Topics</h3>
      <div className="hashtags">
        {hashtags.length > 0 ?
          buildHashtags()
          : <div id="no-topic-msg">
              <div>You aren't following any Topics yet.</div>
              <br></br>
              <div>Recomended Topics:</div>
              <a href="/hashtag/bitcoin">bitcoin</a>
            </div>}
      </div>
    </div>
  )
}

export default HashtagBox;
