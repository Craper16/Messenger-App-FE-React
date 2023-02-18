import { Formik, Form } from 'formik';
import React, { useEffect } from 'react';

import {
  Input,
  Button,
  FormErrorMessage,
  FormControl,
  Text,
  FormLabel,
  Card,
} from '@chakra-ui/react';

import { useSignInUserMutation } from '../../redux/api/authApi';
import { signinValidations } from '../../validations/auth/authValidations';
import { useAppDispatch } from '../../redux/hooks';
import { setUser } from '../../redux/auth/authSlice';

export default function Signin() {
  const dispatch = useAppDispatch();

  const [signInUser, { data, isLoading, isSuccess, error, isError }] =
    useSignInUserMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUser({ ...data! }));
    }
  }, [isSuccess, dispatch]);

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
        <Form className="align-bottom justify-end mr-auto w-96 h-80">
          <Card>
            <FormControl isInvalid={!!errors.email && touched.email}>
              <FormLabel>Email</FormLabel>
              <Input
                id="email"
                type="text"
                placeholder="jhon@doe.com"
                value={values.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password && touched.password}>
              <FormLabel>Password</FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="password example"
                value={values.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            <Button
              variant="outline"
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
            <Button
              variant="link"
              color="red"
            >
              New to Saad Messenger? Sign Up now!
            </Button>
          </Card>
        </Form>
      )}
    </Formik>
  );
}
