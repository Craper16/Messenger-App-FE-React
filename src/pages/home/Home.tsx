import { useState } from 'react';
import {
  Box,
  Button,
  SimpleGrid,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useToast,
} from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import ServerItem from '../../components/Server/ServerItem';
import { BROWSE_SERVERS } from '../../consts/routeNames';
import {
  useCreateServerMutation,
  useFetchUserServersQuery,
} from '../../redux/api/serverApi';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { joinServer, setUserServers } from '../../redux/server/serverSlice';
import { setUserServersAndJoinServers } from '../../utils/setUserServersAndJoinServers';
import { Formik } from 'formik';
import { createServerValidations } from '../../validations/server/serverValidations';
import { joinAndNavigateToServer } from '../../utils/joinAndNavigateToServer.ts';

export default function Home() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [createServerMutation, createServerMutationResponse] =
    useCreateServerMutation();
  const { data, isFetching, isError, error } = useFetchUserServersQuery(
    undefined,
    {
      refetchOnReconnect: true,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const { userId } = useAppSelector((state) => state.auth);
  const { userServers } = useAppSelector((state) => state.server);
  const socket = useAppSelector((state) => state.socket.socket);

  const fetchingDataIsSuccessfulButNoServersFound =
    !isFetching && !isError && userServers.length === 0;

  setUserServersAndJoinServers({ data, dispatch, setUserServers, socket });

  joinAndNavigateToServer({
    data: {
      message: createServerMutationResponse.data?.message!,
      server: createServerMutationResponse.data?.server!,
    },
    dispatch,
    isSuccess: createServerMutationResponse.isSuccess,
    joinServer,
    navigate,
    socket,
    toast,
  });

  if (isError) {
    return (
      <ErrorMessage
        message={(error as { message: string; status: number }).message}
      />
    );
  }

  return (
    <>
      <Formik
        validateOnMount={true}
        validationSchema={createServerValidations}
        initialValues={{ name: '' }}
        onSubmit={({ name }) => createServerMutation(name)}
      >
        {({
          handleBlur,
          handleChange,
          handleSubmit,
          handleReset,
          isValid,
          errors,
          touched,
          values,
        }) => (
          <Modal
            closeOnOverlayClick={true}
            isOpen={isOpen}
            onClose={() => {
              onClose();
              handleReset();
            }}
          >
            <ModalOverlay
              bg="blackAlpha.300"
              backdropFilter="blur(10px)"
            />
            <ModalContent>
              <ModalHeader className="text-purple-900 font-bold text-center">
                Create Server
              </ModalHeader>
              <ModalBody className="pb-6">
                <Text className="text-purple-900 font-semibold">
                  Server Name
                </Text>
                <Input
                  type="text"
                  placeholder="Server Name"
                  value={values.name}
                  onChange={handleChange('name')}
                  onBlur={handleBlur('name')}
                />
                {touched.name && errors.name && (
                  <Text className="text-s text-red-400">{errors.name}</Text>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  className="mr-3"
                  colorScheme="purple"
                  disabled={!isValid}
                  onClick={() => handleSubmit()}
                >
                  Confirm
                </Button>
                <Button
                  color="purple.900"
                  variant="unstyled"
                  onClick={() => {
                    handleReset();
                    onClose();
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Formik>
      <div className="flex justify-center">
        <Text className="text-purple-900 font-bold text-2xl">Your Servers</Text>
        <MdAdd
          className="cursor-pointer ml-4 mt-1.5 text-2xl text-purple-900 hover:scale-110 duration-300"
          onClick={onOpen}
        />
      </div>
      {fetchingDataIsSuccessfulButNoServersFound && (
        <Box className="justify-center align-middle m-auto">
          <Text>
            You dont have any servers joined, join or create a server to start
            the fun
          </Text>
          <Button onClick={() => navigate(BROWSE_SERVERS)}>
            Browse Servers
          </Button>
          <Button>Create a Server</Button>
        </Box>
      )}
      <SimpleGrid
        columnGap={25}
        columns={4}
      >
        {userServers.map((server) => (
          <ServerItem
            key={server._id}
            navigate={navigate}
            server={server}
            userId={userId!}
          />
        ))}
      </SimpleGrid>
    </>
  );
}
