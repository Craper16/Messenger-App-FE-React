import React, { RefObject } from 'react';
import { MessageDataModel } from '../../helpers/servers/sendMessageToServer';
import { Card, CardBody, CardHeader, Text } from '@chakra-ui/react';
import {
  messageSentToday,
  messageSentYesterday,
} from '../../helpers/date/dateCheckers';

type props = {
  message: MessageDataModel;
  messagesDivRef: RefObject<HTMLDivElement>;
  userId: string;
};

export default function MessageItem({
  message,
  messagesDivRef,
  userId,
}: props) {
  const date = new Date(message.sentAt);

  return (
    <Card
      backgroundColor={
        message.sender._id === userId ? 'purple.100' : 'gray.500'
      }
      variant="elevated"
      ref={messagesDivRef}
      className={
        message.sender._id === userId
          ? 'flex flex-col ml-9 m-5 mt-3 w-5/6'
          : 'flex flex-col ml-9 m-5 mt-3 w-5/6'
      }
    >
      <CardHeader className="flex font-bold font-sans">
        <Text className="mr-3 text-lg">{message.sender.displayName}</Text>
        {messageSentToday({ date }) && (
          <Text className="text-gray-600 font-normal text-sm mt-1.5">{`Today at ${
            date.toISOString().split('T')[1].split('.')[0]
          }`}</Text>
        )}
        {messageSentYesterday({ date }) && (
          <Text className="text-gray-600 font-normal text-sm mt-1.5">{`Yesterday at ${
            date.toISOString().split('T')[1].split('.')[0]
          }`}</Text>
        )}
        {!messageSentToday({ date }) && !messageSentYesterday({ date }) && (
          <Text className="text-gray-600 font-normal text-sm mt-1.5">{`${
            date.toISOString().split('T')[0]
          } at ${date.toISOString().split('T')[1].split('.')[0]}`}</Text>
        )}
      </CardHeader>
      <CardBody>
        <Text className="p-3">{`${message.content}`}</Text>
      </CardBody>
    </Card>
  );
}
