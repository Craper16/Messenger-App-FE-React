import React, { RefObject, useState } from 'react';
import { MessageDataModel } from '../../helpers/servers/sendMessageToServer';
import { Card, CardBody, CardHeader, Text } from '@chakra-ui/react';
import {
  messageSentToday,
  messageSentYesterday,
} from '../../helpers/date/dateCheckers';
import { useGetUserDataByIdQuery } from '../../redux/api/authApi';

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
  const [showMoreUserInfo, setShowMoreUserInfo] = useState(false);

  const date = new Date(message.sentAt);

  const isUserTheServerOwner = message.sender._id === userId;

  const { data, isFetching, isError, error } = useGetUserDataByIdQuery(
    message.sender._id
  );

  return (
    <Card
      backgroundColor={isUserTheServerOwner ? 'purple.100' : 'purple.200'}
      variant="elevated"
      ref={messagesDivRef}
      className="flex flex-col ml-9 m-5 mt-3 w-5/6"
    >
      <CardHeader className="flex font-bold font-sans">
        <Text
          className="mr-3 cursor-pointer text-lg hover:text-xl duration-300"
          onMouseEnter={() => setShowMoreUserInfo(true)}
          onMouseLeave={() => setShowMoreUserInfo(false)}
        >
          {data?.displayName}
        </Text>
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
      {showMoreUserInfo && (
        <div className="absolute bg-purple-50 border rounded-md ml-60 p-8 duration-300">
          <div className="flex">
            <Text>Display Name: </Text>
            <Text className="uppercase">{data?.displayName}</Text>
          </div>
          <div className="flex">
            <Text>Email: </Text>
            <Text>{data?.email}</Text>
          </div>
          <div className="flex">
            <Text>Phone Number</Text>
            <Text>{data?.phoneNumber}</Text>
          </div>
        </div>
      )}
      <CardBody>
        <Text className="p-3">{`${message.content}`}</Text>
      </CardBody>
    </Card>
  );
}
