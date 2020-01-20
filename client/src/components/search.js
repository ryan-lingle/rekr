import React from "react";
import { Query } from "react-apollo";
import { SEARCH } from "../actions";

const Search = ({ term, type, children }) => {
  if (!term) return <div></div>;

  return(
    <Query query={SEARCH} variables={ { term, type }} >
      {({ data, loading, error }) => {
        if (loading) return children({ loading });
        if (error) return children({ error });
        return children({ results: data.search[type].stream });
      }}
    </Query>
  )
}

export default Search;
