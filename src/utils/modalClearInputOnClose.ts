import { useEffect, Dispatch, SetStateAction } from 'react';

export const modalClearInputOnClose = ({
  isOpen,
  setEnteredUserServerName,
}: {
  isOpen: boolean;
  setEnteredUserServerName: Dispatch<SetStateAction<string>>;
}) =>
  useEffect(() => {
    if (!isOpen) {
      setEnteredUserServerName('');
    }
  }, [isOpen]);
