import { Text } from '@chakra-ui/react';
import React from 'react';
import { useParams } from 'react-router';
import ErrorMessage from '../../../components/ErrorMessage';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ServerMembers from '../../../components/Server/ServerMembers';
import { useFetchServerDataQuery } from '../../../redux/api/serverApi';

export default function ManageServer() {
  const { serverId } = useParams<{ serverId: string }>();

  const { data, error, isError, isFetching } = useFetchServerDataQuery({
    serverId: serverId!,
  });

  console.log(data);

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
    <div>
      <Text className="text-center">{data?.name}</Text>
      <Text className="text-center">Members</Text>
      <div className="ml-44 justify-center">
        <span className="grid grid-cols-4 mt-4">
          <Text className="text-purple-900 font-bold text-2xl">Name</Text>
          <Text className="text-purple-900 font-bold text-2xl">Email</Text>
          <Text className="text-purple-900 font-bold text-2xl">
            Phone Number
          </Text>
          <Text className="text-purple-900 font-bold text-2xl">Kick</Text>
        </span>
      </div>
      {data?.members.map((member) => (
        <ServerMembers memberId={member} />
      ))}
      <Text className="text-center mt-5">
        {'Total Messages: ' + data?.messages.length}
      </Text>
    </div>
  );
}
