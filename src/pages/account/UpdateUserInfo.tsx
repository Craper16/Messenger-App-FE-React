import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROFILE } from '../../consts/routeNames';
import { useUpdateUserInfoMutation } from '../../redux/api/authApi';
import { setUserInfo } from '../../redux/auth/authSlice';
import { useAppDispatch } from '../../redux/hooks';
import { updateUserInfoValidations } from '../../validations/auth/authValidations';

export default function UpdateUserInfo() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [updateUserInfo, { isError, isLoading, isSuccess, data, error }] =
    useUpdateUserInfoMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUserInfo({ ...data! }));
      navigate(PROFILE);
    }
  }, [isSuccess, dispatch]);

  return (
    <Formik
      validateOnMount={true}
      initialValues={{ displayName: '', phoneNumber: '' }}
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
        <Form>
          <FormControl isInvalid={!!errors.displayName && touched.displayName}>
            <FormLabel>Display Name</FormLabel>
            <Input
              type='text'
              value={values.displayName}
              onChange={handleChange('displayName')}
              onBlur={handleBlur('displayName')}
            />
            <FormErrorMessage>{errors.displayName}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.phoneNumber && touched.phoneNumber}>
            <FormLabel>Phone Number</FormLabel>
            <Input
              type='number'
              value={values.phoneNumber}
              onChange={handleChange('phoneNumber')}
              onBlur={handleBlur('phoneNumber')}
            />
            <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
          </FormControl>
          <Button
            isLoading={isLoading}
            disabled={isLoading || !isValid}
            onClick={() => handleSubmit()}
          >
            Confirm
          </Button>
          {isError && (
            <Text color={'black'}>
              {(error as { message: string; status: string })?.message}
            </Text>
          )}
        </Form>
      )}
    </Formik>
  );
}
