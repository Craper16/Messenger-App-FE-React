import { Button, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router';
import { HOME } from '../consts/routeNames';

export default function Error() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center align-middle m-auto mt-9">
      <div className="flex flex-col align-middle">
        <Image
          className="text-center mx-auto"
          boxSize="400px"
          src="https://img.freepik.com/free-vector/404-error-with-portals-concept-illustration_114360-7880.jpg?w=826&t=st=1678493450~exp=1678494050~hmac=d1d8960a8e9adb41cf44b59346019c685a0480395796bb4566f4daa69597055a"
        />
        <Text className="font-bold text-5xl text-center text-purple-900">
          Error 404
        </Text>
        <Text className="flex flex-col uppercase text-7xl mt-9 text-purple-900">
          Opps this is awkward...
        </Text>
        <Button
          variant="unstyled"
          color="purple.900"
          fontWeight="bold"
          fontSize="5xl"
          marginTop="16"
          onClick={() => navigate(HOME)}
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
