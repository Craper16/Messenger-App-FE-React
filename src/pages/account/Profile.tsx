import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { CHANGE_PASSWORD, UPDATE_USER_INFO } from '../../consts/routeNames';
import { useGetUserDataQuery } from '../../redux/api/authApi';
import { setUserInfo } from '../../redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { storeAuthDataOnUserInfoChange } from '../../utils/storeAuthDataOnUserInfoChange';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { displayName, email, phoneNumber } = useAppSelector(
    (state) => state.auth
  );

  const { isError, isSuccess, data, error } = useGetUserDataQuery();

  storeAuthDataOnUserInfoChange({
    data,
    dispatch,
    isSuccess,
    navigate: undefined,
    setUserInfo,
    toast: undefined,
  });

  if (isError) {
    return <div>{(error as { message: string; status: number })?.message}</div>;
  }

  return (
    <div>
      <div>{displayName}</div>
      <div>{email}</div>
      <div>{phoneNumber}</div>
      <Button onClick={() => navigate(CHANGE_PASSWORD)}>Change Password</Button>
      <Button onClick={() => navigate(UPDATE_USER_INFO)}>Update Info</Button>
    </div>
  );
}
