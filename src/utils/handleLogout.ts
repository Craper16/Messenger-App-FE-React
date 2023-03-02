import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import { AppDispatch } from '../redux/store';

export function handleLogout({
  defaultAuth,
  defaultServers,
  defaultSocket,
  dispatch,
}: {
  dispatch: AppDispatch;
  defaultAuth: ActionCreatorWithoutPayload<'auth/defaultAuth'>;
  defaultSocket: ActionCreatorWithoutPayload<'socket/defaultSocket'>;
  defaultServers: ActionCreatorWithoutPayload<'server/defaultServers'>;
}) {
  dispatch(defaultAuth());
  dispatch(defaultSocket());
  dispatch(defaultServers());
  localStorage.clear();
}
