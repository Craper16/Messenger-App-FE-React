import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import { AppDispatch } from '../redux/store';

export function handleLogout(
  dispatch: AppDispatch,
  defaultAuth: ActionCreatorWithoutPayload<'auth/defaultAuth'>
) {
  dispatch(defaultAuth());
  localStorage.clear();
}
