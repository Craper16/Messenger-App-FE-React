import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { NavigateFunction } from 'react-router';
import { PROFILE } from '../consts/routeNames';
import { ChangePasswordResponse } from '../redux/api/authApi';
import { UserInfo } from '../redux/auth/authSlice';
import { AppDispatch } from '../redux/store';

export const storeAuthDataOnUserInfoChange = ({
  dispatch,
  isSuccess,
  setUserInfo,
  data,
  navigate,
}: {
  isSuccess: boolean;
  dispatch: AppDispatch;
  setUserInfo: ActionCreatorWithPayload<UserInfo, 'auth/setUserInfo'>;
  data: UserInfo | ChangePasswordResponse | undefined;
  navigate: NavigateFunction | undefined;
}) =>
  useEffect(() => {
    if (isSuccess) {
      dispatch(setUserInfo({ ...data! }));
      if (navigate) {
        navigate(PROFILE);
      }
    }
  }, [isSuccess, dispatch]);
