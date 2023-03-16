import { useEffect, Dispatch, SetStateAction } from 'react';
import { ServerData } from '../redux/server/serverSlice';

export const browseServersEffect = ({
  data,
  setFetchedServers,
  setIsScrollEnd,
}: {
  data: ServerData[] | undefined;
  setFetchedServers: Dispatch<SetStateAction<ServerData[]>>;
  setIsScrollEnd: Dispatch<SetStateAction<boolean>>;
}) =>
  useEffect(() => {
    if (data) {
      setFetchedServers((prevFetchedServers) => [
        ...prevFetchedServers,
        ...data,
      ]);
    }
    if (data?.length === 0) {
      setIsScrollEnd(true);
    }
  }, [data]);
