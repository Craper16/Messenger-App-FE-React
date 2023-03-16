import {
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import ErrorMessage from '../../../components/ErrorMessage';
import LoadingIndicator from '../../../components/LoadingIndicator';
import MessageItem from '../../../components/Messages/MessageItem';
import { messageFailedToSaveToServer } from '../../../utils/messageFailedToSave';
import ServerHeader from '../../../components/Server/ServerHeader';
import { MANAGE_SERVER_NAV } from '../../../consts/routeNames';

export default function Server() {
  const navigate = useNavigate();
  const toast = useToast();
  const { serverId } = useParams<{ serverId: string }>();
  const messagesDivRef = useRef<HTMLDivElement>(null);
  const [messageToSend, setMessageToSend] = useState('');
  const [sentAndReceivedMessages, setSentAndReceivedMessages] = useState<
    MessageDataModel[]
  >([]);

  const socket = useAppSelector((state) => state.socket.socket);
  const { userId, displayName, email, phoneNumber } = useAppSelector(
    (state) => state.auth
  );

  const { isError, isFetching, error, data } = useFetchServerDataQuery({
    serverId: serverId!,
  });

  const [addMessageToServerMutation, addMessageToServerMutationResponse] =
    useAddMessageToServerMutation();

  function handleNavigateToManageServer({ serverId }: { serverId: string }) {
    return navigate(MANAGE_SERVER_NAV(serverId));
  }

  scrollToBottomOfMessages({ messagesDivRef, sentAndReceivedMessages });

  addMessagesFromServer({ data, setSentAndReceivedMessages });

  addMessagesReceived({ setSentAndReceivedMessages, socket });

  messageFailedToSaveToServer({
    addMessageToServerError: addMessageToServerMutationResponse.error,
    addMessageToServerIsError: addMessageToServerMutationResponse.isError,
    toast: toast,
  });

  if (isError) {
    return (
      <ErrorMessage
        message={(error as { message: string; status: number }).message}
      />
    );
  }

  if (isFetching) {
    return <LoadingIndicator />;
  }

  return (
    <div
      style={{ height: '83vh' }}
      className="flex flex-col w-full h-screen absolute overflow-hidden"
    >
      <div className="flex flex-row justify-center m-auto w-full bg-purple-900">
        <ServerHeader
          userId={userId!}
          owner={data?.owner!}
          serverName={data?.name!}
          handleNavigateToManageServer={() =>
            handleNavigateToManageServer({ serverId: data?._id! })
          }
        />
      </div>
      <div className="flex-grow overflow-y-auto overflow-x-hidden mb-auto md:mb-4">
        {sentAndReceivedMessages.map((message, i) => (
          <MessageItem
            userId={userId!}
            message={message}
            messagesDivRef={messagesDivRef}
            key={i}
          />
        ))}
      </div>
      <div className="flex bottom-0 fixed w-full">
        <InputGroup className="flex justify-center align-middle">
          <Input
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
            className="cursor-pointer"
            children={<MdSend className="text-purple-900" />}
          />
        </InputGroup>
      </div>
    </div>
  );
}
