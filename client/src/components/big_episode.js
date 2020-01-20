import React from 'react';
import { Tooltip, RekModal } from '.';
import { Helmet } from "react-helmet";
import BookmarkButton from './bookmark_button';
import { toSats } from '../utils';

const BigEpisode = ({ episode, rek, saveRek }) => {
  if (saveRek) localStorage.setItem('rekId', rek.id);
  const buildRek = () => {
    if (rek) {
      return(
        <div className="be-rek">
          <a href={"/u/" + rek.user.username}>
            <img src={rek.user.profilePic} alt={"avatar"} className="rounded-circle profile-pic" width={"40px"} />
          </a>
          <span className="font-weight-bold">{rek.user.username} </span>
          donated
          <span className="font-weight-bold"> {toSats(rek.satoshis)} </span>
           {rek.hashtags.length > 0 ? tags() : null}
        </div>
      )
    }
  }

  const tags = () => {
    return(
      <span id="be-tags">
        <span> | </span>
        {rek.hashtags.map(hashtag => <a key={hashtag.id} href={`/hashtag/${hashtag.name}`}>#{hashtag.name}</a>)}
      </span>
    )
  }
  const date = new Date(episode.released);
  return(
    <div className="big-episode-wrapper">
      <Helmet>
        <title>{episode.title}</title>
        <meta name="description" content="Some description." />
        <meta property="og:title" content="Some title." />
        <meta property="og:image" content={episode.podcast.image} />
      </Helmet>
      {buildRek()}
      <div className="big-episode">
        <div className="row" id="big-episode-info">
          <div className="col-md-5 text-center">
            <Tooltip tooltip={episode.podcast.title}>
              <a href={"/podcast/" + episode.podcast.slug}>
                <img className="be-podcast-art" alt={"podcast art"} src={episode.podcast.image} />
              </a>
            </Tooltip>
          </div>
          <div className="col-md-6">
            <div id="be-left">
              <div id="be-info">
                <div className="be-title">{episode.title}</div>
                <div className="be-released">{date.toDateString()}</div>
              </div>
              <div id="be-btns">
                <RekModal episodeId={episode.id}>
                  <div href="#" id="rek-btn" className="rek-btn btn btn-secondary episode-rek-btn">Rek</div>
                </RekModal>
                <Tooltip tooltip={"Bookmark Episode"}>
                  <div>
                    <BookmarkButton bookmarked={episode.bookmarked} episodeId={episode.id} rekId={rek && rek.id} />
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: episode.description }}></div>
      </div>
    </div>
  )
}

export default BigEpisode;
