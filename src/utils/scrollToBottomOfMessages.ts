import React, { useLayoutEffect } from 'react';
import { MessageDataModel } from '../helpers/servers/sendMessageToServer';

export const scrollToBottomOfMessages = ({
  messagesDivRef,
  sentAndReceivedMessages,
}: {
  sentAndReceivedMessages: MessageDataModel[];
  messagesDivRef: React.RefObject<HTMLDivElement>;
}) =>
  useLayoutEffect(() => {
    messagesDivRef.current?.scrollIntoView();
  }, [sentAndReceivedMessages]);
