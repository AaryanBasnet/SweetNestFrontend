/**
 * ReviewForm Component
 * Form for creating/editing reviews
 * Uses Formik + Yup following codebase pattern
 */

import { useFormik } from 'formik';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { reviewSchema } from '../../schemas/reviewSchema';

export default function ReviewForm({
  existingReview,
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const [hoverRating, setHoverRating] = useState(0);

  const formik = useFormik({
    initialValues: {
      rating: existingReview?.rating || 0,
      comment: existingReview?.comment || '',
    },
    validationSchema: reviewSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onSubmit(values);
      } catch (error) {
        // Error handled by parent component
      } finally {
        setSubmitting(false);
      }
    },
  });

  const characterCount = formik.values.comment.length;
  const maxChars = 1000;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      {/* Star Rating Input */}
      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => formik.setFieldValue('rating', star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent/20 rounded"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                size={32}
                className={
                  star <= (hoverRating || formik.values.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-dark/20'
                }
              />
            </button>
          ))}
        </div>
        {formik.touched.rating && formik.errors.rating && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.rating}</p>
        )}
      </div>

      {/* Comment Textarea */}
      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          name="comment"
          value={formik.values.comment}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Share your experience with this cake..."
          rows={5}
          maxLength={maxChars}
          className={`w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none ${
            formik.touched.comment && formik.errors.comment
              ? 'border-red-500 focus:ring-red-500/20'
              : 'border-dark/10'
          }`}
        />
        <div className="flex justify-between items-center mt-1">
          <div>
            {formik.touched.comment && formik.errors.comment && (
              <p className="text-red-500 text-xs">{formik.errors.comment}</p>
            )}
          </div>
          <span
            className={`text-xs ${
              characterCount > maxChars - 50 ? 'text-amber-600' : 'text-dark/40'
            }`}
          >
            {characterCount}/{maxChars}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 border border-dark/10 rounded-lg text-sm font-medium text-dark/70 hover:bg-dark/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !formik.isValid || formik.values.rating === 0}
          className="flex-1 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? existingReview
              ? 'Updating...'
              : 'Submitting...'
            : existingReview
            ? 'Update Review'
            : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}
