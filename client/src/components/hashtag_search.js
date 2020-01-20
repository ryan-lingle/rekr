import React, { useState } from 'react';
import { Search, ErrorMessage, Loader, HashtagCard } from "../components";

const HashtagSearch = () => {
  const [term, setTerm] = useState('');

  return(
    <div id="og-hashtag-search">
      <input
        placeholder="Search for some topics to follow!"
        className="form-control"
        value={term}
        onChange={({ target }) => setTerm(target.value)}
      />
      <Search term={term} type={'hashtag'}>
        {({ results, error, loading }) => {
          if (loading) return <Loader />;
          if (error) return <ErrorMessage error={error} />;
          return(
            <div id="hashtag-results">
              {results.map(hashtag =>
                <HashtagCard {...hashtag} key={hashtag.id} width={"100%"} />
              )}
            </div>
          )
        }}
      </Search>
    </div>
  )
}

export default HashtagSearch;
