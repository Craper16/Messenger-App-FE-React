import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { AuthModel } from '../redux/auth/authSlice';
import { AppDispatch } from '../redux/store';
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
  dispatch,
  handleLogout,
  isError,
  isSuccess,
  setUser,
}: {
  isSuccess: boolean;
  isError: boolean;
  handleLogout: (
    dispatch: AppDispatch,
    defaultAuth: ActionCreatorWithoutPayload<'auth/defaultAuth'>
  ) => void;
  dispatch: AppDispatch;
  defaultAuth: ActionCreatorWithoutPayload<'auth/defaultAuth'>;
  setUser: ActionCreatorWithPayload<AuthModel, 'auth/setUser'>;
  data: AuthModel | undefined;
}) =>
  useEffect(() => {
    if (isSuccess) {
      storeDataIfAutoLoginSuccess(dispatch, setUser, data!);
    } else if (isError) {
      handleLogout(dispatch, defaultAuth);
    }
  }, [isSuccess, isError]);
