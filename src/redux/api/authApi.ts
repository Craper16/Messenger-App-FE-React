import { createApi } from '@reduxjs/toolkit/query/react';
import { AuthModel, UserInfo } from '../auth/authSlice';
import { baseQueryWithReauth } from '../../utils/baseQueryWithReauth';

export interface credentials {
  email: string;
  password: string;
}

export interface signUpInfo extends credentials {
  displayName: string;
  phoneNumber: number;
}

export interface ErrorResponse {
  data: { data: { message: string; status: string } };
}

export interface UpdateUserResponse extends UserInfo {
  message: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    signInUser: builder.mutation<AuthModel, credentials>({
      query: (body) => ({
        url: '/auth/signin',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    signUpUser: builder.mutation<AuthModel, signUpInfo>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    refreshTokens: builder.mutation<AuthModel, { refresh_token: string }>({
      query: (body) => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
    }),
    getUserData: builder.query<UserInfo, void>({
      query: () => '/auth/me',
    }),
    getUserDataById: builder.query<UserInfo, string>({
      query: (userId) => `/auth/users/${userId}`,
    }),
    changeUserPassword: builder.mutation<
      UpdateUserResponse,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: '/auth/me/change-password',
        method: 'PUT',
        body,
      }),
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    updateUserInfo: builder.mutation<
      UpdateUserResponse,
      { displayName: string; phoneNumber: number }
    >({
      query: (body) => ({
        url: '/auth/me/update',
        method: 'PUT',
        body,
      }),
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
  }),
});

export const {
  useSignInUserMutation,
  useSignUpUserMutation,
  useRefreshTokensMutation,
  useGetUserDataQuery,
  useChangeUserPasswordMutation,
  useUpdateUserInfoMutation,
  useGetUserDataByIdQuery,
} = authApi;
