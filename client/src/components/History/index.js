import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useBetting from '../../hooks/useBetting';

const HistoryList = () => {
  const { fetchHistoryList, historyList } = useBetting();
  const { account, chainId } = useWeb3React();

  useEffect(() => {
    fetchHistoryList();
  }, [account, chainId]);
  return (
    <section className="pt-10">
      <p className="text-right text-blue-500 hover:text-blue-600 mb-5">
        <Link to="/">Home</Link>
      </p>
      {historyList.length ? (
        <table className="table-fixed w-full ">
          <thead className="">
            <tr>
              <th className="w-1/2 text-left">Games</th>
              <th className="text-center">End Date</th>
              <th className="text-center">Team To Win</th>
              <th className="text-center">Winner</th>
              <th className="text-center">Position</th>
              <th className="text-center">Bet Amount</th>
              <th className="text-center">Bet Percentage</th>
            </tr>
          </thead>
          <tbody>
            {historyList.map((game) => {
              return (
                <tr className="" key={game.gameId}>
                  <td className="pt-3 mb-5">
                    {game.teamA} vs {game.teamB}
                  </td>
                  <td className="text-center">{game.endTime}</td>
                  <td className="text-center">{game.teamToWin}</td>
                  <td className="text-center">{game.winner || '----'}</td>
                  <td className="text-center">
                    {!game.winner ? 'Pending' : game.teamToWin === game.winner ? 'Won' : 'Lost'}
                  </td>
                  <td className="text-center">{game.userTotalAmountStaked} ETH</td>
                  <td className="text-center">{game.userStakePercentage}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <h2 className="text-center">No Betting History</h2>
      )}
    </section>
  );
};

export default HistoryList;
