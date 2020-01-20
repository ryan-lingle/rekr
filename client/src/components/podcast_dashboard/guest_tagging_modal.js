import React from "react";
import { Mutation, withApollo } from "react-apollo";
import { Modal } from "react-bootstrap";
import { TAG_GUEST, EPISODE_GUESTS } from "../../actions";
import { ErrorMessage, Loader, Search } from "../"
import { NotificationManager } from 'react-notifications';

class GuestTaggingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: "",
      episodeGuests: null,
      userSearch: false,
      error: null
    }
  }

  handleUpdate = (data) => {
    this.close();
    NotificationManager.info('Successfully Updated Guests');
  }

  updateGuestsBtn = () => {
    return(
      <Mutation mutation={TAG_GUEST} onCompleted={this.handleUpdate}>
        {(tagGuest, { error }) =>
          <div>
            <ErrorMessage error={error} />
            <button className="update-guests btn btn-primary" onClick={() => this.updateGuests(tagGuest)}>Update</button>
          </div>
        }
      </Mutation>
    )
  }

  updateGuests = (tagGuests) => {
    const userIds = this.extractIds(this.state.episodeGuests)
    const { episodeIds, podcastId } = this.props;
    tagGuests({ variables: { userIds, episodeIds, podcastId }})
  }

  extractIds(users) {
    return users.map(user => user.id)
  }

  userSearch = () => {
    return(
      <div>
        <input placeholder="Search for a User" className="form-control user-search" type="text" value={this.state.term} onChange={({ target }) => this.setState({ term: target.value })} />
        {this.state.term ?
          <Search type={"user"} term={this.state.term} >
            {({ results , error, loading }) => {
              if (error) return <ErrorMessage error={error} />;
              if (loading) return <Loader />;
              return(
                <div id="episode-results">
                  {results.map(user => (
                    this.userResult(user)
                  ))}
                </div>
              )
            }}
        </Search>
        : <div id="before-search">Search for a User</div>}
      </div>
    )
  }

  selectUser = (user) => {
    this.setState(({ episodeGuests }) => {
      const found = episodeGuests.find(u => u.id === user.id);
      if (!found) {
        episodeGuests.push(user);
        return { episodeGuests: episodeGuests, term: "", userSearch: false };
      } else {
        return { term: "", userSearch: false };
      }
    })
  }

  removeUser = (user) => {
    this.setState(({ episodeGuests }) => {
      return {
        episodeGuests: episodeGuests.filter(u => u.id !== user.id)
      }
    })
  }

  userResult = (user) => {
    return(
      <div key={user.id} className="search-result" onClick={() => this.selectUser(user)} >
        <img src={user.profilePic} alt={"avatar"} className="rounded-circle" width={"60px"} />
        <div>{user.username}</div>
      </div>
    )
  }

  episodeGuests = () => {
    const { episodeGuests } = this.state;
    return(
      <div>
        <h4>Episode Guests</h4>
        <div id="episode-guests">
          {episodeGuests ? episodeGuests.map(user =>
            <div key={user.id} className="episode-guest">
              <img src={user.profilePic} alt={"avatar"} className="rounded-circle" width={"60px"} />
              <div>{user.username}</div>
              <span className="remove-tag" onClick={() => this.removeUser(user) }>×</span>
            </div>
          ) : <Loader/>}
          <div className="episode-guest">
            <i className="fa fa-plus-circle" onClick={() => this.setState({ userSearch: true })} />
          </div>
        </div>
        {this.updateGuestsBtn()}
      </div>
    )
  }

  close = () => {
    this.setState({ term: "", userSearch: false, episodeGuests: [] })
    this.props.close();
  }

  async componentWillReceiveProps({ episodeIds }) {
    let episodeGuests = [];
    if (episodeIds.length === 1) {
      const { data } = await this.props.client.query({
        query: EPISODE_GUESTS,
        variables: { episodeId: episodeIds[0] }
      })
      episodeGuests = data.episode.guests;
    }
    this.setState({ episodeGuests });
  }

  render() {
    return(
      <Modal show={this.props.show} onHide={this.close} >
        <Modal.Header closeButton>
          <Modal.Title>Tag Guests</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="episode-guest-modal">
            {this.state.userSearch ? this.userSearch() : this.episodeGuests()}
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

export default withApollo(GuestTaggingModal);
