import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Text, useToast } from '@chakra-ui/react';
import ServerSearchItem from '../../../components/Server/ServerSearchItem';
import {
  useFetchAllServersQuery,
  useJoinServerMutation,
} from '../../../redux/api/serverApi';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { joinServer, ServerData } from '../../../redux/server/serverSlice';
import ErrorMessage from '../../../components/ErrorMessage';
import LoadingIndicator from '../../../components/LoadingIndicator';
import { joinAndNavigateToServer } from '../../../utils/joinAndNavigateToServer.ts';
import { browseServersEffect } from '../../../utils/browseServersEffect';

export default function BrowseServers() {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [fetchedServers, setFetchedServers] = useState<ServerData[]>([]);
  const [pageQuery, setPageQuery] = useState(1);
  const [isScrollEnd, setIsScrollEnd] = useState(false);

  const { isError, isFetching, data, error } = useFetchAllServersQuery(
    pageQuery,
    { refetchOnMountOrArgChange: true, refetchOnFocus: true }
  );

  const [joinServerMutation, joinServerMutationReturnObj] =
    useJoinServerMutation();

  const { userId } = useAppSelector((state) => state.auth);
  const socket = useAppSelector((state) => state.socket.socket);

  const handleLoadMore = useCallback(() => {
    if (!isFetching && !isScrollEnd) {
      return setPageQuery((prevPageQuery) => prevPageQuery + 1);
    }
    return;
  }, [isScrollEnd, isFetching, pageQuery]);

  joinAndNavigateToServer({
    data: joinServerMutationReturnObj.data,
    dispatch,
    isSuccess: joinServerMutationReturnObj.isSuccess,
    joinServer,
    navigate,
    socket,
    toast,
  });

  browseServersEffect({ data, setFetchedServers, setIsScrollEnd });

  window.onscroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      handleLoadMore();
    }
  };

  if (isError) {
    return (
      <ErrorMessage
        message={(error as { message: string; status: number }).message}
      />
    );
  }

  return (
    <div className="flex flex-col justify-center align-middle mt-6">
      <div className="ml-auto m-auto mb-4 mr-auto w-96 justify-center align-middle">
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
        {isFetching && <LoadingIndicator />}
        {data?.length === 0 && (
          <Text className="text-center text-purple-900 font-bold text-lg">
            You have reached the end of the servers list
          </Text>
        )}
      </div>
    </div>
  );
}
