import { useWeb3React } from '@web3-react/core';
import { formatEther } from '@ethersproject/units';
import { useAppContext } from '../AppContext';

const useWallet = () => {
  const { active, library, account } = useWeb3React();
  const { metaMaskWalletBalance, setMetaMaskWalletBalance } = useAppContext();

  const fetchMetaMaskWalletBalance = async () => {
    if (library && active && account) {
      const balance = await library.getBalance(account);
      console.log(
        balance.toString() + ' Wei',
        'Fetched MetaMask wallet balance from MetaMask wallet'
      );
      setMetaMaskWalletBalance(parseFloat(formatEther(balance)).toPrecision(4));
    } else {
      setMetaMaskWalletBalance('--');
    }
  };

  return {
    metaMaskWalletBalance,
    active,
    fetchMetaMaskWalletBalance
  };
};

export default useWallet;
