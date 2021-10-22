import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { AppContextProvider } from './AppContext';
import Router from './components/Router';
import './App.css';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

function App() {
  return (
    <AppContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Router />
      </Web3ReactProvider>
    </AppContextProvider>
  );
}

export default App;
