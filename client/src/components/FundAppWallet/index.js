import { useState } from 'react';
import { Link } from 'react-router-dom';
import useBetting from '../../hooks/useBetting';

const FundAppWallet = () => {
  const [amount, setAmount] = useState('');
  const { addFunds, isOwner } = useBetting();

  const onSubmit = async (e) => {
    e.preventDefault();
    await addFunds(amount);
  };

  return (
    <section className="pt-20 flex flex-col items-center">
      <p className="text-center text-blue-500 hover:text-blue-600 mb-5">
        {isOwner && (
          <Link to="/new-game" style={{ paddingRight: '20px' }}>
            Add Game
          </Link>
        )}
        <Link className="pr-5" to="/">
          Home
        </Link>
        <Link className="pr-5" to="/history">
          History
        </Link>
      </p>
      <div className="border-2 rounded border-gray-400 pt-3 w-3/4 flex flex-col">
        <p className="m-0 text-center">Fund App Wallet</p>
        <div className="px-5">
          <form
            onSubmit={onSubmit}
            className="w-1/2 px-8 pt-6 my-0 mx-auto mb-4 flex flex-col items-center">
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white mb-2"
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ethereum amount"
            />
            <button
              className="bg-transparent hover:bg-gray-500 text-black hover:text-white py-2 px-3 border border-black hover:border-transparent rounded w-1/2"
              type="submit">
              Fund wallet
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FundAppWallet;
