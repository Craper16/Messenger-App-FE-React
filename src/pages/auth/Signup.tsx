import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import { useSignUpUserMutation } from '../../redux/api/authApi';
import { setUser } from '../../redux/auth/authSlice';
import { useAppDispatch } from '../../redux/hooks';
import { storeAuthDataOnSuccessfulAuthUseEffect } from '../../utils/storeAuthData';
import { signUpValidations } from '../../validations/auth/authValidations';

interface signUpInitialValuesModel {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  phoneNumber: number | string;
}

const SignUpInitialValues: signUpInitialValuesModel = {
  confirmPassword: '',
  displayName: '',
  email: '',
  password: '',
  phoneNumber: '',
};

export default function Signup() {
  const dispatch = useAppDispatch();

  const [signUpUser, { data, isError, error, isLoading, isSuccess }] =
    useSignUpUserMutation();

  storeAuthDataOnSuccessfulAuthUseEffect({
    data,
    dispatch,
    isSuccess,
    setUser,
  });

  return (
    <Formik
      initialValues={SignUpInitialValues}
      validateOnMount={true}
      validationSchema={signUpValidations}
      onSubmit={(values) =>
        signUpUser({
          email: values.email,
          displayName: values.displayName,
          password: values.password,
          phoneNumber: +values.phoneNumber,
        })
      }
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
          <Text className='font-bold text-center text-2xl'>Sign Up</Text>
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
          <FormControl
            isInvalid={!!errors.confirmPassword && touched.confirmPassword}
          >
            <FormLabel>Confirm Password</FormLabel>
            <Input
              id='confirmPassword'
              type='password'
              placeholder='Confirm Password'
              value={values.confirmPassword}
              onChange={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              textColor='#1f1f1f'
            />
            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.displayName && touched.displayName}>
            <FormLabel>Display Name</FormLabel>
            <Input
              id='displayName'
              type='text'
              placeholder='displayName'
              value={values.displayName}
              onChange={handleChange('displayName')}
              onBlur={handleBlur('displayName')}
              textColor='#1f1f1f'
            />
            <FormErrorMessage>{errors.displayName}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.phoneNumber && touched.phoneNumber}>
            <FormLabel>phoneNumber</FormLabel>
            <Input
              id='phoneNumber'
              type='number'
              placeholder='phoneNumber'
              value={values.phoneNumber}
              onChange={handleChange('phoneNumber')}
              onBlur={handleBlur('phoneNumber')}
              textColor='#1f1f1f'
            />
            <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
          </FormControl>
          <Button
            variant='outline'
            isLoading={isLoading}
            disabled={!isValid}
            onClick={() => handleSubmit()}
          >
            Sign Up
          </Button>
          {isError && (
            <Text>
              {(error as { message: string; status: number })?.message}
            </Text>
          )}
          <Link to='/signin' className='text-red-800'>
            Already have an account? Sign in
          </Link>
        </Form>
      )}
    </Formik>
  );
}
