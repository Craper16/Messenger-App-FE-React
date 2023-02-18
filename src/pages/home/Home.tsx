import React from 'react';
import { useAppSelector } from '../../redux/hooks';

export default function Home() {
  const { displayName } = useAppSelector((state) => state.auth);

  return <div>{displayName}</div>;
}
