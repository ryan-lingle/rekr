import React from  'react';
import { Form, FormControl } from "react-bootstrap";
import { Query } from "react-apollo";
import { SEARCH_EPISODES } from "../actions";
import { Loader, ErrorMessage } from ".";

export default class EpisodeSearch extends React.Component {

  state = {
    term: null
  }

  handleChange = ({ target }) => {
    this.setState({ term: target.value });
  }

  handleSelection = ({ target }) => {
    const episodeId = target.getAttribute('data-id') || target.parentNode.getAttribute('data-id')
    this.props.handleSelection(episodeId);
  }

  searchResults(term) {
    if (term) {
      return(
        <Query query={SEARCH_EPISODES} variables={{ term }}>
          {({ data, loading, error }) => {
            if (loading) return <div className="loader-padding"><Loader /></div>;
            if (error) return <ErrorMessage error={error} />;
            return (
              <div id="episode-results">
                {data.search.episode.stream.map((result) => (
                  this.episodeResult(result)
                ))}
              </div>
            )
          }}
        </Query>
      )
    } else {
      return(
        <div id="before-search">
          Search Results
        </div>
      )
    }
  }

  episodeResult = (episode) => {
    return(
      <div id="episode-result" onClick={this.handleSelection} key={episode.id} data-id={episode.id} >
        <img src={episode.podcast.image} width="60px" alt="podcast art"/>
        <div className="episode-result-title">
          {episode.title}
        </div>
      </div>
    )
  }

  render() {
    const { term } = this.state;
    return(
      <div>
        <Form inline onSubmit={e => e.preventDefault()}>
          <FormControl
            autoFocus={true}
            autoComplete="off"
            type="text"
            placeholder="Search for a Podcast Episode"
            id="episode-search"
            value={term || ""}
            onChange={this.handleChange}
          />
        </Form>
        {this.searchResults(term)}
      </div>
    )
  }
}
