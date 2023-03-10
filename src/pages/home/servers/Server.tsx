import {
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useParams } from 'react-router';
import {
  useAddMessageToServerMutation,
  useFetchServerDataQuery,
} from '../../../redux/api/serverApi';
import { useAppSelector } from '../../../redux/hooks';
import { MdSend } from 'react-icons/md';
import {
  MessageDataModel,
  sendMessageToServer,
} from '../../../helpers/servers/sendMessageToServer';
import { scrollToBottomOfMessages } from '../../../utils/scrollToBottomOfMessages';
import { addMessagesFromServer } from '../../../utils/addMessagesFromServer';
import { addMessagesReceived } from '../../../utils/addMessagesReceived';

export default function Server() {
  const messagesDivRef = useRef<HTMLDivElement>(null);
  const [messageToSend, setMessageToSend] = useState('');
  const [sentAndReceivedMessages, setSentAndReceivedMessages] = useState<
    MessageDataModel[]
  >([]);

  const { serverId } = useParams<{ serverId: string }>();

  const socket = useAppSelector((state) => state.socket.socket);
  const { userId, displayName, email, phoneNumber } = useAppSelector(
    (state) => state.auth
  );

  const { isError, isFetching, error, data } = useFetchServerDataQuery({
    serverId: serverId!,
  });

  const [addMessageToServerMutation] = useAddMessageToServerMutation();

  scrollToBottomOfMessages({ messagesDivRef, sentAndReceivedMessages });

  addMessagesFromServer({ data, setSentAndReceivedMessages });

  addMessagesReceived({ setSentAndReceivedMessages, socket });

  if (isError) {
    return (
      <Text>{(error as { message: string; status: number })?.message}</Text>
    );
  }

  return (
    <div>
      {isFetching && (
        <div className='flex justify-center align-middle mt-52'>
          <Spinner size='xl' className='text-purple-900' />
        </div>
      )}
      <div className='overflow-y-auto overflow-x-hidden h-96'>
        {sentAndReceivedMessages.map((message, i) => (
          <div
            ref={messagesDivRef}
            key={i}
            className='border border-solid border-y-cyan-800 m-2 p-2'
          >
            <div className='font-bold font-sans'>
              {message.sender.displayName}
            </div>
            <div>{message.content}</div>
          </div>
        ))}
      </div>

      <InputGroup className='flex justify-center align-middle'>
        <Input
          className='w-40'
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.currentTarget.value)}
        />
        <InputRightElement
          onClick={() =>
            sendMessageToServer({
              addMessageToServerMutation,
              displayName: displayName!,
              email: email!,
              message: messageToSend,
              phoneNumber: phoneNumber!,
              serverData: data!,
              setMessageToSend,
              setSentAndReceivedMessages,
              socket,
              userId: userId!,
            })
          }
          className='cursor-pointer'
          children={<MdSend className='text-purple-900' />}
        />
      </InputGroup>
    </div>
  );
}
