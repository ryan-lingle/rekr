import React from 'react';
import QRCode from 'qrcode.react'
import { requestProvider } from 'webln'
import { withApollo } from 'react-apollo'
import { SUBSRIBE_INVOICE } from '../actions'
import Tooltip from "./tooltip";
import { toSats } from "../utils";

class Invoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showQR: false,
      weblnError: false
    }

    this.subscribe();
    this.joule();
  }

  joule = async () => {
    // if (window.confirm("Use Your Browser Wallet by Default Going Forward?")) {
    try {
      const webln = await requestProvider();
      webln.sendPayment(this.props.invoice)
    } catch(err) {
      this.setState({ weblnError: true });
    }
  }

  showQR = () => {
    this.setState({
      showQR: true
    })
  }

  qrCode = () => {
    const { satoshis, invoice } = this.props;
    return(
      <div className="text-center">
        <div className="back-btn fa fa-arrow-left" onClick={() => { this.setState({ showQR: false })}}></div>
        <h4 id="invoice-satoshis"><span className="font-weight-bol">{toSats(satoshis)}</span></h4>
        <QRCode value={invoice} fgColor={'#404040'} size={250} id="qr-code" />
      </div>
    )
  }

  copyInvoice() {
    const invoice = document.querySelector(`#payment-request`);
    invoice.select();
    document.execCommand("copy");
  }

  subscribe = () => {
    const { client, invoice, handleInvoicePaid } = this.props;
    client.subscribe({
      query: SUBSRIBE_INVOICE,
      variables: { invoice },
    }).subscribe({
      next({ data }) {
        if (data.invoicePaid.invoice === invoice) {
          handleInvoicePaid(data.invoicePaid.rekId);
        }
      },
      error(err) { console.error('err', err); },
    });
  }

  render() {
    const { satoshis, invoice } = this.props;
    if (this.state.showQR) return this.qrCode();
    return(
      <div id="invoice">
        {this.state.weblnError ? <div id="no-webln">No Webln Provider found. <a target="_blank" rel="noopener noreferrer" href="https://lightningjoule.com/">Download Joule</a> for a better app experience.</div> : null}
        <h4 id="invoice-header">Invoice</h4>
        <h4 id="invoice-satoshis"><span className="font-weight-bol">{toSats(satoshis)}</span></h4>

        <button className="btn-secondary invoice-btn" onClick={this.showQR}>Show QR Code</button>
        <a className="joule-btn invoice-btn" href={`lightning:${invoice}`} >Pay Invoice</a>
        <Tooltip tooltip={"Copy Invoice"} placement="bottom">
          <input className="payment-request invoice-btn" id="payment-request" value={invoice} onClick={this.copyInvoice} />
        </Tooltip>
      </div>
    )
  }
}

export default withApollo(Invoice);
