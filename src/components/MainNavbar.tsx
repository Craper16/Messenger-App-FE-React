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
import { useNavigate } from 'react-router';
import { ACCESS_TOKEN } from '../consts/constants';
import {
  BROWSE_SERVERS,
  CREATE_SERVER,
  HOME,
  PROFILE,
  SEARCH_SERVERS,
} from '../consts/routeNames';
import {
  MdAccountCircle,
  MdCreate,
  MdLogout,
  MdOpenInBrowser,
  MdSearch,
} from 'react-icons/md';
import { GiHamburgerMenu } from 'react-icons/gi';

type MainNavbarProps = {
  handleLogout: () => void;
};

const Links: {
  name: string;
  path: string;
  icon:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | undefined;
}[] = [
  {
    name: 'Profile',
    path: PROFILE,
    icon: <MdAccountCircle className="text-purple-900 text-lg" />,
  },
  {
    name: 'Search Servers',
    path: SEARCH_SERVERS,
    icon: <MdSearch className="text-purple-900 text-lg" />,
  },
  {
    name: 'Browse Servers',
    path: BROWSE_SERVERS,
    icon: <MdOpenInBrowser className="text-purple-900 text-lg" />,
  },
  {
    name: 'Create Server',
    path: CREATE_SERVER,
    icon: <MdCreate className="text-purple-900 text-lg" />,
  },
];

export default function MainNavbar({ handleLogout }: MainNavbarProps) {
  const navigate = useNavigate();
  const access_token = localStorage.getItem(ACCESS_TOKEN);

  return (
    <Box className="p-4 bg-purple-900">
      <Flex className="justify-between self-center h-16">
        <HStack className="self-center mr-8 cursor-pointer">
          <Box
            className="font-bold text-4xl text-white"
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
              <GiHamburgerMenu className="text-lg text-white" />
            </MenuButton>
            <MenuList>
              {Links.map((link) => (
                <MenuItem
                  key={link.name}
                  onClick={() => navigate(link.path)}
                  icon={link.icon}
                >
                  {link.name}
                </MenuItem>
              ))}
              <MenuDivider />
              <MenuItem
                onClick={handleLogout}
                icon={<MdLogout className="text-purple-900 text-lg" />}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        ) : null}
      </Flex>
    </Box>
  );
}
