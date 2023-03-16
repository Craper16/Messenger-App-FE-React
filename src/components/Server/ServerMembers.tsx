import { Text } from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';
import { useGetUserDataByIdQuery } from '../../redux/api/authApi';

type props = {
  memberId: string;
};

export default function ServerMembers({ memberId }: props) {
  const { data, isError, isFetching, error } =
    useGetUserDataByIdQuery(memberId);

  return (
    <div className="ml-44 justify-center">
      <span className="grid grid-cols-4 mt-4">
        <Text className="text-purple-900 font-semibold">
          {data?.displayName}
        </Text>
        <Text className="text-purple-900 font-semibold">{data?.email}</Text>
        <Text className="text-purple-900 font-semibold">
          {data?.phoneNumber}
        </Text>
        <MdClose className="text-purple-900 cursor-pointer hover:scale-110" />
      </span>
    </div>
  );
}
