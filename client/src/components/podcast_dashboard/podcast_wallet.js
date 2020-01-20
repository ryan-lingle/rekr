import React from "react";
import { Wallet } from "../";
import { toSats } from "../../utils";

const PodcastWallet = (props) => {
  return(
    <Wallet {...props} >
      {({ withdraw }) => (
        <div id="podcast-wallet">
          <h4>Podcast Wallet</h4><div id="p-sats"><strong>{toSats(props.satoshis, false)}</strong> sats</div><button onClick={withdraw} className="btn btn-secondary">Withdraw</button>
        </div>
      )}
    </Wallet>
  )
}

export default PodcastWallet;
