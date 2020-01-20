import React from "react";
import Podcast from "./podcast";
import { PARSE_PODCAST, CREATE_PODCAST, CREATE_EPISODES } from '../actions';
import { Mutation, withApollo } from "react-apollo";
import { ErrorMessage, Loader } from ".";

class RssParser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      podcast: null,
    }
    this.rssUrl = React.createRef()
  }


  handlePodcast = ({ parsePodcast }) => {
    this.setState({ podcast: parsePodcast, loading: false })
  }

  episodeReducer = (episode) => {
    const { title, description, released } = episode;
    return { title, description, released }
  }

  handleEpisodeCreate = async (episodes, podcastId, email) => {
    const payload = [];
    episodes.forEach((episode, i) => {
      const { title, description, released } = episode;
      payload.push({ title, description, released });
      if (((i + 1) % 20) === 0) {
        this.props.client.mutate({
          mutation: CREATE_EPISODES,
          variables: {
            podcastId,
            episodes: payload
          }
        });
        payload.length = 0;
      }
    });
    this.props.client.mutate({
      mutation: CREATE_EPISODES,
      variables: {
        podcastId,
        episodes: payload
      }
    }).then(window.location.href = `/email_unconfirmed?email=${email}&id=${podcastId}`)
  }

  handlePodcastCreate = async (createPodcast, podcast) => {
    const { title, image, description, email, website, rss, episodes } = podcast;
    const { data } = await createPodcast({ variables: {
      title, image, description,
      email, website, rss
    }})
    this.handleEpisodeCreate(episodes, data.createPodcast.id, data.createPodcast.email);
  }

  render() {
    const { podcast, loading } = this.state;
    return(
      <div>
        <Mutation mutation={PARSE_PODCAST} onCompleted={this.handlePodcast} >
          {(parsePodcast, { error }) => {
            return(
              <form id="rss-form" onSubmit={(e) => {
                e.preventDefault();
                this.setState({ loading: true })
                parsePodcast({ variables: {
                  rssUrl: this.rssUrl.current.value
                }})
              }}>
                <div id="rss-input">
                  <div className="form-label">RSS Feed</div>
                  <input className="form-control" ref={this.rssUrl} placeholder="https://your-podcast.com/rss-feed.rss" />
                </div>
                <button disabled={podcast} className="btn btn-primary">Fetch</button>
                <Mutation mutation={CREATE_PODCAST}>
                  {(createPodcast, { error }) => (
                    <span >
                      <ErrorMessage error={error} />
                      <button className="btn btn-primary" disabled={!podcast} onClick={() => {
                        this.handlePodcastCreate(createPodcast, podcast)
                      }}>Submit</button>
                    </span>
                  )}
                </Mutation>
              </form>
            )
          }}
        </Mutation>
        {loading ? <Loader /> : null}
        {podcast ? <Podcast {...podcast} hideUnverifiedMessage={true} /> : null}
      </div>
    )
  }
}

export default withApollo(RssParser);
