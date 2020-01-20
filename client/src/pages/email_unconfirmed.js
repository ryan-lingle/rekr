import React from "react";
import { RESEND_USER_EMAIL, RESEND_PODCAST_EMAIL } from "../actions";
import { Mutation } from "react-apollo";
import { NotificationManager } from 'react-notifications';

const EmailUnconfirmed = ({ location: { search } }) => {
  function onCompleted(data) {
    if (data.resendUserEmail || data.resendPodcastEmail) {
      NotificationManager.info('Email Sent');
    }
  };


  const userEmail = localStorage.getItem("email");
  let podcastId, podcastEmail;
  const split1 = search.split('?email=')[1];
  if (split1) {
    const split2 = split1.split('&id=');
    podcastEmail = split2[0];
    podcastId = split2[1];
  }

  return(
    <div className="message-box" >
      <h1>We've sent an email to {podcastEmail || userEmail}. <br></br>To continue, please check your email and verify your {podcastEmail ? "podcast" : "account"}.</h1>
      <Mutation mutation={podcastEmail ? RESEND_PODCAST_EMAIL : RESEND_USER_EMAIL} onCompleted={onCompleted}>
        {(resendEmail) => (
          <a href="#" onClick={() => resendEmail({ variables: podcastEmail ? { podcastId } : {} })} >Resend Confirmation Email</a>
        )}
      </Mutation>
    </div>
  )
}

export default EmailUnconfirmed;
