import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import { useUpdateUserInfoMutation } from '../../redux/api/authApi';
import { setUserInfo } from '../../redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { storeAuthDataOnUserInfoChange } from '../../utils/storeAuthDataOnUserInfoChange';
import { updateUserInfoValidations } from '../../validations/auth/authValidations';

export default function UpdateUserInfo() {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { displayName, phoneNumber } = useAppSelector((state) => state.auth);

  const [updateUserInfo, { isError, isLoading, isSuccess, data, error }] =
    useUpdateUserInfoMutation();

  storeAuthDataOnUserInfoChange({
    data,
    dispatch,
    isSuccess,
    navigate,
    setUserInfo,
    toast,
  });

  return (
    <Formik
      validateOnMount={true}
      initialValues={{
        displayName: displayName || '',
        phoneNumber: phoneNumber || '',
      }}
      onSubmit={(values) =>
        updateUserInfo({
          displayName: values.displayName,
          phoneNumber: +values.phoneNumber,
        })
      }
      validationSchema={updateUserInfoValidations}
    >
      {({
        handleBlur,
        handleChange,
        handleSubmit,
        errors,
        isValid,
        values,
        touched,
      }) => (
        <Form className="flex flex-col mr-auto ml-auto mt-36 w-96">
          <FormControl isInvalid={!!errors.displayName && touched.displayName}>
            <FormLabel className="text-purple-900">Display Name</FormLabel>
            <Input
              type="text"
              value={values.displayName}
              onChange={handleChange('displayName')}
              onBlur={handleBlur('displayName')}
            />
            <FormErrorMessage>{errors.displayName}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.phoneNumber && touched.phoneNumber}>
            <FormLabel className="text-purple-900">Phone Number</FormLabel>
            <Input
              type="number"
              value={values.phoneNumber}
              onChange={handleChange('phoneNumber')}
              onBlur={handleBlur('phoneNumber')}
            />
            <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
          </FormControl>
          <Button
            className="mt-5"
            colorScheme="purple"
            isLoading={isLoading}
            disabled={isLoading || !isValid}
            onClick={() => handleSubmit()}
          >
            Confirm
          </Button>
          {isError && (
            <ErrorMessage
              message={(error as { message: string; status: string }).message}
            />
          )}
        </Form>
      )}
    </Formik>
  );
}
