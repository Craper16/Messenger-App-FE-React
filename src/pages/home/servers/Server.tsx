import { Input } from '@chakra-ui/react';
import React from 'react';
import { useParams } from 'react-router';
import { useFetchServerDataQuery } from '../../../redux/api/serverApi';

export default function Server() {
  const { serverId } = useParams<{ serverId: string }>();

  const { isError, isFetching, error, data } = useFetchServerDataQuery({
    serverId: serverId!,
  });

  console.log(data);

  return (
    <div className="h-96">
      <Input className="h-4/5 overflow-y-auto overflow-x-hidden" />
    </div>
  );
}
