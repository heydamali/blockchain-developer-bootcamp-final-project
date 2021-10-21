import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { AppContextProvider } from './AppContext';
import WalletInfo from './components/WalletInfo';
import HistoryList from './components/History';
import GamesList from './components/GamesList';
import PlaceBet from './components/PlaceBet';
import AddGame from './components/AddGame';

import './App.css';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

function App() {
  return (
    <AppContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Router>
          <div className="container mx-auto text-gray-600">
            <WalletInfo />
            <Switch>
              <Route path="/" exact="true">
                <GamesList />
              </Route>
              <Route path="/new-bet">
                <PlaceBet />
              </Route>
              <Route path="/history">
                <HistoryList />
              </Route>
              <Route path="/new-game">
                <AddGame />
              </Route>
            </Switch>
          </div>
        </Router>
      </Web3ReactProvider>
    </AppContextProvider>
  );
}

export default App;
