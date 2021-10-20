import {useWeb3React} from '@web3-react/core';
import { useEffect } from 'react';
import Betting from '../contracts/Betting.json';
import useIsValidNetwork from './useIsValidNetwork';
import {useAppContext} from '../AppContext';
import {useContract} from './useContract';
import { formatUnits, parseEther } from '@ethersproject/units';

const useBetting = () => {
  const {account} = useWeb3React();
  const {isValidNetwork} = useIsValidNetwork();
  const bettingContractAddress = '0x64fE85634E8A9440fDd689f625AAA1E6D215b7d5'; // Ropsten
  const bettingContract = useContract(bettingContractAddress, Betting.abi);
  const { appWalletBalance, gamesList, setAppWalletBalance, setGamesList } = useAppContext();
  
  const fetchAppWalletBalance = async () => {
    try {
      const appWalletBalance = await bettingContract.usersBalance(account);
      setAppWalletBalance(formatUnits(appWalletBalance, 8));
    } catch (e) {
      
    }
  }

  const fetchGamesList = async () => {
    try {
      const games = await bettingContract.getAllGames();
      setGamesList(games);
    } catch (e) {
      console.log(e)
    }
    // console.log(games, 'games =----------->')
  }

  return {
    appWalletBalance: appWalletBalance,
    gamesList: gamesList,
    fetchAppWalletBalance: fetchAppWalletBalance,
    fetchGamesList: fetchGamesList
  }
}

export default useBetting;
