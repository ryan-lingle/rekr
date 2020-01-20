import React from "react";
import { CONFIRM_EMAIL } from "../actions";
import { Loader } from "../components";
import { withApollo } from "react-apollo";
class ConfirmEmail extends React.Component {
  state = {
    loading: true,
    type: null,
  }

  onCompleted = ({ confirmEmail }) => {
    if (confirmEmail.user) {
      this.setState({ loading: false, type: "user" });
    } else if (confirmEmail.podcast) {
      localStorage.setItem('hasPodcast', "true" );
      this.setState({ loading: false, type: "podcast" });
    }
  }

  async componentDidMount() {
    const { data } = await this.props.client.mutate({
      mutation: CONFIRM_EMAIL,
      variables: this.props.match.params
    });
    if (data.confirmEmail.loggedIn) {
      this.onCompleted(data);
    } else if (data.confirmEmail.podcast) {
      window.location.href = `/claim-podcast/${this.props.match.params.token}`;
    }
  }

  render() {
    const { loading, type } = this.state;
    if (loading) return <div className="message-box"><Loader /></div>;

    if (type === "user") {
      return(
        <div className="message-box">
          <h1>Your email has been confirmed.</h1>
          <br></br>
          <a href="/">Check out your Feed</a>
        </div>
      )
    }

    if (type === "podcast") {
      return(
        <div className="message-box">
          <h1>Your email has been confirmed.</h1>
          <br></br>
          <a href="/podcast-dashboard">Check out your Podcast Dashboard</a>
        </div>
      )
    }
  }
}

export default withApollo(ConfirmEmail);
