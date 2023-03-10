import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageDataModel } from '../../helpers/servers/sendMessageToServer';
export interface ServerData {
  name: string;
  members: string[];
  owner: string;
  messages: MessageDataModel[];
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
    leaveServer: (state, action: PayloadAction<{ serverId: string }>) => {
      state.userServers = [
        ...state.userServers.filter(
          (server) => server._id !== action.payload.serverId
        ),
      ];
    },
    joinServer: (state, action: PayloadAction<{ server: ServerData }>) => {
      state.userServers = [action.payload.server, ...state.userServers];
    },
  },
});

export const { defaultServers, setUserServers, joinServer, leaveServer } =
  serverSlice.actions;

export default serverSlice.reducer;
