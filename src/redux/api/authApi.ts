import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthModel, defaultAuth, setUser, UserInfo } from '../auth/authSlice';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../consts/constants';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

export interface credentials {
  email: string;
  password: string;
}

export interface signUpInfo extends credentials {
  displayName: string;
  phoneNumber: number;
}

export interface AuthErrorResponse {
  data: { data: { message: string; status: string } };
}

export interface ChangePasswordResponse extends UserInfo {
  message: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_KEY,
  prepareHeaders: (headers) => {
    const access_token = localStorage.getItem(ACCESS_TOKEN);

    if (access_token) {
      return headers.set('Authorization', `Bearer ${access_token}`);
    }
  },
});
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const refresh_token = localStorage.getItem(REFRESH_TOKEN);
  console.log(refresh_token);
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    console.log('Access token expired');
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refresh_token: refresh_token },
      },
      api,
      {}
    );

    if (refreshResult.data) {
      // localStorage.setItem(ACCESS_TOKEN, refreshResult.data.access_token);
      // localStorage.setItem(REFRESH_TOKEN, refreshResult.data.refresh_token);
      // api.dispatch(setUser(refreshResult.data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(defaultAuth());
      localStorage.clear();
    }
  }
  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signInUser: builder.mutation<AuthModel, credentials>({
      query: (body) => ({
        url: '/auth/signin',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) =>
        (response as AuthErrorResponse).data.data,
    }),
    signUpUser: builder.mutation<AuthModel, signUpInfo>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) =>
        (response as AuthErrorResponse).data.data,
    }),
    refreshTokens: builder.mutation<AuthModel, { refresh_token: string }>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),
    getUserData: builder.query<UserInfo, void>({
      query: () => ({
        url: '/auth/me',
      }),
    }),
    changeUserPassword: builder.mutation<
      ChangePasswordResponse,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: '/auth/me/change-password',
        method: 'PUT',
        body,
      }),
      transformErrorResponse: (response) =>
        (response as AuthErrorResponse).data.data,
    }),
  }),
});

export const {
  useSignInUserMutation,
  useSignUpUserMutation,
  useRefreshTokensMutation,
  useGetUserDataQuery,
  useChangeUserPasswordMutation,
} = authApi;
