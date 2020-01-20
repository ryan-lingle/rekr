import React from 'react'
import { Query, Mutation, withApollo } from "react-apollo";
import { GET_EPISODE, CREATE_REK, CURRENT_SATS } from "../actions"
import { SatoshiInput, TagInput, ErrorMessage, Loader, Tooltip } from ".";
import { toSats } from "../utils";

class RekForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      satoshis: 10000,
      tags: [],
    }

    this.props.client.query({
      query: CURRENT_SATS
    }).then(({ data }) => {
      this.walletPermission = data.currentUser.walletPermission;
      this.currentSats = data.currentUser.satoshis;
      this.canTweet = data.currentUser.canTweet;
    })
  }


  handleChange = (satoshis) => {
    this.setState({ satoshis })
  }

  handleTagChange = (tags) => {
    this.setState({ tags });
  }

  handleRekCreate = (createRek) => {
    const invoiceSatoshis = this.state.satoshis - this.currentSats;
    const walletSatoshis = invoiceSatoshis > 0 ? this.currentSats : this.state.satoshis;
    if (
        walletSatoshis <= 0 ||
        (window.confirm(`Okay to Spend ${toSats(walletSatoshis)} from your Rekr Wallet?`))
      ) {
      createRek({ variables: {
        episodeId: this.props.id,
        tags: this.state.tags,
        invoiceSatoshis,
        walletSatoshis
      }})
    }
  }

  handleInvoice = ({ createRek }) => {
    this.props.handleInvoice(createRek);
  }



  render() {
    const { id } = this.props;
    return(
      <Query query={GET_EPISODE} variables={{ id }} >
        {({ data, loading, error }) => {
          if (loading) return <Loader />;
          if (error) return <ErrorMessage error={error} />;
          const { title, podcast } = data.episode;
          return (
            <div>
              <div id="episode-info">
                <img src={podcast.image} id="rek-form-podcast-art" alt="podcast art"/>
                <div id="rek-form-episode">{title}</div>
              </div>
              <TagInput onUpdate={this.handleTagChange} />
              <SatoshiInput onUpdate={this.handleChange} />
              <form  id="rek-form">
                <Mutation mutation={CREATE_REK} onCompleted={this.handleInvoice}>
                  {(createRek, {error, data}) => (
                    <div>
                      <ErrorMessage error={error} />
                      <input type="submit" value="Create Rek" className="btn btn-primary rek-submit" onClick={(e) => {
                        e.preventDefault()
                        this.handleRekCreate(createRek)
                      }}/>
                      <Tooltip tooltip="Rekr collects a 3% fee on donations.">
                        <i className="fa fa-question-circle question-tooltip"/>
                      </Tooltip>
                    </div>
                  )}
                </Mutation>
              </form>
            </div>
          )
        }}
      </Query>
    )
  }
}

export default withApollo(RekForm);
