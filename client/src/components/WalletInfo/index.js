import WalletBalanceCard from './WalletBalanceCard';
import WalletConnectionCard from './WalletConnectionCard';

const WalletInfo = () => {
  return (
    <section className="pt-20 flex justify-between">
      <WalletBalanceCard />
      <WalletConnectionCard />
    </section>
  );
};

export default WalletInfo;
