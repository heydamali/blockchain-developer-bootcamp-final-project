import React from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom"
import WalletInfo from './components/WalletInfo';
import HistoryList from './components/History';
import GamesList from './components/GamesList';
import Game from './components/Game';

import './App.css';

function App() {
  return (
    <Router>
      <div className="container mx-auto text-gray-600">
        <WalletInfo />
        <Switch>
          <Route path="/" exact="true">
            <GamesList />
          </Route>
          <Route path="/games/1" >
            <Game />
          </Route>
          <Route path="/history">
            <HistoryList />
          </Route>
        </Switch>
      </div>
    </Router>

  );
}

export default App;
