import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthModel, UserInfo } from '../auth/authSlice';
import { setHeaders } from '../../helpers/setHeaders';

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

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers) => setHeaders(headers),
  }),
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
        url: '/me',
      }),
    }),
  }),
});

export const {
  useSignInUserMutation,
  useSignUpUserMutation,
  useRefreshTokensMutation,
  useGetUserDataQuery,
} = authApi;
