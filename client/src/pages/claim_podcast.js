import React, { useEffect } from "react";
import SignUpForm from "../auth/sign_up_form";
import { TwitterSignIn, Loader, ErrorMessage } from "../components";
import { GET_PODCAST } from "../actions";
import { Query, withApollo } from "react-apollo";
import { toSats } from "../utils";

const ClaimPodcast = ({ match, client }) => {
  const handleLogIn = async () => {
    window.location.href = `/confirm_email/${match.params.token}`
  }

  useEffect(() => {
    localStorage.setItem("podcastToken", match.params.token);
  })

  return(
    <Query query={GET_PODCAST} variables={match.params}>
      {({ data, loading, error }) => {
        if (error) return <ErrorMessage error={error} />;
        if (loading) return <Loader />;

        const { podcast } = data;

        return(
          <div>
            <div className="row" style={{ display: "flex", alignItems: "center", background: "white", borderRadius: "3px", padding: "20px 10px" }} >
              <img className="col-sm-3" alt="podcast art" src={podcast.image} style={{ borderRadius: "3px" }}  />
              <h3 className="col-sm-9" style={{ fontWeight: 200, margin: "10px 0px" }} >
                <strong>{podcast.title}</strong> has received
                <strong> {toSats(podcast.satoshis)} </strong>
                in donations.
                <br></br><br></br>
                Sign up to claim these sats and all future donations.
              </h3>
            </div>
            <br></br>
            <TwitterSignIn />
            <SignUpForm handleLogIn={handleLogIn} />
          </div>
        );
      }}
    </Query>
  );
};

export default withApollo(ClaimPodcast);
