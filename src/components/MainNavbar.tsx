import { ReactNode } from 'react';
import {
  Box,
  Flex,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { ACCESS_TOKEN } from '../consts/constants';
import { HamburgerIcon } from '@chakra-ui/icons';
import {
  BROWSE_SERVERS,
  CREATE_SERVER,
  HOME,
  PROFILE,
  SEARCH_SERVERS,
} from '../consts/routeNames';

type MainNavbarProps = {
  handleLogout: () => void;
};

const Links: { name: string; path: string }[] = [
  { name: 'Profile', path: PROFILE },
  { name: 'Search Servers', path: SEARCH_SERVERS },
  { name: 'Browse Servers', path: BROWSE_SERVERS },
  { name: 'Create Server', path: CREATE_SERVER },
];

export default function MainNavbar({ handleLogout }: MainNavbarProps) {
  const navigate = useNavigate();
  const access_token = localStorage.getItem(ACCESS_TOKEN);

  return (
    <Box className="p-4 bg-purple-900">
      <Flex className="justify-between self-center h-16">
        <HStack className="self-center mr-8 cursor-pointer">
          <Box
            className="font-bold text-4xl text-stone-300"
            onClick={() => navigate(HOME)}
          >
            Saad Messenger
          </Box>
        </HStack>
        {access_token ? (
          <Menu>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
            >
              <HamburgerIcon color="ButtonFace" />
            </MenuButton>
            <MenuList>
              {Links.map((link) => (
                <MenuItem
                  key={link.name}
                  onClick={() => navigate(link.path)}
                >
                  {link.name}
                </MenuItem>
              ))}
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        ) : null}
      </Flex>
    </Box>
  );
}
