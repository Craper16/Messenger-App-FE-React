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
import { SerializedError } from '@reduxjs/toolkit';
import { leaveServerIsErrorEffect } from '../../utils/leaveServerIsErrorEffect';
import { Formik } from 'formik';
import ServerCreateOrDeleteModal from './ServerCreateOrDeleteModal';
import { deleteServerValidations } from '../../validations/server/serverValidations';

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
                  className="m-3 align-middle justify-center"
                  as={Button}
                  rightIcon={<MdList />}
                  colorScheme="purple"
                  variant="link"
                ></MenuButton>
                <MenuList className="border border-purple-700">
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
      <Formik
        initialValues={{ name: '' }}
        validateOnMount={true}
        onSubmit={(values) =>
          deleteServerMutation({
            serverId: server._id,
            serverName: values.name,
          })
        }
        validationSchema={deleteServerValidations}
      >
        {({
          handleBlur,
          handleChange,
          handleReset,
          handleSubmit,
          values,
          isValid,
          touched,
          errors,
        }) => (
          <ServerCreateOrDeleteModal
            errors={errors}
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleReset={handleReset}
            handleSubmit={handleSubmit}
            isValid={isValid}
            isOpen={isOpen}
            name={values.name}
            onClose={onClose}
            touched={touched}
            mutationIsLoading={deleteServerMutationIsLoading}
            headerText="Delete Server"
            bodyText={`Enter '${server.name}' to delete your server`}
          />
        )}
      </Formik>
    </div>
  );
}
