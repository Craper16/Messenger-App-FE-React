import { configureStore } from '@reduxjs/toolkit';

import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/authApi';
import { serverApi } from './api/serverApi';
import authSlice from './auth/authSlice';
import serverSlice from './server/serverSlice';
import socketSlice from './socket/socketSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    socket: socketSlice,
    server: serverSlice,
    [authApi.reducerPath]: authApi.reducer,
    [serverApi.reducerPath]: serverApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(authApi.middleware)
      .concat(serverApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
