import React from "react";
import { createStream, User, PodcastCard, HashtagCard } from '../components';
import { SEARCH } from "../actions";

const components = {
  user: User,
  podcast: PodcastCard,
  hashtag: HashtagCard
}

export default class Search extends React.Component {
  state = {
    term: this.props.location.search.split('?q=')[1].replace('%20', ' '),
    type: "user"
  }

  render() {
    const { term, type } = this.state;
    const Stream = createStream(components[type]);

    return (
      <div id="search-results-page">
        <div className="sub-nav-wrapper">
          <div className="sub-nav">
            {['podcast', 'user', 'hashtag'].map((tab, i) => {
              const current = tab === type;
              return(
                <div key={i} className={`sub-nav-tab ${current ? 'current-sub-nav-tab' : null}`} onClick={() => { this.setState({ type: tab })}}>
                  <div>{capitalize(tab)}s</div>
                </div>
              )
            })}
          </div>
        </div>
        <Stream query={SEARCH} variables={{ term, type }} />
      </div>
    )
  }
}

function capitalize(string) {
  const split = string.split('')
  split[0] = split[0].toUpperCase();
  return split.join('')
}
