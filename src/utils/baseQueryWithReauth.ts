import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/dist/query';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../consts/constants';
import { AuthModel, defaultAuth, setUser } from '../redux/auth/authSlice';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { handleLogout } from './handleLogout';
import { defaultServers } from '../redux/server/serverSlice';
import { defaultSocket } from '../redux/socket/socketSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_KEY,
  prepareHeaders: (headers) => {
    const access_token = localStorage.getItem(ACCESS_TOKEN);

    if (access_token) {
      return headers.set('Authorization', `Bearer ${access_token}`);
    }
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const refresh_token = localStorage.getItem(REFRESH_TOKEN);

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refresh_token: refresh_token },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      localStorage.setItem(
        ACCESS_TOKEN,
        (refreshResult as QueryReturnValue<AuthModel>)?.data?.access_token!
      );
      localStorage.setItem(
        REFRESH_TOKEN,
        (refreshResult as QueryReturnValue<AuthModel>)?.data?.refresh_token!
      );
      api.dispatch(
        setUser({ ...(refreshResult as QueryReturnValue<AuthModel>).data! })
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      handleLogout({
        dispatch: api.dispatch,
        defaultAuth,
        defaultServers,
        defaultSocket,
      });
    }
  }
  return result;
};
