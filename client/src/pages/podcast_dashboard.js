import React from "react";
import { PODCAST_DASHBOARD } from "../actions";
import { Query } from "react-apollo";
import { ErrorMessage, Loader } from "../components";
import Podcast from "../components/podcast_dashboard/podcast";

class PodcastDashboard extends React.Component {
  state = {
    pIndex: 0,
  }

  render() {
    return(
      <div id="home">
        <Query query={PODCAST_DASHBOARD}>
          {({ data, error, loading }) => {
            if (error) return <ErrorMessage error={error} />;
            if (loading) return <Loader />;
            const { currentUser } = data;

            return(
              <div id="pd-wrapper">
                <h2>Podcast Dashboard</h2>
                <div id="podcast-dashboard">
                  <div id="pd-podcasts">
                    {currentUser.podcasts.map((podcast, i) => {
                        const cName = i === this.state.pIndex ? "pd-podcast current-pd" : "pd-podcast";
                        return(
                          <div key={i} className={cName} onClick={() => this.setState({ pIndex: i })} >
                            {podcast.title}
                          </div>
                        )
                      }
                    )}
                    <div className="pd-podcast text-center">
                    <a href="/create-podcast"><i className="fa fa-plus-circle"/></a>
                    </div>
                  </div>
                  <div id="pd-main-podcast">
                    <Podcast {...currentUser.podcasts[this.state.pIndex]} />
                  </div>
                </div>
              </div>
            )
          }}
        </Query>
      </div>
    );
  };
}

export default PodcastDashboard;
