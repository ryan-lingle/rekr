import React from "react";
import { createStream, Episode } from "../components";
import { BOOKMARKS } from '../actions';

const Bookmarks = ({ match }) => {
  const Stream = createStream(Episode);

  const onEmpty = () => (
    <div className="nothing-message">
      Nothing To See Here Yet!
      <br></br>
      Bookmark some Reks and they will show up here!
    </div>
  )

  return(
    <div id="home" >
      <Stream query={BOOKMARKS} onEmpty={onEmpty} />
    </div>
  )
}

export default Bookmarks;
