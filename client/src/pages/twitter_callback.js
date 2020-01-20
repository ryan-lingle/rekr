import React from "react";
import { Loader } from "../components";
import { TWITTER_ACCESS_TOKEN } from "../actions";
import { withApollo } from "react-apollo";

class TwitterCallback extends React.Component {
  async componentDidMount() {
    const { search } = this.props.location;
    const split1 = search.split('?oauth_token=')[1];
    const split2 = split1.split('&oauth_verifier=');
    const { data } = await this.props.client.mutate({
      mutation: TWITTER_ACCESS_TOKEN,
      variables: {
        requestToken: split2[0],
        oathVerifier: split2[1]
      }
    });

    if (data.twitterAccessToken.signIn) {
      localStorage.setItem('id', data.twitterAccessToken.id);
      localStorage.setItem('token', data.twitterAccessToken.token);
      localStorage.setItem('username', data.twitterAccessToken.username);
      localStorage.setItem('profilePic', data.twitterAccessToken.profilePic);
      localStorage.setItem('email', data.twitterAccessToken.email);
      localStorage.setItem('hasPodcast', data.twitterAccessToken.hasPodcast);
    }

    const podcastToken = localStorage.getItem('podcastToken');
    if (podcastToken) {
      window.location.href = `/confirm_email/${podcastToken}`;
    } else {
      window.location.href = "/";
    };
  }

  render() {
    return(
      <div className="message-box" style={{maxWidth: "500px"}}>
        You Should Be Redirected Shortly.
        <Loader />
      </div>
    )
  }
}

export default withApollo(TwitterCallback);
