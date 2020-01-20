import React from "react";
import FollowButton from "./follow_button";
import { ErrorMessage } from ".";
import { TOGGLE_FOLLOW } from "../actions";
import { Mutation } from "react-apollo";

const HashtagCard = ({ id, name, followedByCurrentUser, width, X }) => {
  const style = width ? { width } : {};

  return(
    <div key={id} id={`hashtag-${id}`} className="item hashtag-card" style={style} >
      <a href={`/hashtag/${name}`}><div>{name}</div></a>
      {X ?
        <Mutation mutation={TOGGLE_FOLLOW} >
          {(toggleFollow, { error }) => (
            <div>
              <ErrorMessage error={error} />
              <i className="fa fa-times-circle x" onClick={() => toggleFollow({ variables: { hashtagId: id, type: "hashtag" } })}/>
            </div>
          )}
        </Mutation>
        : <FollowButton
          hashtagId={id}
          following={followedByCurrentUser}
          type={'hashtag'}
        />}
    </div>
  )
}

export default HashtagCard;
