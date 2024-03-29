import { createApi } from '@reduxjs/toolkit/query/react';
import { MessageDataModel } from '../../helpers/servers/sendMessageToServer';
import { baseQueryWithReauth } from '../../utils/baseQueryWithReauth';
import { ServerData } from '../server/serverSlice';
import { ErrorResponse } from './authApi';

export const serverApi = createApi({
  reducerPath: 'serverApi',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    createServer: builder.mutation<
      { message: string; server: ServerData },
      string
    >({
      query: (body) => ({
        url: '/server/create-server',
        method: 'POST',
        body: { name: body },
      }),
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
    fetchAllServers: builder.query<ServerData[], number>({
      query: (page) => `/server/all?page=${page}`,
      transformResponse: (response: { servers: ServerData[] }) =>
        response.servers,
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    searchServers: builder.mutation<ServerData[], string>({
      query: (body) => ({
        url: '/server/search',
        method: 'POST',
        body: { search: body },
      }),
      transformResponse: (response: { servers: ServerData[] }) =>
        response.servers,
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
        url: `/server/update-server/${serverId}`,
        method: 'PUT',
        body: { newServerName: newServerName },
      }),
      transformResponse: (response: { server: ServerData }) => response.server,
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    deleteServer: builder.mutation<
      { message: string; server: ServerData },
      { serverId: string; serverName: string }
    >({
      query: ({ serverId, serverName }) => ({
        url: `/server/delete/${serverId}`,
        method: 'DELETE',
        body: { serverName },
      }),
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    joinServer: builder.mutation<
      { message: string; server: ServerData },
      { serverId: string }
    >({
      query: ({ serverId }) => ({
        url: `/server/join/${serverId}`,
        method: 'PUT',
      }),
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    leaveServer: builder.mutation<
      { message: string; server: ServerData },
      string
    >({
      query: (serverId) => ({
        url: `/server/leave/${serverId}`,
        method: 'PUT',
      }),
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    kickFromServer: builder.mutation<
      {
        message: string;
        kickedUser: { _id: string };
        server: ServerData;
      },
      { serverId: string; kickedUserId: string }
    >({
      query: ({ kickedUserId, serverId }) => ({
        url: `/server/kick/${serverId}`,
        method: 'PUT',
        body: { kickedUserId },
      }),
      transformErrorResponse: (response) =>
        (response as ErrorResponse).data.data,
    }),
    addMessageToServer: builder.mutation<ServerData, MessageDataModel>({
      query: (body) => ({
        url: '/server/add-message',
        method: 'PUT',
        body,
      }),
      transformResponse: (response: { server: ServerData }) => response.server,
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
  useAddMessageToServerMutation,
} = serverApi;
