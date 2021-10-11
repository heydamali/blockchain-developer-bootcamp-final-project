import React, { createContext, useReducer } from 'react';

const initialContext = {
  walletBalance: '--',
  setWalletBalance: () => {},
  appBalance: '--',
  setAppBalance: () => {},
  isWalletConnectionModalOpen: false,
  setWalletConnectModal: () => {},
  txnStatus: 'NOT_SUBMITTED',
  setTxnStatus: () => {},
};

const appReducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_WALLET_BALANCE':
      return {
        ...state,
        walletBalance: payload,
      };
  
    case 'SET_APP_BALANCE':
      return {
        ...state,
        appBalance: payload,
      };

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
    walletBalance: store.walletBalance,
    setWalletBalance: (balance) => {
      dispatch({ type: 'SET_WALLET_BALANCE', payload: balance });
    },
    appBalance: store.appBalance,
    setAppBalance: (balance) => {
      dispatch({ type: 'SET_APP_BALANCE', payload: balance });
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
