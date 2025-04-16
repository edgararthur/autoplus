/**
 * Common validation functions for use throughout the application
 */

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates that a password meets minimum requirements
 * @param {string} password - The password to validate
 * @returns {object} - Object with isValid boolean and message string
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Checks if two passwords match
 * @param {string} password - The password
 * @param {string} confirmPassword - The confirmation password
 * @returns {boolean} - Whether the passwords match
 */
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validates a required field is not empty
 * @param {string} value - The field value
 * @param {string} fieldName - The field name
 * @returns {object} - Object with isValid boolean and message string
 */
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { 
      isValid: false, 
      message: `${fieldName} is required` 
    };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Validates a number field
 * @param {string|number} value - The value to validate
 * @param {object} options - Validation options
 * @param {number} [options.min] - Minimum value
 * @param {number} [options.max] - Maximum value
 * @param {string} fieldName - The field name
 * @returns {object} - Object with isValid boolean and message string
 */
export const validateNumber = (value, options = {}, fieldName) => {
  const { min, max } = options;
  const numValue = Number(value);
  
  if (isNaN(numValue)) {
    return { 
      isValid: false, 
      message: `${fieldName} must be a valid number` 
    };
  }
  
  if (min !== undefined && numValue < min) {
    return { 
      isValid: false, 
      message: `${fieldName} must be at least ${min}` 
    };
  }
  
  if (max !== undefined && numValue > max) {
    return { 
      isValid: false, 
      message: `${fieldName} must be no more than ${max}` 
    };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Performs multiple validations and returns the first error found
 * @param {Array} validations - Array of validation result objects
 * @returns {object} - Object with isValid boolean and message string
 */
export const validateAll = (validations) => {
  for (const validation of validations) {
    if (!validation.isValid) {
      return validation;
    }
  }
  
  return { isValid: true, message: '' };
}; 