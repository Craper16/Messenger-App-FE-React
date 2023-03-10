import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { NavigateFunction } from 'react-router';
import { PROFILE } from '../consts/routeNames';
import { UpdateUserResponse } from '../redux/api/authApi';
import { UserInfo } from '../redux/auth/authSlice';
import { AppDispatch } from '../redux/store';

export const storeAuthDataOnUserInfoChange = ({
  dispatch,
  isSuccess,
  setUserInfo,
  data,
  navigate,
  toast,
}: {
  isSuccess: boolean;
  dispatch: AppDispatch;
  setUserInfo: ActionCreatorWithPayload<UserInfo, 'auth/setUserInfo'>;
  data: UpdateUserResponse | UserInfo | undefined;
  navigate: NavigateFunction | undefined;
  toast: any;
}) =>
  useEffect(() => {
    if (isSuccess) {
      dispatch(setUserInfo({ ...data! }));
      if (navigate) {
        navigate(PROFILE);
      }
      if ((data as UpdateUserResponse)?.message) {
        toast({
          title: 'Success',
          description: (data as UpdateUserResponse)?.message,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }, [isSuccess, dispatch]);
