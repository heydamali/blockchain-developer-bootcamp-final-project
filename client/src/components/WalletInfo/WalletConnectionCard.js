import { useWeb3React } from '@web3-react/core';
import { ReactComponent as MetaMaskLogo } from '../../static/metamask-logo.svg';
import { shortenAddress } from '../../utils/shortenAddress';
import { injected } from '../../connectors';

const WalletConnectionCard = () => {
  const { activate, deactivate, account, active } = useWeb3React();

  if (active) {
    return (
      <div className="flex flex-col justify-around items-center border-2 border-black rounded p-2 text-center">
        <span className="flex m-0 pb-1">
          <MetaMaskLogo className="h-4 mt-1" />
          {shortenAddress(account, 5)}
        </span>
        <button
          onClick={deactivate}
          className="bg-transparent hover:bg-gray-500 text-black hover:text-white py-1 px-2 border border-black hover:border-transparent rounded"
          type="button">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-around items-center border-2 border-black rounded p-2 text-center">
      <span className="flex m-0 pb-1">
        <MetaMaskLogo className="h-4 mt-1" />
        MetaMask Wallet
      </span>
      <button
        onClick={() => {
          activate(injected);
        }}
        className="bg-transparent hover:bg-gray-500 text-black hover:text-white py-1 px-2 border border-black hover:border-transparent rounded w-3/4"
        type="button">
        Connect
      </button>
    </div>
  );
};

export default WalletConnectionCard;
