import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../../utils/baseQueryWithReauth';
import { ServerData } from '../server/serverSlice';
import { ErrorResponse } from './authApi';

export const serverApi = createApi({
  reducerPath: 'serverApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    createServer: builder.mutation<ServerData, string>({
      query: (body) => ({ url: '/server/create-server', method: 'POST', body }),
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    fetchUserServers: builder.query<ServerData[], void>({
      query: () => '/server/me',
      transformResponse: (response: { servers: ServerData[] }) =>
        response.servers,
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    fetchAllServers: builder.query<ServerData[], void>({
      query: () => '/server/all',
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    searchServers: builder.mutation<ServerData[], string>({
      query: (body) => ({
        url: '/server/search',
        body: { search: body },
      }),
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    fetchServerData: builder.query<ServerData, { serverId: string }>({
      query: ({ serverId }) => ({
        url: `/server/${serverId}`,
      }),
      transformResponse: (response: { server: ServerData }) => response.server,
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    updateServer: builder.mutation<
      ServerData,
      { serverId: string; newServerName: string }
    >({
      query: ({ newServerName, serverId }) => ({
        url: '/server/update-server/',
        params: { serverId },
        method: 'PUT',
        body: newServerName,
      }),
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    deleteServer: builder.mutation<
      { message: string; server: ServerData },
      { serverId: string; serverName: string }
    >({
      query: ({ serverId, serverName }) => ({
        url: '/server/delete/',
        params: { serverId },
        body: serverName,
      }),
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    joinServer: builder.mutation<
      { message: string; server: ServerData },
      string
    >({
      query: (body) => ({
        url: '/server/join/',
        method: 'PUT',
        params: { serverId: body },
      }),
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    leaveServer: builder.mutation<
      { message: string; server: ServerData },
      string
    >({
      query: (body) => ({
        url: '/server/leave/',
        params: { serverId: body },
      }),
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    kickFromServer: builder.mutation<
      {
        message: string;
        kickedUser: string;
        server: ServerData;
      },
      { serverId: string; kickedUserId: string }
    >({
      query: ({ kickedUserId, serverId }) => ({
        url: '/server/kick/',
        params: { serverId },
        body: { kickedUserId },
      }),
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
  }),
});

export const {
  useCreateServerMutation,
  useDeleteServerMutation,
  useFetchAllServersQuery,
  useFetchServerDataQuery,
  useFetchUserServersQuery,
  useSearchServersMutation,
  useUpdateServerMutation,
  useJoinServerMutation,
  useLeaveServerMutation,
  useKickFromServerMutation,
} = serverApi;
