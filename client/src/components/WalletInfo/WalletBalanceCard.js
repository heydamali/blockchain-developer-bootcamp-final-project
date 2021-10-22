import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import useWallet from '../../hooks/useWallet';
import useBetting from '../../hooks/useBetting';

const WalletBalanceCard = () => {
  const { metaMaskWalletBalance, fetchMetaMaskWalletBalance } = useWallet();
  const { appWalletBalance, fetchAppWalletBalance } = useBetting();
  const { account, chainId } = useWeb3React();

  useEffect(() => {
    if (account) {
      fetchMetaMaskWalletBalance();
      fetchAppWalletBalance();
    }
  }, [account, chainId, appWalletBalance, metaMaskWalletBalance]);

  return (
    <div className="flex flex-col justify-around border-2 border-black rounded p-2">
      <p className="m-0 pb-1">MetaMask Wallet Balance: {metaMaskWalletBalance} ETH</p>
      <p className="m-0">App Wallet Balance: {appWalletBalance} ETH</p>
    </div>
  );
};

export default WalletBalanceCard;
