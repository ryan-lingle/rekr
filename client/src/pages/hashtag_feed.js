import React, { useState } from "react";
import { createStream, Rek, UserBox, HashtagBox, FollowButton, Loader, ErrorMessage, Tabs } from "../components";
import { HASHTAG_FEED, GET_HASHTAG, CURRENT_USER } from '../actions';
import { Query } from "react-apollo";
import { useSubNav } from "../hooks";

const HashtagFeed = ({ match: { params }}) => {

  const isLoggedIn = localStorage.getItem('token');
  const Stream = createStream(Rek);
  const [timePeriod, setTimePeriod] = useState("month");

  useSubNav();

  return(
    <div id="home">
      <Query query={GET_HASHTAG} variables={params} >
        {({ data, error, loading}) => {
          if (loading) return <div></div>;
          if (error) return <div id="home"><ErrorMessage error={error} /></div>;
          const { name, followedByCurrentUser, id } = data.hashtag;
          return (
            <div id="sub-nav">
              <h3 id="hashtag-header">
                {name}
              </h3>
              <FollowButton
                hashtagId={id}
                following={followedByCurrentUser}
                type={'hashtag'}
              />
              <div id="hashtag-divider"></div>
              <Tabs
                tabs={["week", "month", "century"]}
                onChange={_tab_ => setTimePeriod(_tab_)}
                _default={timePeriod}
              />
            </div>
          );
        }}
      </Query>
      {isLoggedIn ? <Query query={CURRENT_USER} >
        {({ data, error, loading}) => {
          if (loading) return <Loader />;
          if (error) return <ErrorMessage error={error} />;

          const { currentUser } = data;

          return (
            <div className="row">
              <div className="col-md-12 col-lg-3 user-box-col">
                <UserBox {...currentUser} />
              </div>
              <div className="col-lg-6 col-md-12 feed-col">
                <Stream query={HASHTAG_FEED} variables={{...params, timePeriod}} />
              </div>
              <div className="col-sm-3 d-none d-lg-block hashtag-col">
                <HashtagBox hashtags={currentUser.followedHashtags} />
              </div>
            </div>
          )
        }}
      </Query>
      : <div className="col-lg-6 col-md-12 offset-md-3 feed-col">
          <Stream query={HASHTAG_FEED} variables={params} />
        </div>}
    </div>
  )
};

export default HashtagFeed;
