const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().trim().email().required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
      'string.empty': 'Email is required'
    }),
  password: Joi.string().min(6).required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required',
      'string.empty': 'Password is required'
    }),
  displayName: Joi.string().trim().min(1).max(50).optional()
    .messages({
      'string.min': 'Display name must be between 1 and 50 characters',
      'string.max': 'Display name must be between 1 and 50 characters'
    })
});

module.exports = registerSchema;
