import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { MessageDataModel } from '../helpers/servers/sendMessageToServer';

export const receivedMessageNotification = ({
  socket,
  toast,
  toastIcon,
}: {
  socket: Socket;
  toast: any;
  toastIcon: React.ReactNode;
}) =>
  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (data: MessageDataModel) => {
        if (window.location.pathname.includes(data?.serverId)) return;
        toast({
          icon: toastIcon,
          variant: 'left-accent',
          position: 'bottom-right',
          title: `From ${data?.sender.displayName} to ${data?.serverName}`,
          description:
            data?.content.length > 25
              ? data?.content.substring(0, 25) + '...'
              : data?.content,
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      });
    }
  }, [socket]);
