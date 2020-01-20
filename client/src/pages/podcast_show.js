import React from "react";
import { Query } from "react-apollo";
import { ErrorMessage, Loader } from '../components';
import Podcast from "../components/podcast";
import { GET_PODCAST } from "../actions";

const PodcastShow = ({ match }) => {
  return(
    <Query query={GET_PODCAST} variables={match.params} >
      {({ data, loading, error }) => {
        if (loading) return <Loader />;
        if (error) return(
          <div id="user-profile"className="text-center">
            <ErrorMessage error={error} />
          </div>
        );
        return (
          <Podcast {...data.podcast} />
        )
      }}
    </Query>
  )
}

export default PodcastShow;
