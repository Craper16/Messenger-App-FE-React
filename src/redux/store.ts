import { configureStore } from '@reduxjs/toolkit';

import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/authApi';
import authSlice from './auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
