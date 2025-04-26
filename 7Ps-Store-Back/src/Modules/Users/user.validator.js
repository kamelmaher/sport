const Joi = require('joi');


// Login schema
const loginSchema = Joi.object({
  userName: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.empty': 'User name cannot be empty',
      'string.min': 'User name must be at least 3 characters',
      'string.max': 'User name cannot exceed 30 characters',
      'any.required': 'User name is required'
    }),

  // Prevent role assignment during login
  role: Joi.forbidden().messages({
    'any.unknown': 'Role cannot be set during login'
  }),
  // Prevent status assignment during login
  status: Joi.forbidden().messages({
    'any.unknown': 'Status cannot be set during login'
  }),
  // phone number validation
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid phone number (e.g., 01123456789)',
      'any.required': 'Phone number is required'
    })
}).options({
  abortEarly: false, // Show all errors not just the first one
  stripUnknown: true // Remove unknown fields
});



const registerSchema = Joi.object({
  userName: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .messages({
      'string.empty': 'User name cannot be empty',
      'string.min': 'User name must be at least 3 characters',
      'string.max': 'User name cannot exceed 30 characters',
    }),
  // phone number validation
  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid phone number (e.g., 01123456789)',
    }),
  status: Joi.string()
    .valid('approved', 'pending', 'rejected') // Only allow "approved", "pending", or "rejected"
    .messages({
      'any.only': 'Status must be "approved", "pending", or "rejected"',
    })

}).options({
  abortEarly: false, // Show all errors not just the first one
  stripUnknown: true // Remove unknown fields
});

// Export schemas
module.exports = {
  loginSchema,
  registerSchema
};