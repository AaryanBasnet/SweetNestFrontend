/**
 * Review Validation Schema
 * Yup schema for review form validation
 */

import * as Yup from 'yup';

export const reviewSchema = Yup.object().shape({
  rating: Yup.number()
    .required('Rating is required')
    .min(1, 'Minimum rating is 1 star')
    .max(5, 'Maximum rating is 5 stars')
    .integer('Rating must be a whole number'),

  comment: Yup.string()
    .required('Review comment is required')
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review cannot exceed 1000 characters')
    .trim()
});
