const Joi = require('joi');

// Password complexity requirements
const passwordComplexity = Joi.string()
  .min(8)
  .max(20)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
  .required()
  .messages({
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password cannot exceed 20 characters',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    'any.required': 'Password is required'
  });

// Registration schema
const registerSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(3)
    .max(12)
    .required()
    .messages({
      'string.empty': 'First name cannot be empty',
      'string.min': 'First name must be at least 3 characters',
      'string.max': 'First name cannot exceed 12 characters',
      'any.required': 'First name is required'
    }),

  lastName: Joi.string()
    .trim()
    .min(3)
    .max(12)
    .required()
    .messages({
      'string.empty': 'Last name cannot be empty',
      'string.min': 'Last name must be at least 3 characters',
      'string.max': 'Last name cannot exceed 12 characters',
      'any.required': 'Last name is required'
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email({ 
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'org', 'edu', 'eg'] }
    })
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),

  password: passwordComplexity,

  // Prevent role assignment during registration
  role: Joi.forbidden().messages({
    'any.unknown': 'Role cannot be set during registration'
  }),

  // phone number validation
  phoneNumber: Joi.string()
    .trim()
    .pattern(/^01[0-2,5]{1}[0-9]{8}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid Egyptian phone number (e.g., 01123456789)',
      'any.required': 'Phone number is required'
    })
}).options({ 
  abortEarly: false, // Show all errors not just the first one
  stripUnknown: true // Remove unknown fields
});

// Login schema
const loginSchema = Joi.object({
  email: registerSchema.extract('email'),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
}).options({ abortEarly: false });

// Update profile schema
const updateSchema = Joi.object({
  firstName: Joi.string().trim().min(3).max(12),
  lastName: Joi.string().trim().min(3).max(12),
  
  phoneNumber: Joi.string()
    .trim()
    .pattern(/^01[0-2,5]{1}[0-9]{8}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid Egyptian phone number'
    }),

  image: Joi.string()
    .uri()
    .messages({
      'string.uri': 'Image must be a valid URL'
    }),

  address: Joi.object({
    street: Joi.string().trim().max(100),
    city: Joi.string().trim().max(50),
    state: Joi.string().trim().max(50),
    zipCode: Joi.string().pattern(/^\d{5}$/).messages({
      'string.pattern.base': 'Zip code must be 5 digits'
    }),
    country: Joi.string().trim().default('Egypt')
  })
}).options({ 
  abortEarly: false,
  stripUnknown: true 
});

// Export schemas
module.exports = {
  registerSchema,
  loginSchema,
  updateSchema
};