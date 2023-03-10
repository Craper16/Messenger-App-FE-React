import { Dispatch, SetStateAction, useEffect } from 'react';
import { MessageDataModel } from '../helpers/servers/sendMessageToServer';
import { ServerData } from '../redux/server/serverSlice';

export const addMessagesFromServer = ({
  data,
  setSentAndReceivedMessages,
}: {
  data: ServerData | undefined;
  setSentAndReceivedMessages: Dispatch<SetStateAction<MessageDataModel[]>>;
}) =>
  useEffect(() => {
    if (data) {
      setSentAndReceivedMessages([...data?.messages]);
    }
  }, [data]);
