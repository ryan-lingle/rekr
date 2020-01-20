import React from "react";
import { ErrorMessage, Search } from ".";

export default class TagInput extends React.Component {
  state = {
    term: "",
    tags: []
  }

  addTag = (tag = this.state.term) => {
    this.setState(prevState => {
      if (!prevState.tags.find(({ name }) => name === tag )) {
        prevState.tags.push({ name: tag });
        this.props.onUpdate(prevState.tags);
        prevState.term = "";
      }
      return prevState;
    });
  }

  removeTag = (_name_) => {
    this.setState(prevState => {
      prevState.tags = prevState.tags.filter(({ name }) => name !== _name_);
      this.props.onUpdate(prevState.tags);
      return prevState;
    });
  }

  tagSuggestions = () => {
    const { term } = this.state;
    if (term) {
      return(
        <Search term={term.toLowerCase()} type={"hashtag"}>
          {({ results, loading, error }) => {
            if (loading) return <div></div>;
            if (error) return <ErrorMessage error={error} />;
            return (
              <div id="tag-suggestions-wrapper">
                <div id="tag-suggestions">
                  {results.map(({ id, name }) =>
                    <div key={id} onClick={() => this.addTag(name)}>
                      {name}
                    </div>
                  )}
                </div>
              </div>
            )
          }}
        </Search>
      )
    }
  }

  render() {
    return(
      <div id="tags">
        {this.state.tags.map(({ name }, i) => (
          <span className="tag" key={i} >
            {name}
            <span className="remove-tag" onClick={() => this.removeTag(name) }>×</span>
          </span>
        ))}
        {this.state.tags.length < 3 ?
          <form onSubmit={(e) => {
            e.preventDefault();
            this.addTag()
          }} id="tag-form" >
            <input autoComplete="off" id="tag-input" value={this.state.term} onChange={({ target }) => this.setState({ term: target.value })} placeholder="Add a topic..." />
          </form>
          : null}
        {this.tagSuggestions()}
      </div>
    )
  }
}


// ××
