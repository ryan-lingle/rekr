import React from "react";
import { Query } from "react-apollo";
import { BigEpisode, Loader, ErrorMessage } from "../components";
import { EPISODE_SHOW } from "../actions";

const EpisodeShow = ({ match: { params }, location: { search } }) => {
  const { rekId, saveRek } = parseParams(search.split('?')[1]);
  const { episodeId } = params;
  return(
    <div id="home">
      <Query query={EPISODE_SHOW} variables={{ rekId, episodeId }}>
        {({ loading, data, error }) => {
          if (loading) return <Loader />;
          if (error) return <ErrorMessage error={error} />;

          return <BigEpisode
                  episode={data.episodeShow.episode}
                  rek={data.episodeShow.rek}
                  saveRek={saveRek}
                />;
        }}
      </Query>
    </div>
  )
};

function parseParams(params) {
  const res = {};
  params && params.split('&').forEach(pair => {
    const split = pair.split("=");
    res[split[0]] = split[1];
  })
  return res;
}

export default EpisodeShow;
