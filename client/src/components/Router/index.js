import { Route, BrowserRouter as ReactRouter, Switch } from 'react-router-dom';
import detectEthereumProvider from '@metamask/detect-provider';
import { useWeb3React } from '@web3-react/core';
import { ToastContainer } from 'react-toastify';
import WalletInfo from '../WalletInfo';
import HistoryList from '../History';
import GamesList from '../GamesList';
import PlaceBet from '../PlaceBet';
import AddGame from '../AddGame';
import MetaMaskPrompt from '../MetaMaskPrompt';
import FundAppWallet from '../FundAppWallet';
import CreateAccountPrompt from '../CreateAccountPrompt/CreateAccountPrompt';
import useBetting from '../../hooks/useBetting';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

const Router = () => {
  const [MMDetected, setMMDetected] = useState(false);
  const { signInStatus, isOwner, fetchSignInStatus, fetchIsOwner } = useBetting();
  const { active } = useWeb3React();

  useEffect(async () => {
    const provider = await detectEthereumProvider();
    const isSet = provider ? true : false;
    setMMDetected(isSet);

    if (active) {
      fetchSignInStatus();
      fetchIsOwner();
    }
  }, [active, signInStatus]);
  return (
    <ReactRouter>
      <div className="container mx-auto text-gray-600">
        <ToastContainer />
        <WalletInfo />
        {!active || !MMDetected ? (
          <MetaMaskPrompt active={active} MMDetected={MMDetected} />
        ) : !signInStatus && !isOwner ? (
          <CreateAccountPrompt />
        ) : (
          <Switch>
            <Route path="/" exact="true">
              <GamesList />
            </Route>
            <Route path="/new-bet/:gameId">
              <PlaceBet />
            </Route>
            <Route path="/history">
              <HistoryList />
            </Route>
            <Route path="/new-game">
              <AddGame />
            </Route>
            <Route path="/fund-app-wallet">
              <FundAppWallet />
            </Route>
          </Switch>
        )}
      </div>
    </ReactRouter>
  );
};

export default Router;
