import { useWeb3React } from '@web3-react/core';
import Betting from '../contracts/Betting.json';
import { useAppContext } from '../AppContext';
import { useContract } from './useContract';
import { useLocalStorage } from './useLocalStorage';
import { formatEther, parseEther } from '@ethersproject/units';

const useBetting = () => {
  const { account } = useWeb3React();
  const { getItem } = useLocalStorage();
  const bettingContractAddress = '0xEA1E03d4dD00f5AE3c5f619AAA4e9550d34a71E8'; // Ganache
  const bettingContract = useContract(bettingContractAddress, Betting.abi);
  const {
    appWalletBalance,
    gamesList,
    historyList,
    signInStatus,
    isOwner,
    setAppWalletBalance,
    setGamesList,
    setHistoryList,
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
      console.log('Success fetching game list', newGames);
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
      console.log('Success adding new game', newGames);
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
        console.log('Successfully added fund:', amount, 'Eth');
        setAppWalletBalance(parseFloat(formatEther(userBalance)).toPrecision(4));
      });
    } catch (e) {
      console.log(e, 'Error adding funds');
    }
  };

  const submitBet = async (gameId, teamToWin, stakeAmount) => {
    try {
      const wei = parseEther(stakeAmount);
      await bettingContract.submitBet(gameId, teamToWin, wei);
      bettingContract.on('LogSubmitBet', (_, __, ___, ____, userBalance) => {
        console.log('Successfully submitted new bet:', teamToWin, 'to Win');
        setAppWalletBalance(parseFloat(formatEther(userBalance)).toPrecision(4));
      });
    } catch (e) {
      console.log(e, 'Error submitting bet');
    }
  };

  const fetchHistoryList = async () => {
    try {
      const history = await bettingContract.getUserBetsHistory();
      const result = _formatHistory(history);
      setHistoryList(result);
      console.log('Success fetching user history list', result);
    } catch (e) {
      console.log(e, 'Error fetching history list');
    }
  };

  return {
    appWalletBalance: appWalletBalance,
    gamesList: gamesList,
    historyList: historyList,
    signInStatus: signInStatus,
    isOwner: isOwner,
    fetchAppWalletBalance: fetchAppWalletBalance,
    fetchGamesList: fetchGamesList,
    addGame: addGame,
    signInUser: signInUser,
    fetchSignInStatus: fetchSignInStatus,
    addFunds: addFunds,
    fetchIsOwner: fetchIsOwner,
    submitBet: submitBet,
    fetchHistoryList: fetchHistoryList
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
      gameId: game.gameId.toString(),
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

const _formatHistory = (history) => {
  const result = history.map((data) => {
    console.log(data.userStakePercentage.toString(), 'stake percentage');
    return {
      gameId: data.gameId.toString(),
      teamA: data.teamA,
      teamB: data.teamB,
      startTime: new Date(data.startTime * 1000).toLocaleString(),
      endTime: new Date(data.endTime * 1000).toLocaleString(),
      isOpen: data.isOpen,
      gameTotalAmountStaked: data.gameTotalAmountStaked.toString(),
      usersCount: data.usersCount.toString(),
      winner: data.winner,
      teamToWin: data.teamToWin,
      teamToWinHash: data.teamToWinHash,
      userStakePercentage: data.userStakePercentage / 10000,
      userTotalAmountStaked: parseFloat(formatEther(data.userTotalAmountStaked)).toPrecision(4)
    };
  });
  return result;
};

export default useBetting;
