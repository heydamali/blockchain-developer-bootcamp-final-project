import React from 'react'

const WalletInfo = () => {
  return (
    <section className="pt-20 flex justify-between">
      <div className="border-2 border-black rounded p-2">
        <p className="m-0">Ethereum Balance: 300</p> 
        <p className="m-0">Wallet Balance: 20</p>
      </div>
      <div className="border-2 border-black rounded p-2 text-center">
        <p className="m-0">MetaMask Wallet</p>
        <p className="m-0">Connected</p>
      </div>
    </section>
  )
}

export default WalletInfo;
