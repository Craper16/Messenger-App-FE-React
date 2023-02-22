import React from 'react';
import { useAppSelector } from '../../redux/hooks';
import { openWebSocketOnMount } from '../../utils/openWebSocketOnMount';

export default function Home() {
  const { displayName } = useAppSelector((state) => state.auth);

  openWebSocketOnMount();

  return (
    <div>
      <div>{displayName}</div>
    </div>
  );
}
