import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';

interface SocketModel {
  socket: any | null;
}

const initialState: SocketModel = {
  socket: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    defaultSocket: (state) => {
      if (state.socket) {
        state.socket!.disconnect();
      }
      state.socket = null;
    },
    setSocket: (state, action: PayloadAction<Socket<any, any>>) => {
      state.socket = action.payload;
    },
  },
});

export const { defaultSocket, setSocket } = socketSlice.actions;

export default socketSlice.reducer;
