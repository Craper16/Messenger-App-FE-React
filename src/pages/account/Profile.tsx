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

  console.log(leaveServerMutationResponse.data);
  console.log(leaveServerMutationResponse.error);
  console.log(deleteServerMutationResponse.data);
  console.log(deleteServerMutationResponse.error);

  const serversToShow = userServersTooLong
    ? userServers.slice(0, 5)
    : userServers;

  leaveOrDeleteServerEffect({
    dispatch,
    leaveServer,
    toast,
    deleteServerMutationResponse,
    leaveServerMutationResponse,
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
    <div className="ml-12 mt-12">
      <div className="ml-auto m-auto mr-auto justify-center align-middle">
        <Text>Display Name</Text>
        <div>{displayName}</div>
        <div>{email}</div>
        <div>{phoneNumber}</div>
        <Button onClick={() => navigate(CHANGE_PASSWORD)}>
          Change Password
        </Button>
        <Button onClick={() => navigate(UPDATE_USER_INFO)}>Update Info</Button>
        <Text>Your Servers: </Text>
        {serversToShow.length > 0 ? (
          serversToShow.map((server) => (
            <ServerRowItem
              key={server._id}
              navigate={navigate}
              server={server}
              userId={userId!}
              leaveServerMutation={leaveServerMutation}
              deleteServerMutation={deleteServerMutation}
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
