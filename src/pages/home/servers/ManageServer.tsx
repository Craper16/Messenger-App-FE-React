import { Text, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import ErrorMessage from '../../../components/ErrorMessage';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ServerMembers from '../../../components/Server/ServerMembers';
import {
  useFetchServerDataQuery,
  useKickFromServerMutation,
} from '../../../redux/api/serverApi';
import { kickUserFromServerEffect } from '../../../utils/kickUserFromServerEffect';

export default function ManageServer() {
  const toast = useToast();
  const { serverId } = useParams<{ serverId: string }>();

  const { data, error, isError, isFetching, refetch } = useFetchServerDataQuery(
    {
      serverId: serverId!,
    }
  );

  const [kickMember, kickMemberResponse] = useKickFromServerMutation();

  kickUserFromServerEffect({
    kickMemberIsSuccess: kickMemberResponse.isSuccess,
    kickMemberIsError: kickMemberResponse.isError,
    data: kickMemberResponse.data,
    error: kickMemberResponse.error,
    refetch,
    toast,
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
    <div>
      <Text className="text-center font-bold text-purple-900 text-3xl">
        {data?.name}
      </Text>
      <Text className="text-center font-bold text-purple-900 text-3xl">
        Members
      </Text>
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
        <ServerMembers
          key={member}
          memberId={member}
          kickMember={() =>
            kickMember({ serverId: data?._id, kickedUserId: member })
          }
        />
      ))}
      <Text className="text-center mt-5 font-bold text-purple-900 text-3xl">
        {'Total Messages: ' + data?.messages.length}
      </Text>
    </div>
  );
}
