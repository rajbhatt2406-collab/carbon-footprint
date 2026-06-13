const Joi = require('joi');

const goalSchema = Joi.object({
  targetValue: Joi.number().greater(0).required()
    .messages({
      'number.base': 'Target value must be a number',
      'number.greater': 'Target value must be greater than zero',
      'any.required': 'Target value is required'
    }),
  endDate: Joi.date().iso().optional()
    .messages({
      'date.format': 'End date must be a valid ISO 8601 date'
    }),
  currentProgress: Joi.number().min(0).optional()
    .messages({
      'number.min': 'Current progress cannot be negative'
    })
});

module.exports = goalSchema;
