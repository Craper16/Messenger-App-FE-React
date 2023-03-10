import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  MutationDefinition,
} from '@reduxjs/toolkit/dist/query';
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { ServerData } from '../redux/server/serverSlice';

export const searchServersAndClearSearchedServers = ({
  search,
  setSearchedServers,
  searchServers,
}: {
  search: string;
  setSearchedServers: Dispatch<SetStateAction<ServerData[]>>;
  searchServers: MutationTrigger<
    MutationDefinition<
      string,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      ServerData[],
      'serverApi'
    >
  >;
}) =>
  useEffect(() => {
    if (search) {
      searchServers(search);
    }
    if (!search) {
      setSearchedServers([]);
    }
  }, [search]);
