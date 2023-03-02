import React from 'react';
import { useParams } from 'react-router';
import { useFetchServerDataQuery } from '../../../redux/api/serverApi';

export default function Server() {
  const { serverId } = useParams<{ serverId: string }>();

  const { isError, isFetching, error, data } = useFetchServerDataQuery({
    serverId: serverId!,
  });

  return <div>{serverId}</div>;
}
