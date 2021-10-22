import { useWeb3React } from '@web3-react/core';
import Betting from '../contracts/Betting.json';
import { useAppContext } from '../AppContext';
import { useContract } from './useContract';
import { useLocalStorage } from './useLocalStorage';
import { formatEther, parseEther } from '@ethersproject/units';

const useBetting = () => {
  const { account } = useWeb3React();
  const { getItem } = useLocalStorage();
  const bettingContractAddress = '0x34668a51e1aa3c3cda40d9995186453E37EDfa20'; // Ganache
  const bettingContract = useContract(bettingContractAddress, Betting.abi);
  const {
    appWalletBalance,
    gamesList,
    signInStatus,
    isOwner,
    setAppWalletBalance,
    setGamesList,
    setSignInStatus,
    setIsOwner
  } = useAppContext();

  const fetchIsOwner = async () => {
    try {
      const ownerAccount = await bettingContract.owner();
      const checkIsOwner = account === ownerAccount;
      console.log(checkIsOwner, 'Fetched is owner from contract');
      setIsOwner(checkIsOwner);
    } catch (e) {
      console.log(e, 'Error fetching isOwner');
    }
  };

  const fetchAppWalletBalance = async () => {
    try {
      const appWalletBalance = await bettingContract.usersBalance(account);
      console.log(appWalletBalance + ' Wei', 'Fetched app balance from contract');
      setAppWalletBalance(parseFloat(formatEther(appWalletBalance)).toPrecision(4));
    } catch (e) {
      console.log(e, 'Error fetching app wallet balance');
    }
  };

  const fetchGamesList = async () => {
    try {
      const games = await bettingContract.getAllGames();
      const newGames = _formatGames(games);
      setGamesList(newGames);
    } catch (e) {
      console.log(e, 'Error fetching games list');
    }
  };

  const addGame = async (teamA, teamB, startTime, endTime) => {
    try {
      const startTimeBN = new Date(startTime).getTime() / 1000;
      const endTimeBN = new Date(endTime).getTime() / 1000;

      await bettingContract.addGame(teamA, teamB, startTimeBN, endTimeBN);
      const games = await bettingContract.getAllGames();
      const newGames = _formatGames(games);
      setGamesList(newGames);
    } catch (e) {
      console.log(e, 'Error adding game');
    }
  };

  const signInUser = async () => {
    try {
      await bettingContract.signInUser(account);
      bettingContract.on('LogSignInUser', async () => {
        const status = await _getAndStoreSignInStatus(bettingContract, account);
        setSignInStatus(status);
      });
    } catch (e) {
      console.log(e, 'Error signing in user');
    }
  };

  const fetchSignInStatus = async () => {
    try {
      let status;
      const signInPayload = JSON.parse(getItem('signInPayload'));
      if (
        account &&
        signInPayload &&
        Object.keys(signInPayload).length &&
        account === signInPayload.account
      ) {
        status = signInPayload.status;
      }

      if (!status) status = await _getAndStoreSignInStatus(bettingContract, account);
      setSignInStatus(status);
    } catch (e) {
      console.log(e, 'Error fetching sign in status');
    }
  };

  const addFunds = async (amount) => {
    try {
      const wei = parseEther(amount);
      await bettingContract.addFunds({ value: wei });
      bettingContract.on('LogAddFunds', (_, __, userBalance) => {
        setAppWalletBalance(parseFloat(formatEther(userBalance)).toPrecision(4));
      });
    } catch (e) {
      console.log(e, 'Error adding funds');
    }
  };

  return {
    appWalletBalance: appWalletBalance,
    gamesList: gamesList,
    signInStatus: signInStatus,
    isOwner: isOwner,
    fetchAppWalletBalance: fetchAppWalletBalance,
    fetchGamesList: fetchGamesList,
    addGame: addGame,
    signInUser: signInUser,
    fetchSignInStatus: fetchSignInStatus,
    addFunds: addFunds,
    fetchIsOwner: fetchIsOwner
  };
};

// Helpers
const _getAndStoreSignInStatus = async (contract, account) => {
  const status = await contract.signInStatus(account);
  console.log(status, 'Fetched signin status from contract');
  const payload = JSON.stringify({ account: account, status: status });
  localStorage.setItem('signInPayload', payload);

  return status;
};
const _formatGames = (games) => {
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
