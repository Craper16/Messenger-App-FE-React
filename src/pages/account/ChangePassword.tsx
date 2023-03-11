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
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import { useChangeUserPasswordMutation } from '../../redux/api/authApi';
import { setUserInfo } from '../../redux/auth/authSlice';
import { useAppDispatch } from '../../redux/hooks';
import { storeAuthDataOnUserInfoChange } from '../../utils/storeAuthDataOnUserInfoChange';
import { changePasswordValidations } from '../../validations/auth/authValidations';

export default function ChangePassword() {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [changeUserPassword, { data, isSuccess, isError, error, isLoading }] =
    useChangeUserPasswordMutation();

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
      initialValues={{ oldPassword: '', newPassword: '' }}
      validateOnMount={true}
      validationSchema={changePasswordValidations}
      onSubmit={(values) => changeUserPassword({ ...values })}
    >
      {({
        handleChange,
        handleSubmit,
        handleBlur,
        values,
        errors,
        isValid,
        touched,
      }) => (
        <Form>
          <FormControl isInvalid={!!errors.oldPassword && touched.oldPassword}>
            <FormLabel>Old Password</FormLabel>
            <Input
              type="password"
              value={values.oldPassword}
              onChange={handleChange('oldPassword')}
              onBlur={handleBlur('oldPassword')}
            />
            <FormErrorMessage>{errors.oldPassword}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.newPassword && touched.newPassword}>
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              value={values.newPassword}
              onChange={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
            />
            <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
          </FormControl>
          <Button
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
