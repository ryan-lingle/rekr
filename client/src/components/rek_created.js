import React from "react";
import { Loader, ErrorMessage } from ".";
import { Query } from "react-apollo";
import { EPISODE_SHOW } from "../actions";
import TwitterLogo from "../assets/Twitter_Logo_Blue.png";
import { toSats } from "../utils";

const RekCreated = ({ episodeId, rekId }) => {
  return(
    <Query query={EPISODE_SHOW} variables={{ episodeId, rekId: rekId.toString() }} >
      {({ data, loading, error }) => {
        if (loading) return <Loader />;
        if (error) return <ErrorMessage error={error} />;
        const { title, podcast } = data.episodeShow.episode;
        const { satoshis } = data.episodeShow.rek;
        const url = `${window.location.origin}/episode/${episodeId}?rekId=${rekId}`;
        return(
          <div id="rek-created">
            <div id="rc-sats">Success - <strong>{toSats(satoshis)}</strong> Rek created for:</div>
            <div id="rc-episode">
              <img id="rc-podcast-img" src={podcast.image} />
              <div id="rc-episode-title" >{title}</div>
            </div>
            <div id="rc-actions">
              <a className="btn btn-primary" href={url}>
                View Rek
              </a>
              <a className="sign-in-btn" target="_blank" href={`https://twitter.com/intent/tweet?text=I just donated ${toSats(satoshis)} to ${podcast.title} on Rekr. Check out my episode rek:&url=${url}`} >
                <img src={TwitterLogo} width={'30px'} alt="twitter-logo" />
                Share on Twitter
              </a>
            </div>
          </div>
        );
      }}
    </Query>
  )
}

export default RekCreated;
