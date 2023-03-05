import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import ServerItem from '../../components/Server/ServerItem';
import {
  BROWSE_SERVERS,
  CREATE_SERVER,
  SERVER_NAV,
} from '../../consts/routeNames';
import { useFetchUserServersQuery } from '../../redux/api/serverApi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setUserServers } from '../../redux/server/serverSlice';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data, isFetching, isError, error } = useFetchUserServersQuery();

  const { userId } = useAppSelector((state) => state.auth);
  const { userServers } = useAppSelector((state) => state.server);
  const socket = useAppSelector((state) => state.socket.socket);

  const fetchingDataIsSuccessfulButNoServersFound =
    !isFetching && !isError && userServers.length === 0;

  useEffect(() => {
    if (data) {
      dispatch(setUserServers({ servers: data }));
      (socket as Socket).emit('join_servers', [
        ...data.map((server) => server._id),
      ]);
    }
  }, [data]);

  if (isError) {
    return (
      <Text>{(error as { message: string; status: number })?.message}</Text>
    );
  }

  return (
    <>
      <Text className="text-center">Your Servers</Text>
      {fetchingDataIsSuccessfulButNoServersFound && (
        <Box className="justify-center align-middle m-auto">
          <Text>
            You dont have any servers joined, join or create a server to start
            the fun
          </Text>
          <Button onClick={() => navigate(BROWSE_SERVERS)}>
            Browse Servers
          </Button>
          <Button onClick={() => navigate(CREATE_SERVER)}>
            Create a Server
          </Button>
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
