// import logger from 'redux-logger';
// import { applyMiddleware, createStore } from 'redux';
import { createStore } from 'redux';
import rootReducer from './reducers/root.reducer';

const store = createStore(rootReducer);

// const makeConfiguredStore = rootReducer => createStore(rootReducer, undefined, applyMiddleware(logger));

// const makeStore = () => {
//     const isServer = typeof window === 'undefined';
  
//     if (isServer) {
//         return makeConfiguredStore(rootReducer);
//     } else {
//         // we need it only on client side
//         const { persistStore, persistReducer } = require('redux-persist');
//         const storage = require('redux-persist/lib/storage').default;

//         const persistConfig = {
//             key: 'nextjs',
//             whitelist: ['fromClient'], // make sure it does not clash with server keys
//             storage,
//         };
  
//         const persistedReducer = persistReducer(persistConfig, reducer);
//         const store = makeConfiguredStore(persistedReducer);

//         store.__persistor = persistStore(store); // Nasty hack

//         return store;
//     }
//   };
  
//   export const wrapper = createWrapper(makeStore);

export default store;