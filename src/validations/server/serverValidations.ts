import * as yup from 'yup';

export const createServerValidations = yup.object().shape({
  name: yup
    .string()
    .required('Server name must not be empty')
    .min(4, 'Server name must be between 4 and 20 chracters')
    .max(20, 'Server name must be between 4 and 20 chracters'),
});

export const deleteServerValidations = yup.object().shape({
  name: yup.string().required('Server name must not be empty'),
});
