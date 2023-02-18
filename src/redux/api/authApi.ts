import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { AuthModel } from '../auth/authSlice';

export interface credentials {
  email: string;
  password: string;
}

export interface AuthErrorResponse {
  data: { data: { message: string; status: string } };
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_KEY }),
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
  }),
});

export const { useSignInUserMutation } = authApi;
