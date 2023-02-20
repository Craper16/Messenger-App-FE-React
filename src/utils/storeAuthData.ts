import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../consts/constants';
import { AuthModel } from '../redux/auth/authSlice';
import { AppDispatch } from '../redux/store';

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
      storeAuthData(dispatch, setUser, data!);
    }
  }, [isSuccess, dispatch]);
