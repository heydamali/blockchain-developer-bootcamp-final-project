import { Route, BrowserRouter as ReactRouter, Switch } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import WalletInfo from '../WalletInfo';
import HistoryList from '../History';
import GamesList from '../GamesList';
import PlaceBet from '../PlaceBet';
import AddGame from '../AddGame';
import MetaMaskPrompt from '../MetaMaskPrompt';
import FundAppWallet from '../FundAppWallet';
import CreateAccountPrompt from '../CreateAccountPrompt/CreateAccountPrompt';
import useBetting from '../../hooks/useBetting';
import { useEffect } from 'react';

const Router = () => {
  const { signInStatus, isOwner, fetchSignInStatus, fetchIsOwner } = useBetting();
  const { active } = useWeb3React();

  useEffect(() => {
    if (active) {
      fetchSignInStatus();
      fetchIsOwner();
    }
  }, [active, signInStatus]);
  return (
    <ReactRouter>
      <div className="container mx-auto text-gray-600">
        <WalletInfo />
        {!active ? (
          <MetaMaskPrompt />
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
