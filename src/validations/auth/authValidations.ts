import * as yup from 'yup';

export const signinValidations = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email must not be empty'),
  password: yup.string().required('Password must not be empty'),
});
