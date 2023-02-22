import React, { ReactNode } from 'react';
import { Box, Flex, HStack, Button, Stack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { ACCESS_TOKEN } from '../consts/constants';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { PROFILE } from '../consts/routeNames';

type MainNavbarProps = {
  handleLogout: () => void;
};

const Links = [{ name: 'Profile', path: PROFILE }];

const NavLink = ({
  children,
  navigateTo,
}: {
  children: ReactNode;
  navigateTo: string;
}) => (
  <Link
    to={navigateTo}
    className="py-2 px-1 text-stone-300 hover:text-gray-400"
  >
    {children}
  </Link>
);

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
            Saad Messenger
          </Box>
        </HStack>
        {access_token ? (
          <>
            <Box className="pb-4">
              <Stack
                as={'nav'}
                spacing={4}
              >
                {Links.map((link) => (
                  <NavLink
                    navigateTo={link.path}
                    key={link.name}
                  >
                    {link.name}
                  </NavLink>
                ))}
              </Stack>
            </Box>
            <Flex className="self-center">
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
            </Flex>
          </>
        ) : null}
      </Flex>
    </Box>
  );
}
