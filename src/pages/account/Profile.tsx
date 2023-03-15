import { useEffect, useState } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import { CHANGE_PASSWORD, UPDATE_USER_INFO } from '../../consts/routeNames';
import { useGetUserDataQuery } from '../../redux/api/authApi';
import { setUserInfo } from '../../redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { storeAuthDataOnUserInfoChange } from '../../utils/storeAuthDataOnUserInfoChange';
import { Text } from '@chakra-ui/react';
import {
  useDeleteServerMutation,
  useFetchUserServersQuery,
  useLeaveServerMutation,
} from '../../redux/api/serverApi';
import { setUserServersAndJoinServers } from '../../utils/setUserServersAndJoinServers';
import { leaveServer, setUserServers } from '../../redux/server/serverSlice';
import ServerRowItem from '../../components/Server/ServerRowItem';
import { leaveOrDeleteServerEffect } from '../../utils/leaveOrDeleteServerEffect';

export default function Profile() {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { userServers } = useAppSelector((state) => state.server);

  const { displayName, email, phoneNumber, userId } = useAppSelector(
    (state) => state.auth
  );
  const socket = useAppSelector((state) => state.socket.socket);

  const userServersLengthBiggerThanFive = userServers.length > 5;
  const [userServersTooLong, setUserServersTooLong] = useState(() =>
    userServersLengthBiggerThanFive ? true : false
  );

  const getUserDataQuery = useGetUserDataQuery();
  const getUserServers = useFetchUserServersQuery();
  const [leaveServerMutation, leaveServerMutationResponse] =
    useLeaveServerMutation();
  const [deleteServerMutation, deleteServerMutationResponse] =
    useDeleteServerMutation();

  const serversToShow = userServersTooLong
    ? userServers.slice(0, 5)
    : userServers;

  leaveOrDeleteServerEffect({
    dispatch,
    leaveServer,
    toast,
    deleteServerMutationResponse,
    leaveServerMutationResponse,
    socket,
  });

  setUserServersAndJoinServers({
    dispatch,
    setUserServers,
    data: getUserServers.data,
  });

  storeAuthDataOnUserInfoChange({
    data: getUserDataQuery.data,
    dispatch,
    isSuccess: getUserDataQuery.isSuccess,
    navigate: undefined,
    setUserInfo,
    toast: undefined,
  });

  if (getUserDataQuery.isError || getUserServers.isError) {
    return (
      <ErrorMessage
        message={
          (getUserDataQuery.error as { message: string; status: number })
            .message ||
          (getUserServers.error as { message: string; status: number }).message
        }
      />
    );
  }

  return (
    <div className="flex-col mt-12">
      <div className="ml-auto m-auto mr-auto justify-center align-middle">
        <Text className="text-center font-bold text-4xl text-purple-800">
          {displayName}
        </Text>
        <Text className="text-center font-bold text-4xl text-purple-800">
          {email}
        </Text>
        <Text className="text-center font-bold text-4xl text-purple-800">
          {phoneNumber}
        </Text>
        <div className="flex align-middle m-3 justify-evenly">
          <Button
            colorScheme="purple"
            onClick={() => navigate(CHANGE_PASSWORD)}
          >
            Change Password
          </Button>
          <Button
            colorScheme="purple"
            onClick={() => navigate(UPDATE_USER_INFO)}
          >
            Update Info
          </Button>
        </div>
        <Text className="text-center font-bold text-4xl text-purple-800">
          Manage Your Servers{' '}
        </Text>
        {serversToShow.length > 0 ? (
          serversToShow.map((server) => (
            <ServerRowItem
              key={server._id}
              navigate={navigate}
              server={server}
              userId={userId!}
              leaveServerMutation={leaveServerMutation}
              deleteServerMutation={deleteServerMutation}
              deleteServerMutationIsLoading={
                deleteServerMutationResponse.isLoading
              }
              deleteServerMutationError={deleteServerMutationResponse.error}
              deleteServerMutationIsError={deleteServerMutationResponse.isError}
              leaveServerMutationError={leaveServerMutationResponse.error}
              leaveServerMutationIsError={leaveServerMutationResponse.isError}
              toast={toast}
            />
          ))
        ) : (
          <Text>You have no servers joined</Text>
        )}
        {userServersLengthBiggerThanFive && (
          <Button
            onClick={() =>
              setUserServersTooLong(
                (prevUserServersTooLong) => !prevUserServersTooLong
              )
            }
          >
            {userServersTooLong ? 'Show More' : 'Show Less'}
          </Button>
        )}
      </div>
    </div>
  );
}
