import React from "react";
import AvatarEditor from 'react-avatar-editor';
import { Modal } from "react-bootstrap";
import { Mutation } from "react-apollo";
import { UPDATE_USER } from "../actions";
import { Loader } from ".";

export default class ImageEditor extends React.Component {
  editor = React.createRef()

  state = {
    loading: false,
    open: true,
    scale: 1
  }

  scaleHandler = ({ target }) => {
    this.setState({
      scale: parseFloat(target.value)
    })
  }

  closeModal = () => {
    this.setState({ open: false });
    this.props.removeFile()
  }

  componentWillReceiveProps({ image }) {
    this.setState({ open: this.props.image != null })
  }

  getCroppedImage = (updateUser) => {
    this.setState({ loading: true })
    const canvas = this.editor.current.getImage().toDataURL();
    fetch(canvas)
    .then(res => res.blob())
    .then(blob => {
      updateUser({ variables: {
        profilePic: blob
      }}).then(({ data }) => {
        localStorage.setItem('profilePic', data.updateUser.profilePic);
        window.location.reload();
      })
    })
  }

  buildEditor = () => {
    return(
      <div>
        <AvatarEditor
          image={this.props.image}
          ref={this.editor}
          width={300}
          height={300}
          borderRadius={500}
          border={50}
          color={[255, 255, 255, 0.6]} // RGBA
          scale={this.state.scale}
          rotate={0}
          id="edit-profile-pic"
        />
        <div className="slider-container">
          <input
            type="range"
            className="slider"
            id="satoshi-input"
            min="1"
            max="3"
            step="0.01"
            value={this.state.scale}
            onChange={this.scaleHandler}
          />
          <Mutation mutation={UPDATE_USER} onCompleted={this.handleLogIn}>
            {(updateUser, { error }) => (
              <button className="btn btn-primary" onClick={() => this.getCroppedImage(updateUser)} >Apply</button>
            )}
          </Mutation>
        </div>
      </div>
    )
  }

  render() {
    return(
      <Modal
        show={this.state.open}
        onHide={this.closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!this.state.loading ? this.buildEditor() : <div className="loader-padding"><Loader /></div>}
        </Modal.Body>
      </Modal>
    )
  }
}
