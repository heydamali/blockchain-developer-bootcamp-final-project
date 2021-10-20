import React, { createContext, useReducer } from 'react';

const initialContext = {
  metaMaskWalletBalance: '--',
  setMetaMaskWalletBalance: () => {},
  appWalletBalance: '--',
  setAppWalletBalance: () => {},
  gamesList: [],
  setGamesList: () => {},
  isWalletConnectionModalOpen: false,
  setWalletConnectModal: () => {},
  txnStatus: 'NOT_SUBMITTED',
  setTxnStatus: () => {},
};

const appReducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_META_MASK_WALLET_BALANCE':
      return {
        ...state,
        metaMaskWalletBalance: payload
      };
  
    case 'SET_APP_WALLET_BALANCE':
      return {
        ...state,
        appWalletBalance: payload
      };
    
    case 'SET_GAMES_LIST':
      return {
        ...state,
        gamesList: payload
      }

    case 'SET_WALLET_MODAL':
      return {
        ...state,
        isWalletConnectModalOpen: payload,
      };

    case 'SET_TXN_STATUS':
      return {
        ...state,
        txnStatus: payload,
      };
    default:
      return state;
  }
};

const AppContext = createContext(initialContext);
export const useAppContext = () => React.useContext(AppContext);
export const AppContextProvider = ({ children }) => {
  const [store, dispatch] = useReducer(appReducer, initialContext);

  const contextValue = {
    metaMaskWalletBalance: store.metaMaskWalletBalance,
    setMetaMaskWalletBalance: (balance) => {
      dispatch({ type: 'SET_META_MASK_WALLET_BALANCE', payload: balance });
    },
    appWalletBalance: store.appWalletBalance,
    setAppWalletBalance: (balance) => {
      dispatch({ type: 'SET_APP_WALLET_BALANCE', payload: balance });
    },
    gamesList: store.gamesList,
    setGamesList: (games) => {
      dispatch({type: 'SET_GAMES_LIST', payload: games })
    },
    isWalletConnectModalOpen: store.isWalletConnectModalOpen,
    setWalletConnectModal: (open) => {
      dispatch({ type: 'SET_WALLET_MODAL', payload: open });
    },
    txnStatus: store.txnStatus,
    setTxnStatus: (status) => {
      dispatch({ type: 'SET_TXN_STATUS', payload: status });
    },
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
