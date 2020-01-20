import React from 'react';
import BookmarkButton from './bookmark_button';
import { observer, toSats } from '../utils';
import { CREATE_REK_VIEW } from "../actions";
import { withApollo } from "react-apollo";
import Tooltip from "./tooltip";

class Rek extends React.Component {

  componentDidMount() {
    if (localStorage.getItem('token')) {
      const rekCallback = ({ target }) => {
        const rekId = parseInt(target.id.split("-")[1]);
        this.props.client.mutate({
          mutation: CREATE_REK_VIEW,
          variables: {
            rekId
          }
        });
      }

      const rekObserver = observer(rekCallback);
      const rek = document.getElementById(`rek-${this.props.id}`);

      rekObserver.observe(rek);
    }
  }

  handleClick = ({ target }) => {
    if (target.id !== "bookmark-btn") {
      window.location.href = `/episode/${this.props.episode.id}?rekId=${this.props.id}`;
    }
  }

  render() {
    const { user, episode, id, hashtags, satoshis, variables } = this.props;
    const { podcast } = episode;
    const valueGenerated = toSats(this.props[`${variables.timePeriod}ValueGenerated`]);

    return(
      <div className="rek item" id={`rek-${id}`}>
        <div className="rek-wrap">
          <div className="rek-flex rek-details">
            <div >
              rek'd by <a className="rek-username" href={"/u/" + user.username}>{user.username}</a> in
            </div>
            <div id="rek-hashtags">
              {hashtags.map(hashtag => <a key={hashtag.id} href={`/hashtag/${hashtag.name}`} className="rek-hashtag">#{hashtag.name}</a>)}
            </div>
          </div>
          <div className="rek-details rek-sats" >
            generated <span className="sats-sats"> {valueGenerated} </span> sats this {variables.timePeriod}
            <Tooltip tooltip={`${user.username}'s initial donation of
              ${toSats(satoshis)}
              has influenced a total of ${valueGenerated}
              donations this ${variables.timePeriod}.`}>
              <i className="fa fa-question-circle" />
            </Tooltip>
          </div>
          <div className="rek-flex rek-main" id="rek-flex-1">
            <Tooltip tooltip={podcast.title}>
              <a href={`/podcast/${podcast.slug}`}>
                <img src={podcast.image} alt="podcast art" className="rek-podcast-art"/>
              </a>
            </Tooltip>
            <div className="rek-middle">
              <a className="rek-episode-details" href={`/episode/${this.props.episode.id}?rekId=${this.props.id}`}>{podcast.title}<br></br>{episode.title}</a>
            </div>
            <div className="rek-bookmark">
              <Tooltip tooltip={"Bookmark Episode"}>
                <BookmarkButton bookmarked={episode.bookmarked} episodeId={episode.id} rekId={id} />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withApollo(Rek);
