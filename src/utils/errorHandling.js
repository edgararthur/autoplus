/**
 * Centralized error handling utilities
 */

/**
 * Log an error to the appropriate service
 * In development, log to console
 * In production, would send to error monitoring service
 * 
 * @param {Error|string} error - The error object or message
 * @param {object} context - Additional context about the error
 */
export const logError = (error, context = {}) => {
  if (process.env.NODE_ENV === 'production') {
    // In production, would send to error monitoring service like Sentry
    // Example: Sentry.captureException(error, { extra: context });
    
    // For now, suppress console errors in production
  } else {
    // In development, log to console with context
    console.error('Error occurred:', error, context);
  }
};

/**
 * Format an API error response for display to users
 * 
 * @param {Error} error - The error from an API call
 * @returns {string} - User-friendly error message
 */
export const formatApiError = (error) => {
  // Log the full error for debugging
  logError(error);
  
  // Return user-friendly message
  if (error?.response?.data?.message) {
    // If API returned a specific error message
    return error.response.data.message;
  } else if (error?.message) {
    // If JavaScript error with message
    return error.message;
  } else {
    // Generic fallback message
    return 'An unexpected error occurred. Please try again later.';
  }
};

/**
 * Handle form validation error
 * 
 * @param {object} errors - Object containing validation errors
 * @param {function} setErrors - Function to update form errors state
 * @param {string} [fieldId] - ID of the field to focus (optional)
 */
export const handleValidationError = (errors, setErrors, fieldId = null) => {
  setErrors(errors);
  
  // Focus the first error field if provided
  if (fieldId) {
    const errorField = document.getElementById(fieldId);
    if (errorField) {
      errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      errorField.focus();
    }
  }
};

/**
 * Create a standardized error handler for forms
 * 
 * @param {function} setError - Function to set error message
 * @param {function} setIsLoading - Function to set loading state
 * @returns {function} - Error handler function
 */
export const createFormErrorHandler = (setError, setIsLoading) => {
  return (error) => {
    setError(formatApiError(error));
    setIsLoading(false);
    
    // Scroll to error message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}; 