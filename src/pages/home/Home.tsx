import { forwardRef, Tag } from '@chakra-ui/react';
import {
  Box,
  Button,
  SimpleGrid,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
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
import ServerCreateOrDeleteModal from '../../components/Server/ServerCreateOrDeleteModal';
import LoadingIndicator from '../../components/LoadingIndicator';
import { MoreInfoTooltip } from '../../components/MoreInfo';

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
    error: createServerMutationResponse.error,
    isError: createServerMutationResponse.isError,
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
          <ServerCreateOrDeleteModal
            errors={errors}
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleReset={handleReset}
            isOpen={isOpen}
            isValid={isValid}
            name={values.name}
            onClose={onClose}
            touched={touched}
            mutationIsLoading={createServerMutationResponse.isLoading}
            headerText="Create Server"
            bodyText="Enter your server name"
          />
        )}
      </Formik>
      <div className="flex justify-center">
        <Text className="text-purple-900 font-bold text-2xl">Your Servers</Text>
        <MoreInfoTooltip
          toolTipHasArrow={true}
          toolTipLabel="Create Server"
        >
          <MdAdd
            className="cursor-pointer mt-1.5 text-2xl text-purple-900 hover:scale-110 duration-300"
            onClick={onOpen}
          />
        </MoreInfoTooltip>
      </div>
      {fetchingDataIsSuccessfulButNoServersFound && (
        <div className="flex justify-center align-middle m-auto mt-4">
          <Text className="text-2xl">
            You dont have any servers joined,
            <span
              className="cursor-pointer text-purple-800 hover:text-gray-500"
              onClick={() => navigate(BROWSE_SERVERS)}
            >
              {` join`}
            </span>
            {` or `}
            <span
              className="text-purple-800 cursor-pointer hover:text-gray-500"
              onClick={onOpen}
            >
              create
            </span>{' '}
            a server to start the fun
          </Text>
        </div>
      )}
      {isFetching ? (
        <LoadingIndicator />
      ) : (
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
      )}
    </>
  );
}
