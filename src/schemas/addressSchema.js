/**
 * Address Validation Schema
 * Yup schema for address form validation
 */

import * as Yup from 'yup';

export const addressSchema = Yup.object().shape({
  label: Yup.string()
    .oneOf(['Home', 'Office', 'Other', 'Custom'], 'Invalid label type')
    .required('Address label is required'),
  customLabel: Yup.string()
    .max(30, 'Custom label must be at most 30 characters')
    .when('label', {
      is: 'Custom',
      then: (schema) =>
        schema.required('Custom label is required when type is Custom'),
      otherwise: (schema) => schema.notRequired(),
    }),
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters')
    .required('Last name is required'),
  address: Yup.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be at most 200 characters')
    .required('Address is required'),
  apartment: Yup.string()
    .max(50, 'Apartment must be at most 50 characters')
    .notRequired(),
  city: Yup.string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be at most 100 characters')
    .required('City is required'),
  postalCode: Yup.string()
    .max(20, 'Postal code must be at most 20 characters')
    .notRequired(),
  phone: Yup.string()
    .min(10, 'Phone must be at least 10 digits')
    .max(20, 'Phone must be at most 20 characters')
    .required('Phone is required'),
});
