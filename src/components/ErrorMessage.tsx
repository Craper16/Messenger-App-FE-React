import { Text } from '@chakra-ui/react';

type props = {
  message: string;
  color?: string;
};

export default function ErrorMessage({ message, color }: props) {
  return (
    <div className="flex justify-center align-middle mt-6">
      <Text
        color={color ? color : 'tomato'}
        className="font-semibold"
      >
        {message}
      </Text>
    </div>
  );
}
