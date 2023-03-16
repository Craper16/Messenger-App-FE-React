import { Text } from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';
import { useGetUserDataByIdQuery } from '../../redux/api/authApi';
import { useAppSelector } from '../../redux/hooks';
import ErrorMessage from '../ErrorMessage';

type props = {
  memberId: string;
  kickMember: () => void;
};

export default function ServerMembers({ memberId, kickMember }: props) {
  const { userId } = useAppSelector((state) => state.auth);

  const { data, isError, error } = useGetUserDataByIdQuery(memberId);

  const isUserTheLoggedInUser = userId === data?.userId;

  if (isError) {
    return (
      <ErrorMessage
        message={(error as { message: string; status: number }).message}
      />
    );
  }

  return (
    <div className="ml-44 justify-center">
      <span className="grid grid-cols-4 mt-4">
        <Text className="text-purple-900 font-semibold">
          {isUserTheLoggedInUser
            ? data?.displayName + '(You)'
            : data?.displayName}
        </Text>
        <Text className="text-purple-900 font-semibold">{data?.email}</Text>
        <Text className="text-purple-900 font-semibold">
          {data?.phoneNumber}
        </Text>
        {isUserTheLoggedInUser ? null : (
          <MdClose
            onClick={kickMember}
            className="text-purple-900 cursor-pointer hover:scale-110"
          />
        )}
      </span>
    </div>
  );
}
