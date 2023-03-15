import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useToast } from '@chakra-ui/react';
import ServerSearchItem from '../../../components/Server/ServerSearchItem';
import {
  useFetchAllServersQuery,
  useJoinServerMutation,
} from '../../../redux/api/serverApi';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { joinServer, ServerData } from '../../../redux/server/serverSlice';
import { displaySearchedServersIfFound } from '../../../utils/displaySearchedServersIfFound';
import ErrorMessage from '../../../components/ErrorMessage';
import LoadingIndicator from '../../../components/LoadingIndicator';
import { joinAndNavigateToServer } from '../../../utils/joinAndNavigateToServer.ts';

export default function BrowseServers() {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [fetchedServers, setFetchedServers] = useState<ServerData[]>([]);
  const [pageQuery, setPageQuery] = useState(1);

  const { isError, isFetching, data, error } = useFetchAllServersQuery(
    pageQuery,
    { refetchOnMountOrArgChange: true, refetchOnFocus: true }
  );

  const [joinServerMutation, joinServerMutationReturnObj] =
    useJoinServerMutation();

  const { userId } = useAppSelector((state) => state.auth);
  const socket = useAppSelector((state) => state.socket.socket);

  joinAndNavigateToServer({
    data: joinServerMutationReturnObj.data,
    dispatch,
    isSuccess: joinServerMutationReturnObj.isSuccess,
    joinServer,
    navigate,
    socket,
    toast,
  });

  displaySearchedServersIfFound({
    data,
    setSearchedServers: setFetchedServers,
  });

  if (isError) {
    return (
      <ErrorMessage
        message={(error as { message: string; status: number }).message}
      />
    );
  }

  return (
    <div className="flex flex-col justify-center align-middle mt-6">
      <div className="ml-auto m-auto mr-auto w-96 justify-center align-middle">
        {isFetching && <LoadingIndicator />}
        {fetchedServers?.map((server) => (
          <ServerSearchItem
            key={server._id}
            userId={userId!}
            joinServerMutation={() =>
              joinServerMutation({ serverId: server._id })
            }
            navigate={navigate}
            server={server}
          />
        ))}
      </div>
    </div>
  );
}
