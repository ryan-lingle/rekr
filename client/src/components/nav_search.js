import React from "react";
import { ErrorMessage } from ".";
import { Search, Tabs } from ".";

export default class NavSearch extends React.Component {
  state = {
    type: "user",
    term: "",
  }

  handleTermChange = ({ target }) => {
    this.setState({ term: target.value })
  }

  hashtagResult = ({ id, name }) => {
    return(
      <a key={id} className="search-result text-center" href={`/hashtag/${name}`} >
        {name}
      </a>
    )
  }

  podcastResult = ({ id, image, title, slug }) => {
    return(
      <a key={id} className="podcast-result search-result" href={`/podcast/${slug}`} >
        <img src={image} width="60px" alt="podcast art"/>
        <div>{title}</div>
      </a>
    )
  }

  userResult = ({ id, profilePic, username }) => {
    return(
      <a key={id} className="search-result" href={`/u/${username}`} >
        <img src={profilePic} alt={"avatar"} className="rounded-circle" width={"60px"} />
        <div>{username}</div>
      </a>
    )
  }

  handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/search?q=${this.state.term}`
  }


  render() {
    const { term, type } = this.state;
    return(
      <form id="search-form" onSubmit={this.handleSubmit}>
        <input
          className="form-control"
          type="text"
          placeholder="Search Rekr"
          value={term}
          onChange={this.handleTermChange}
        />
        <Search term={term} type={type} >
          {({ results, loading, error }) => {
            if (loading) return <div className="loader-padding"></div>;
            if (error) return <ErrorMessage error={error} />;
            return (
              <div id="search-results">
                <Tabs
                  tabs={["podcast", "user", "hashtag"]}
                  pluralize={true}
                  _default={"user"}
                  onChange={tab => this.setState({ type: tab })}
                  customClass="search-tab"
                  selectedClass="current-search-tab"
                />
                <div>
                  {results.map((result) => (
                    this[type + 'Result'](result)
                  ))}
                </div>
              </div>
            )
          }}
        </Search>
      </form>
    )
  }
}
