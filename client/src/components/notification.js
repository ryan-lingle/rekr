import React from "react";
import { toSats } from "../utils";

const Notification = ({ notifier, rek, type, satoshis }) => {
  const index = {
    bookmark: {
      icon: "bookmark",
      copy: "Bookmarked"
    },
    rek: {
      icon: "coins",
      copy: "Rerek'd"
    },
    follow: {
      icon: "user",
      copy: "Sucked"
    }
  };
  if (!rek) return (
    <div className="item notification-card">
      <div className="fa fa-user bookmark-notification"></div>
      <div className="notification-description">
        <a href={"/u/" + notifier.username}>
          <img src={notifier.profilePic} alt={"avatar"} className="rounded-circle profile-pic" width={"40px"} />
        </a>
        <div>
          <a href={"/u/" + notifier.username}>
            <span className="font-weight-bold notification-username">{notifier.username} </span>
          </a>
          followed you
        </div>
      </div>
    </div>
  );

  const { id, episode } = rek;
  return(
    <div className="item notification-card">
      <div className={`fa fa-${index[type].icon} bookmark-notification`}></div>
      <div className="notification-description">
        <a href={"/u/" + notifier.username}>
          <img src={notifier.profilePic} alt={"avatar"} className="rounded-circle profile-pic" width={"40px"} />
        </a>
        <div>
          <a href={"/u/" + notifier.username}>
            <span className="font-weight-bold notification-username">{notifier.username} </span>
          </a>
          {index[type].copy} your Rek of
          <a href={`/podcast/${episode.podcast.slug}`}>
            <span className="font-weight-bold notification-username"> {episode.podcast.title}'s </span>
          </a>
          <span>Episode, </span>
          <a className="notification-episode-details font-weight-bold" href={`/episode/${episode.id}?rekId=${id}`}>{episode.title}</a>
        </div>
        {type === "rek" ?
          <div className="sats-stacked">
            You stacked
            <span className="font-weight-bold"> {toSats(satoshis)}</span>
          </div>
          : null}
      </div>
    </div>
  )
}

export default Notification;

/*
userId (person being notified)
notifierId (person causing the notification)
rekId
type (bookmark | rek)
*/
