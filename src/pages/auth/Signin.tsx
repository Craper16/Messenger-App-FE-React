import { Formik, Form } from 'formik';

import {
  Input,
  Button,
  FormErrorMessage,
  FormControl,
  Text,
  FormLabel,
} from '@chakra-ui/react';

import { useSignInUserMutation } from '../../redux/api/authApi';
import { signinValidations } from '../../validations/auth/authValidations';
import { useAppDispatch } from '../../redux/hooks';
import { setUser } from '../../redux/auth/authSlice';
import { Link } from 'react-router-dom';
import { storeAuthDataOnSuccessfulAuthUseEffect } from '../../utils/storeAuthData';

export default function Signin() {
  const dispatch = useAppDispatch();

  const [signInUser, { data, isLoading, isSuccess, error, isError }] =
    useSignInUserMutation();

  storeAuthDataOnSuccessfulAuthUseEffect({
    data,
    dispatch,
    isSuccess,
    setUser,
  });

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validateOnMount={true}
      validationSchema={signinValidations}
      onSubmit={(values) => signInUser({ ...values })}
    >
      {({
        handleBlur,
        handleChange,
        handleSubmit,
        errors,
        values,
        isValid,
        touched,
      }) => (
        <Form className='flex flex-col mr-auto ml-auto mt-36 w-96'>
          <Text className='font-bold text-center text-2xl'>Sign In</Text>
          <FormControl isInvalid={!!errors.email && touched.email}>
            <FormLabel>Email</FormLabel>
            <Input
              id='email'
              type='text'
              placeholder='Email'
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              textColor='#1f1f1f'
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.password && touched.password}>
            <FormLabel>Password</FormLabel>
            <Input
              id='password'
              type='password'
              placeholder='Password'
              value={values.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              textColor='#1f1f1f'
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          <Button
            variant='outline'
            isLoading={isLoading}
            disabled={isLoading || !isValid}
            onClick={() => handleSubmit()}
          >
            Sign In
          </Button>
          {isError && (
            <Text>
              {(error as { message: string; status: number })?.message}
            </Text>
          )}
          <Link to='/signup' className='text-red-800'>
            New to Saad Messenger? Sign Up now!
          </Link>
        </Form>
      )}
    </Formik>
  );
}
