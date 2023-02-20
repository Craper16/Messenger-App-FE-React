import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/dist/query';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../consts/constants';
import JwtDecode from 'jwt-decode';
import dayjs from 'dayjs';
import { AuthModel, defaultAuth, setUser } from '../redux/auth/authSlice';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';

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
  const access_token = localStorage.getItem(ACCESS_TOKEN);
  const refresh_token = localStorage.getItem(REFRESH_TOKEN);

  if (refresh_token && access_token) {
    const user: { exp: number } = JwtDecode(access_token);
    const isAccessTokenExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isAccessTokenExpired) return await baseQuery(args, api, extraOptions);

    if ((args as { url: string; method: string }).url === '/auth/refresh')
      return await baseQuery(args, api, extraOptions);

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
    } else {
      api.dispatch(defaultAuth());
      localStorage.clear();
    }
  }
  return await baseQuery(args, api, extraOptions);
};
