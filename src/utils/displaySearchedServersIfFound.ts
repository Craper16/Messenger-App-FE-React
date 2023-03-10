import { Dispatch, SetStateAction, useEffect } from 'react';
import { ServerData } from '../redux/server/serverSlice';

export const displaySearchedServersIfFound = ({
  data,
  setSearchedServers,
}: {
  data: ServerData[] | undefined;
  setSearchedServers: Dispatch<SetStateAction<ServerData[]>>;
}) =>
  useEffect(() => {
    if (data) {
      setSearchedServers(data);
    }
  }, [data]);
