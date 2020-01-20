import React from "react";
import { Modal } from "react-bootstrap";
import EpisodeSearch from "./episode_search";
import RekForm from "./rek_form";
import Invoice from "./invoice";
import RekCreated from "./rek_created";

export default class RekModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.isOpen || false,
      step: 1,
      episodeId: null,
      satoshis: null,
      invoice: null,
      rekId: null
    };

    if (this.props.episodeId) {
      this.state = {
        isOpen: this.props.isOpen || false,
        step: 2,
        episodeId: this.props.episodeId,
        satoshis: null,
        invoice: null,
      };
    }
  }

  onChildClick = () => {
    this.setState({ isOpen: true });
  }

  closeModal = () => {
    this.setState({ isOpen: false, step: 1 });
  }

  handleEpisodeSelection = (episodeId) => {
    this.setState({ episodeId, step: 2 });
  }

  handleInvoice = ({ invoice, satoshis, rekId }) => {
    if (invoice) {
      this.setState({ invoice, satoshis, step: 3})
    } else {
      this.setState({ rekId, step: 4 })
    }
  }

  handleInvoicePaid = (rekId) => {
    this.setState({ step: 4, rekId });
  }

  renderStep = (step) => {
    const { episodeId, invoice, satoshis, rekId } = this.state;
    return {
      1: () => (
        <EpisodeSearch
          handleSelection={this.handleEpisodeSelection}
        />
      ),
      2: () => (
        <RekForm
          id={episodeId}
          handleInvoice={this.handleInvoice}
        />
      ),
      3: () => (
        <Invoice
          invoice={invoice}
          satoshis={satoshis}
          handleInvoicePaid={this.handleInvoicePaid}
        />
      ),
      4: () => (
        <RekCreated
          episodeId={episodeId}
          rekId={rekId}
        />
      )
    }[step]();
  }

  render() {
    const children = React.Children.map(this.props.children, child => React.cloneElement(child, { onClick: this.onChildClick }));
    return(
      <div id="rek-modal">
        {children}
        <Modal
          show={this.state.isOpen}
          onHide={this.closeModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Make a Rek</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.renderStep(this.state.step)}
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}
