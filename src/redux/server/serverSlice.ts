import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MessageModel {
  content: string;
  receiver: string;
  sender: string;
  sentAt: Date;
}

export interface ServerData {
  name: string;
  members: string[];
  owner: string;
  messages: MessageModel[];
  _id: string;
}

interface ServerSliceModel {
  userServers: ServerData[];
}

const initialState: ServerSliceModel = {
  userServers: [],
};

const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    defaultServers: (state) => {
      state.userServers = initialState.userServers;
    },
    setUserServers: (
      state,
      action: PayloadAction<{ servers: ServerData[] }>
    ) => {
      state.userServers = action.payload.servers;
    },
  },
});

export const { defaultServers, setUserServers } = serverSlice.actions;

export default serverSlice.reducer;
