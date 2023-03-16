import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { connect, Socket } from 'socket.io-client';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../consts/constants';
import { AuthModel } from '../redux/auth/authSlice';
import { setSocket } from '../redux/socket/socketSlice';
import { AppDispatch, store } from '../redux/store';

export function storeAuthData(
  dispatch: AppDispatch,
  setUser: ActionCreatorWithPayload<AuthModel, 'auth/setUser'>,
  data: AuthModel
) {
  return (
    dispatch(setUser({ ...data! })),
    localStorage.setItem(ACCESS_TOKEN, data?.access_token!),
    localStorage.setItem(REFRESH_TOKEN, data?.refresh_token!)
  );
}

export const storeAuthDataOnSuccessfulAuthUseEffect = ({
  isSuccess,
  dispatch,
  setUser,
  data,
}: {
  isSuccess: boolean;
  dispatch: AppDispatch;
  setUser: ActionCreatorWithPayload<AuthModel, 'auth/setUser'>;
  data: AuthModel | undefined;
}) =>
  useEffect(() => {
    if (isSuccess) {
      const socket = connect(import.meta.env.VITE_API_KEY, {
        query: { access_token: data?.access_token!, userId: data?.userId },
      });
      storeAuthData(dispatch, setUser, data!);
      store.dispatch(setSocket(socket));
    }
  }, [isSuccess, dispatch]);
