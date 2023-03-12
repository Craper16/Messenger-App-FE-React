import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  SimpleGrid,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  Divider,
  MenuList,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
} from '@chakra-ui/react';
import { ServerData } from '../../redux/server/serverSlice';
import { MdList } from 'react-icons/md';
import { SERVER_NAV } from '../../consts/routeNames';
import { NavigateFunction } from 'react-router';
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  MutationDefinition,
} from '@reduxjs/toolkit/dist/query';
import { modalClearInputOnClose } from '../../utils/modalClearInputOnClose';
import { SerializedError } from '@reduxjs/toolkit';
import ErrorMessage from '../ErrorMessage';
import { leaveServerIsErrorEffect } from '../../utils/leaveServerIsErrorEffect';

type props = {
  server: ServerData;
  userId: string;
  navigate: NavigateFunction;
  leaveServerMutation: MutationTrigger<
    MutationDefinition<
      string,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      {
        message: string;
        server: ServerData;
      },
      'serverApi'
    >
  >;
  deleteServerMutation: MutationTrigger<
    MutationDefinition<
      {
        serverId: string;
        serverName: string;
      },
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, {}>,
      never,
      {
        message: string;
        server: ServerData;
      },
      'serverApi'
    >
  >;
  deleteServerMutationIsLoading: boolean;
  deleteServerMutationIsError: boolean;
  leaveServerMutationIsError: boolean;
  deleteServerMutationError: FetchBaseQueryError | SerializedError | undefined;
  leaveServerMutationError: FetchBaseQueryError | SerializedError | undefined;
  toast: any;
};

export default function ServerRowItem({
  server,
  userId,
  navigate,
  deleteServerMutation,
  leaveServerMutation,
  deleteServerMutationIsLoading,
  deleteServerMutationError,
  leaveServerMutationError,
  deleteServerMutationIsError,
  leaveServerMutationIsError,
  toast,
}: props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isUserOwner = server.owner === userId;

  const [enteredUserServerName, setEnteredUserServerName] = useState('');

  modalClearInputOnClose({ isOpen, setEnteredUserServerName });

  leaveServerIsErrorEffect({
    leaveServerMutationError,
    leaveServerMutationIsError,
    deleteServerMutationError,
    deleteServerMutationIsError,
    toast,
  });

  return (
    <div key={server._id}>
      <List className="mt-12 align-middle text-center">
        <Text className="text-center font-bold text-purple-900 text-lg">
          {server.name}
        </Text>
        <ListItem>
          <SimpleGrid columns={7}>
            <Box>
              <></>
            </Box>
            <Box>
              <Text className="text-purple-900 font-semibold">NAME</Text>
            </Box>
            <Box>
              <Text className="text-purple-900 font-semibold">MEMBERS</Text>
            </Box>
            <Box>
              <Text className="text-purple-900 font-semibold">STATUS</Text>
            </Box>
            <Box>
              <Text className="text-purple-900 font-semibold">SERVER ID</Text>
            </Box>
            <Box>
              <></>
            </Box>
            <Box>
              <Text></Text>
            </Box>
          </SimpleGrid>
        </ListItem>
        <ListItem>
          <SimpleGrid columns={7}>
            <Box>
              <></>
            </Box>
            <Box>
              <Text className="text-purple-900 mt-3">{server.name}</Text>
            </Box>
            <Box>
              <Text className="text-purple-900 mt-3">
                {server.members.length}
              </Text>
            </Box>
            <Box>
              <Text className="text-purple-900 mt-3">
                {server.owner === userId ? 'Owner' : 'Member'}
              </Text>
            </Box>
            <Box>
              <Text className="text-purple-900 mt-3">{server._id}</Text>
            </Box>
            <Box>
              <></>
            </Box>
            <Box>
              <Menu>
                <MenuButton
                  className="m-3 align-middle justify-center text-center"
                  as={Button}
                  rightIcon={<MdList />}
                  colorScheme="purple"
                  variant="link"
                ></MenuButton>
                <MenuList className="border border-gray-400">
                  <MenuItem
                    onClick={
                      isUserOwner
                        ? () => onOpen()
                        : () => leaveServerMutation(server._id)
                    }
                  >
                    {isUserOwner ? 'Delete Server' : 'Leave Server'}
                  </MenuItem>
                  <MenuItem onClick={() => navigate(SERVER_NAV(server._id))}>
                    Go To Server
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </SimpleGrid>
          <Divider />
        </ListItem>
      </List>
      <Modal
        closeOnOverlayClick={true}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px)"
        />
        <ModalContent>
          <ModalHeader className="text-purple-900 font-bold">
            Please enter the server name
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="pb-6">
            <Text className="text-purple-900 font-semibold">{`Enter '${server.name}' to delete your server`}</Text>
            <Input
              value={enteredUserServerName}
              onChange={(e) => setEnteredUserServerName(e.currentTarget.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              className="mr-3"
              colorScheme="purple"
              disabled={!enteredUserServerName}
              isLoading={deleteServerMutationIsLoading}
              onClick={() => {
                if (!enteredUserServerName) return;
                return deleteServerMutation({
                  serverId: server._id,
                  serverName: enteredUserServerName,
                });
              }}
            >
              Confirm
            </Button>
            <Button
              color="purple.900"
              variant="unstyled"
              onClick={onClose}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
