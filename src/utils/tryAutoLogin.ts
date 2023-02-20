import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  MutationDefinition,
} from '@reduxjs/toolkit/dist/query';
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { useEffect } from 'react';
import { REFRESH_TOKEN } from '../consts/constants';
import { AuthModel } from '../redux/auth/authSlice';

async function tryAutoLogin(
  refreshTokens: MutationTrigger<
    MutationDefinition<
      {
        refresh_token: string;
      },
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      AuthModel,
      'authApi'
    >
  >
) {
  const refresh_token = localStorage.getItem(REFRESH_TOKEN);

  if (refresh_token) {
    return await refreshTokens({ refresh_token });
  }
}

export const tryAutoLoginUseEffect = (
  refreshTokens: MutationTrigger<
    MutationDefinition<
      {
        refresh_token: string;
      },
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      AuthModel,
      'authApi'
    >
  >
) =>
  useEffect(() => {
    tryAutoLogin(refreshTokens);
  }, []);
