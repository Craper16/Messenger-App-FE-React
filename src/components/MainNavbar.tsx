import React from 'react';
import { Box, Flex, HStack, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router';
import { ACCESS_TOKEN } from '../consts/constants';
import { ArrowBackIcon } from '@chakra-ui/icons';

type MainNavbarProps = {
  handleLogout: () => void;
};

export default function MainNavbar({ handleLogout }: MainNavbarProps) {
  const navigate = useNavigate();

  const access_token = localStorage.getItem(ACCESS_TOKEN);

  return (
    <Box className="p-4 bg-neutral-900">
      <Flex className="justify-between self-center h-16">
        <HStack className="self-center mr-8 cursor-pointer">
          <Box
            className="font-bold text-4xl text-stone-300"
            onClick={() => navigate('/')}
          >
            Articles
          </Box>
        </HStack>
        <Flex className="self-center">
          {access_token ? (
            <Button
              variant={'solid'}
              colorScheme={'blackAlpha'}
              size={'sm'}
              mr={4}
              leftIcon={<ArrowBackIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : null}
        </Flex>
      </Flex>
    </Box>
  );
}
