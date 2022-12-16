// Library Imports 

import storage from 'reduxjs-toolkit-persist/lib/storage'
import { persistCombineReducers } from 'reduxjs-toolkit-persist'
// import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'reduxjs-toolkit-persist';

// ⬇ The following Library Imports is for Sync Redux States across Browsers Tabs.

import {
  applyMiddleware, compose, createStore,
  // configureStore,
} from '@reduxjs/toolkit';
import {
  createStateSyncMiddleware,
  initMessageListener,
} from "redux-state-sync";


// Slices Imports 

import cartReducer from './slices/cartSlice'
import accountReducer from './slices/accountSlice'
import currencyReducer from './slices/currencySlice'
import multiLocationSlice from './slices/multiLocationSlice';

// ⬇ Do this if you want to retain state value on Reload.

const persistConfig = {
  key: 'root',
  storage: storage,
};

const _persistedReducer = persistCombineReducers(
  persistConfig,
  {
    cart: cartReducer,
    multiLocation: multiLocationSlice,
    account: accountReducer,
    currency: currencyReducer,
  }
);

// export const store = configureStore({
//   reducer: _persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });

// ⬇ The following settings is for Sync Redux States across Browsers Tabs.

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  _persistedReducer,
  composeEnhancers(applyMiddleware(
    createStateSyncMiddleware({
      blacklist: ["persist/PERSIST", "persist/REHYDRATE"],
    })
  ))
);

initMessageListener(store);