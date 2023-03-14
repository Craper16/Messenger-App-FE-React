import { Box, Button, SimpleGrid, Text } from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import ServerItem from '../../components/Server/ServerItem';
import { BROWSE_SERVERS } from '../../consts/routeNames';
import { useFetchUserServersQuery } from '../../redux/api/serverApi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setUserServers } from '../../redux/server/serverSlice';
import { setUserServersAndJoinServers } from '../../utils/setUserServersAndJoinServers';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data, isFetching, isError, error } = useFetchUserServersQuery(
    undefined,
    {
      refetchOnReconnect: true,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const { userId } = useAppSelector((state) => state.auth);
  const { userServers } = useAppSelector((state) => state.server);
  const socket = useAppSelector((state) => state.socket.socket);

  const fetchingDataIsSuccessfulButNoServersFound =
    !isFetching && !isError && userServers.length === 0;

  setUserServersAndJoinServers({ data, dispatch, setUserServers, socket });

  if (isError) {
    return (
      <ErrorMessage
        message={(error as { message: string; status: number }).message}
      />
    );
  }

  return (
    <>
      <div className="flex justify-center">
        <Text className="text-purple-900 font-bold text-2xl">
          Your Servers
        </Text>
        <MdAdd className="cursor-pointer ml-4 mt-1.5 text-2xl text-purple-900 hover:scale-110 duration-300" />
      </div>
      {fetchingDataIsSuccessfulButNoServersFound && (
        <Box className="justify-center align-middle m-auto">
          <Text>
            You dont have any servers joined, join or create a server to start
            the fun
          </Text>
          <Button onClick={() => navigate(BROWSE_SERVERS)}>
            Browse Servers
          </Button>
          <Button>Create a Server</Button>
        </Box>
      )}
      <SimpleGrid
        columnGap={25}
        columns={4}
      >
        {userServers.map((server) => (
          <ServerItem
            key={server._id}
            navigate={navigate}
            server={server}
            userId={userId!}
          />
        ))}
      </SimpleGrid>
    </>
  );
}
