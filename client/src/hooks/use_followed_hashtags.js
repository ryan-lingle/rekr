import { useState, useEffect } from "react";
import { SUBSRIBE_HASHTAGS } from '../actions'
import client from "../index";


function useFollowedHashtags(defaultHashtags) {
  const [hashtags, setHashtags] = useState(defaultHashtags);

  const handleUpdate = ({ follow, hashtag }) => {
    follow ? addHashtag(hashtag) : removeHashtag(hashtag.id);
  }

  const addHashtag = (hashtag) => {
    setHashtags(hashtags.concat([ hashtag ]))
  }

  const removeHashtag = (id) => {
    setHashtags(hashtags => {
      return hashtags.filter(hashtag => hashtag.id !== id.toString());
    });
  }

  useEffect(() => {
    const subscription = client.subscribe({
      query: SUBSRIBE_HASHTAGS
    }).subscribe({
      next({ data: { hashtags } }) {
        handleUpdate(hashtags);
      },
      error(err) { console.error(err); },
    });

    return () => subscription.unsubscribe();
  })

  return hashtags;
}

export default useFollowedHashtags;
