import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../../AppContext';
import useBetting from '../../hooks/useBetting';

const PlaceBet = () => {
  const [teamToWin, setTeamToWin] = useState('');
  const [ethAmount, setEthAmount] = useState('');
  const { gameId } = useParams();
  const { gamesList } = useAppContext();
  const game = gamesList[parseInt(gameId) - 1]; // because gameId from contract starts from 1 while array starts at index 0
  const { submitBet, isOwner } = useBetting();

  const onSubmit = (e) => {
    e.preventDefault();
    submitBet(gameId, teamToWin, ethAmount);
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
        <Link to="/fund-app-wallet">Add Fund</Link>
      </p>
      <h2 className="pb-5">
        {game.teamA} vs {game.teamB}
      </h2>
      <div className="border-2 rounded border-gray-400 pt-3 w-3/4 flex flex-col">
        <p className="m-0 text-center">Choose Team</p>
        <div className="px-5">
          <form
            onSubmit={onSubmit}
            className="w-1/2 px-8 pt-6 my-0 mx-auto mb-4 flex flex-col items-center">
            <select
              onChange={(e) => setTeamToWin(e.target.value)}
              value={teamToWin}
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 mb-2"
              id="grid-state">
              <option>Select team</option>
              <option value={game.teamA}>{game.teamA}</option>
              <option value={game.teamB}>{game.teamB}</option>
            </select>
            <input
              onChange={(e) => setEthAmount(e.target.value)}
              value={ethAmount}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white mb-2"
              id="amount"
              type="number"
              placeholder="Ethereum amount"
            />
            <button
              className="bg-transparent hover:bg-gray-500 text-black hover:text-white py-2 px-3 border border-black hover:border-transparent rounded w-1/2"
              type="submit">
              Stake
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PlaceBet;
