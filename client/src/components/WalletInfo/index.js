import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import useBetting from '../../hooks/useBetting';
import WalletBalanceCard from './WalletBalanceCard';
import WalletConnectionCard from './WalletConnectionCard';

const WalletInfo = () => {
  const { fetchGamesList } = useBetting();
  const { account } = useWeb3React();

  useEffect(() => {
    fetchGamesList();
  }, [account]);

  return (
    <section className="pt-20 flex justify-between">
      <WalletBalanceCard />
      <WalletConnectionCard />
    </section>
  );
};

export default WalletInfo;
