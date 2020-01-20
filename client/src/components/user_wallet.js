import React from "react";
import { Wallet } from ".";
import { toSats } from "../utils";

const UserWallet = ({ satoshis }) => {
  return(
    <Wallet satoshis={satoshis} >
      {({ deposit, withdraw }) => (
        <div id="wallet">
          <div className="satoshi-amount" id="wallet-amount">
            <div className="wallet-satoshis">{toSats(satoshis, false)}</div>
            <div> sats</div>
          </div>
          <div id="wallet-actions">
            <div className="wallet-line">a</div>
            <div className="wallet-action" onClick={deposit} >Deposit</div>
            <div className="wallet-line">a</div>
            <div className="wallet-action" onClick={withdraw} >Withdraw</div>
          </div>
        </div>)
      }
    </Wallet>
  )
}

export default UserWallet;
