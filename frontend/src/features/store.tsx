import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import themesReducer from './themes/themesSlices';
import refreshTokenReducer from './token/refreshTokenSlices';
import tokenSlices from './token/tokenSlices';

// redux-persist's own `redux-persist/lib/storage` (and its `createWebStorage`
// submodule) get mis-interop'd by Vite's CJS handling, leaving `storage`/
// `createWebStorage` as non-functions at runtime. Implement the same
// localStorage-backed engine directly to sidestep that entirely.
const storage = {
  getItem(key: string) {
    return Promise.resolve(window.localStorage.getItem(key));
  },
  setItem(key: string, value: string) {
    return Promise.resolve(window.localStorage.setItem(key, value));
  },
  removeItem(key: string) {
    return Promise.resolve(window.localStorage.removeItem(key));
  },
};

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  theme: themesReducer,
  refreshToken: refreshTokenReducer,
  token: tokenSlices,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export { persistor };
