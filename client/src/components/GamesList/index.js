import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import useBetting from '../../hooks/useBetting';

const GamesList = () => {
  const { account } = useWeb3React();
  const { gamesList, fetchGamesList } = useBetting();
  console.log(gamesList, '------>');
  useEffect(() => {
    fetchGamesList();
  }, [account]);

  return (
    <section className="pt-10">
      <p className="text-right text-blue-500 hover:text-blue-600 mb-5">
        <Link to="/history">History</Link>
      </p>
      <table className="table-fixed w-full">
        <thead className="">
          <tr>
            <th className="w-1/2 text-left">Games</th>
            <th className="text-right">Date</th>
            <th className="text-right">Time</th>
            <th className="text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {gamesList.map((game) => {
            return (
              <tr className="">
                <td className="pt-3 text-blue-500 hover:text-blue-600 mb-5">
                  <Link to="/games/1">
                    {game.teamA} vs {game.teamB}
                  </Link>
                </td>
                <td className="text-right">{game.startTime}</td>
                <td className="text-right">{game.endTime}</td>
                <td className="text-right">{game.isOpen}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default GamesList;
