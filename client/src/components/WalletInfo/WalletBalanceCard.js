import React, {useEffect} from 'react'
import { useWeb3React } from '@web3-react/core'
import useEthereum from '../../hooks/useEthereum'

const WalletBalanceCard = () => {
  const {account, chainId} = useWeb3React()
  const {walletBalance, fetchWalletBalance} = useEthereum()
  
  useEffect(() => {
    if (account) {
      fetchWalletBalance()
    }
  }, [account, chainId])

  return (
      <div className="flex flex-col justify-around border-2 border-black rounded p-2">
      <p className="m-0 pb-1">Ethereum Balance: { walletBalance }</p>
        <p className="m-0">Wallet Balance: 20</p>
      </div>
  )
}

export default WalletBalanceCard;
