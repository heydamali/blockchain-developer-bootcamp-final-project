import { useWeb3React } from '@web3-react/core';
import { formatEther } from '@ethersproject/units';
import {useAppContext} from '../AppContext';

const useEthereum = () => {
  const { active, library, account } = useWeb3React();
  const { walletBalance, setWalletBalance } = useAppContext();

  const fetchWalletBalance = async () => {
    if (library && active && account) {
      const balance = await library.getBalance(account);
      setWalletBalance(parseFloat(formatEther(balance)).toPrecision(4));
    } else {
      setWalletBalance('--');
    }
  };
  return { walletBalance, fetchWalletBalance };
};

export default useEthereum;
