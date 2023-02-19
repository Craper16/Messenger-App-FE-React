import { Button, Spinner } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHANGE_PASSWORD } from '../../consts/routeNames';
import { useGetUserDataQuery } from '../../redux/api/authApi';
import { setUserInfo } from '../../redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { displayName, email, phoneNumber } = useAppSelector(
    (state) => state.auth
  );

  const { isError, isFetching, isSuccess, data, error } = useGetUserDataQuery();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUserInfo({ ...data! }));
    }
  }, [isSuccess]);

  if (isError) {
    return <div>{(error as { message: string; status: number })?.message}</div>;
  }

  if (isFetching) {
    return <Spinner />;
  }

  return (
    <div>
      <div>{displayName}</div>
      <div>{email}</div>
      <div>{phoneNumber}</div>
      <Button onClick={() => navigate(CHANGE_PASSWORD)}>Change Password</Button>
    </div>
  );
}
