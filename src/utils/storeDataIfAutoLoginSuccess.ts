import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { connect } from 'socket.io-client';
import { AuthModel } from '../redux/auth/authSlice';
import { setSocket } from '../redux/socket/socketSlice';
import { AppDispatch, store } from '../redux/store';
import { storeAuthData } from './storeAuthData';

export async function storeDataIfAutoLoginSuccess(
  dispatch: AppDispatch,
  setUser: ActionCreatorWithPayload<AuthModel, 'auth/setUser'>,
  data: AuthModel
) {
  storeAuthData(dispatch, setUser, data);
}

export const storeDataIfAutoLoginSuccessUseEffect = ({
  data,
  defaultAuth,
  defaultServers,
  defaultSocket,
  dispatch,
  handleLogout,
  isError,
  isSuccess,
  setUser,
}: {
  isSuccess: boolean;
  isError: boolean;
  handleLogout: ({
    defaultAuth,
    dispatch,
    defaultServers,
    defaultSocket,
  }: {
    dispatch: AppDispatch;
    defaultAuth: ActionCreatorWithoutPayload<'auth/defaultAuth'>;
    defaultSocket: ActionCreatorWithoutPayload<'socket/defaultSocket'>;
    defaultServers: ActionCreatorWithoutPayload<'server/defaultServers'>;
  }) => void;
  dispatch: AppDispatch;
  defaultAuth: ActionCreatorWithoutPayload<'auth/defaultAuth'>;
  defaultSocket: ActionCreatorWithoutPayload<'socket/defaultSocket'>;
  defaultServers: ActionCreatorWithoutPayload<'server/defaultServers'>;
  setUser: ActionCreatorWithPayload<AuthModel, 'auth/setUser'>;
  data: AuthModel | undefined;
}) =>
  useEffect(() => {
    if (isSuccess) {
      const socket = connect(import.meta.env.VITE_API_KEY, {
        query: { access_token: data?.access_token! },
      });
      storeDataIfAutoLoginSuccess(dispatch, setUser, data!);
      store.dispatch(setSocket(socket));
    } else if (isError) {
      handleLogout({ dispatch, defaultAuth, defaultServers, defaultSocket });
    }
  }, [isSuccess, isError]);
