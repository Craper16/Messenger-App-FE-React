import * as yup from 'yup';

export const signinValidations = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email must not be empty'),
  password: yup.string().required('Password must not be empty'),
});

export const signUpValidations = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email must not be empty'),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
      'Password must contain 8 or more characters, with 1 upper case, 1 lower case and a special character'
    )
    .required('Password must not be emtpy'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
  displayName: yup
    .string()
    .required('Display name must not be empty')
    .min(3, 'Display name must be between 3 and 13 characters long')
    .max(13, 'Display name must be between 3 and 13 characters long'),
  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .max(8, 'Phone number must be 8 numbers'),
});

export const changePasswordValidations = yup.object().shape({
  oldPassword: yup.string().required('Please enter your old password'),
  newPassword: yup
    .string()
    .required('Please enter your new password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/,
      'New password must contain 8 or more characters, with 1 upper case, 1 lower case and a special character'
    ),
});
