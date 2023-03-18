import { useEffect, useState } from 'react';
import { Input, Text, useToast } from '@chakra-ui/react';
import { useParams } from 'react-router';
import ErrorMessage from '../../../components/ErrorMessage';
import LoadingIndicator from '../../../components/LoadingIndicator';
import ServerMembers from '../../../components/Server/ServerMembers';
import {
  useFetchServerDataQuery,
  useKickFromServerMutation,
  useUpdateServerMutation,
} from '../../../redux/api/serverApi';
import { useAppSelector } from '../../../redux/hooks';
import { kickUserFromServerEffect } from '../../../utils/kickUserFromServerEffect';
import { Formik } from 'formik';
import { MdCheck, MdClose, MdCreate } from 'react-icons/md';
import { updateServerValidations } from '../../../validations/server/serverValidations';
import { updateServerInfoEffect } from '../../../utils/updateServerInfoEffect';

export default function ManageServer() {
  const [isInUpdateServerMode, setIsInUpdateServerMode] = useState(false);
  const toast = useToast();
  const { serverId } = useParams<{ serverId: string }>();

  const socket = useAppSelector((state) => state.socket.socket);

  const { data, error, isError, isFetching, refetch } = useFetchServerDataQuery(
    {
      serverId: serverId!,
    }
  );

  const [updateServerInfoMutation, updateServerInfoMutationResponse] =
    useUpdateServerMutation();

  const [kickMember, kickMemberResponse] = useKickFromServerMutation();

  updateServerInfoEffect({
    refetch,
    setIsInUpdateServerMode,
    toast,
    updateErrorData: updateServerInfoMutationResponse.error,
    updateIsError: updateServerInfoMutationResponse.isError,
    updateIsSuccess: updateServerInfoMutationResponse.isSuccess,
  });

  kickUserFromServerEffect({
    kickMemberIsSuccess: kickMemberResponse.isSuccess,
    kickMemberIsError: kickMemberResponse.isError,
    data: kickMemberResponse.data,
    error: kickMemberResponse.error,
    refetch,
    toast,
    socket,
  });

  if (isError) {
    return (
      <ErrorMessage
        message={(error as { message: string; status: number }).message}
      />
    );
  }

  if (isFetching) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      {isInUpdateServerMode ? (
        <Formik
          initialValues={{ newServerName: data?.name }}
          validateOnMount={true}
          validationSchema={updateServerValidations}
          onSubmit={(values) =>
            updateServerInfoMutation({
              newServerName: values.newServerName!,
              serverId: data?._id!,
            })
          }
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            values,
            touched,
            isValid,
          }) => (
            <div className="flex flex-row justify-center m-auto w-52 mt-11 relative">
              <div className="flex flex-col w-auto">
                <Input
                  variant="unstyled"
                  value={values.newServerName}
                  onChange={handleChange('newServerName')}
                  onBlur={handleBlur('newServerName')}
                  disabled={updateServerInfoMutationResponse.isLoading}
                />
                {errors.newServerName && touched.newServerName && (
                  <Text className="text-red-400 font-extralight absolute mt-9">
                    {errors.newServerName}
                  </Text>
                )}
              </div>
              <div>
                <MdCheck
                  onClick={() => {
                    if (!isValid || updateServerInfoMutationResponse.isLoading)
                      return;
                    handleSubmit();
                  }}
                  className="text-xl text-purple-900 cursor-pointer hover:scale-110"
                />
                <MdClose
                  onClick={() => setIsInUpdateServerMode(false)}
                  className="text-xl text-purple-900 cursor-pointer hover:scale-110"
                />
              </div>
            </div>
          )}
        </Formik>
      ) : (
        <div className="flex flex-row justify-center mt-11">
          <Text className="text-center font-bold text-purple-900 text-3xl">
            {data?.name}
          </Text>
          <MdCreate
            onClick={() => setIsInUpdateServerMode(true)}
            className="text-xl mt-2 text-purple-900 cursor-pointer hover:scale-110"
          />
        </div>
      )}
      <Text className="text-center font-bold text-purple-900 text-3xl mt-16">
        Members
      </Text>
      <div className="ml-44 justify-center">
        <span className="grid grid-cols-4 mt-4">
          <Text className="text-purple-900 font-bold text-2xl">Name</Text>
          <Text className="text-purple-900 font-bold text-2xl">Email</Text>
          <Text className="text-purple-900 font-bold text-2xl">
            Phone Number
          </Text>
          <Text className="text-purple-900 font-bold text-2xl">Kick</Text>
        </span>
      </div>
      {data?.members.map((member) => (
        <ServerMembers
          key={member}
          memberId={member}
          kickMember={() =>
            kickMember({ serverId: data?._id, kickedUserId: member })
          }
        />
      ))}
      <Text className="text-center mt-5 font-bold text-purple-900 text-3xl">
        {'Total Messages: ' + data?.messages.length}
      </Text>
    </div>
  );
}
