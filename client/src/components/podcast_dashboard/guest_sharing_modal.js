import React from "react";
import { Mutation } from "react-apollo";
import { Modal } from "react-bootstrap";
import { GUEST_SHARE } from "../../actions";

export default class GuestSharingModal extends React.Component {
  state = {
    percent: .25
  }

  render() {
    return(
      <Modal show={this.props.show} onHide={this.props.close} >
        <Modal.Header closeButton>
          <Modal.Title>Edit Guest Sharing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="edit-guest-sharing">
            <h4>What percentage of donations do you want to provide to guests?</h4>
            <div>{(this.state.percent * 100).toFixed(0)}%</div>
            <input
              type="range"
              className="slider"
              min={.01} max={1}
              step={.01}
              value={this.state.percent}
              onChange={({ target }) => {
                this.setState({
                  percent: parseFloat(target.value)
                })
              }}
            />
            <Mutation mutation={GUEST_SHARE} onCompleted={() => this.props.onEdit(this.state.percent)} >
              {(guestShare, { error }) =>
                <button
                  className="btn btn-primary"
                  id="guest-sharing-submit"
                  onClick={() => guestShare({
                    variables: {
                      percentage: this.state.percent,
                      podcastId: this.props.podcastId
                    }
                  })}
                  >
                    Save
                  </button>
              }
            </Mutation>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
