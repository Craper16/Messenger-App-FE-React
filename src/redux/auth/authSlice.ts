import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthModel extends UserInfo {
  access_token: string | null;
  refresh_token: string | null;
}

export interface UserInfo {
  email: string | null;
  phoneNumber: number | null;
  displayName: string | null;
  userId: string | null;
}

const initialState: AuthModel = {
  access_token: null,
  refresh_token: null,
  displayName: null,
  email: null,
  phoneNumber: null,
  userId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    defaultAuth: (state) => {
      state.access_token = initialState.access_token;
      state.refresh_token = initialState.refresh_token;
      state.email = initialState.email;
      state.displayName = initialState.displayName;
      state.phoneNumber = initialState.phoneNumber;
      state.userId = initialState.userId;
    },
    setUser: (state, action: PayloadAction<AuthModel>) => {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.phoneNumber = action.payload.phoneNumber;
      state.userId = action.payload.userId;
    },
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
      state.phoneNumber = action.payload.phoneNumber;
      state.userId = action.payload.userId;
    },
  },
});

export const { defaultAuth, setUser } = authSlice.actions;

export default authSlice.reducer;
