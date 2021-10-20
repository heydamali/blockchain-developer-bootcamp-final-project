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
  const bettingContractAddress = '0x679F0bF295f531009ACC44eA2EC42120836B1ecD'; // Ropsten
  const bettingContract = useContract(bettingContractAddress, Betting.abi);
  const {appWalletBalance, setAppWalletBalance} = useAppContext();
  
  const fetchAppWalletBalance = async () => {
    const appWalletBalance = await bettingContract.usersBalance(account);
    setAppWalletBalance(formatUnits(appWalletBalance, 8));
  }

  const fetchGamesList = async () => {
    const games = await bettingContract.bets(1);
    console.log(games, 'games =----------->')
  }

  return {
    appWalletBalance: appWalletBalance,
    fetchAppWalletBalance: fetchAppWalletBalance,
    fetchGamesList: fetchGamesList
  }
}

export default useBetting;
