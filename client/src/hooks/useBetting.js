import { useWeb3React } from '@web3-react/core';
import Betting from '../contracts/Betting.json';
import { useAppContext } from '../AppContext';
import { useContract } from './useContract';
import { formatUnits } from '@ethersproject/units';

const useBetting = () => {
  const { account } = useWeb3React();
  const bettingContractAddress = '0xC0577145181781A77Ee611f864c8F6480A31A2DC'; // Ganache
  const bettingContract = useContract(bettingContractAddress, Betting.abi);
  const { appWalletBalance, gamesList, setAppWalletBalance, setGamesList } = useAppContext();

  const fetchAppWalletBalance = async () => {
    try {
      const appWalletBalance = await bettingContract.usersBalance(account);
      setAppWalletBalance(formatUnits(appWalletBalance, 8));
    } catch (e) {
      console.log(e);
    }
  };

  const fetchGamesList = async () => {
    try {
      const games = await bettingContract.getAllGames();
      const newGames = formatGames(games);
      setGamesList(newGames);
    } catch (e) {
      console.log(e);
    }
  };

  const addGame = async (teamA, teamB, startTime, endTime) => {
    try {
      const startTimeBN = new Date(startTime).getTime() / 1000;
      const endTimeBN = new Date(endTime).getTime() / 1000;

      await bettingContract.addGame(teamA, teamB, startTimeBN, endTimeBN);
      const games = await bettingContract.getAllGames();
      const newGames = formatGames(games);
      setGamesList(newGames);
    } catch (e) {
      console.log(e);
    }
  };

  const signInUser = async (account) => {
    try {
      await bettingContract.signInUser(account);
    } catch (e) {
      console.log(e);
    }
  };

  return {
    appWalletBalance: appWalletBalance,
    gamesList: gamesList,
    fetchAppWalletBalance: fetchAppWalletBalance,
    fetchGamesList: fetchGamesList,
    addGame: addGame,
    signInUser: signInUser
  };
};

// Helpers
const formatGames = (games) => {
  const result = games.map((game) => {
    return {
      teamA: game.teamA,
      teamB: game.teamB,
      startTime: new Date(game.startTime * 1000).toLocaleString(),
      endTime: new Date(game.endTime * 1000).toLocaleString(),
      isOpen: game.isOpen,
      totalAmountStaked: game.totalAmountStaked.toString(),
      usersCount: game.usersCount.toString(),
      winner: game.winner
    };
  });

  return result;
};

export default useBetting;
