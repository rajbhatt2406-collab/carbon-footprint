const Joi = require('joi');

const footprintSchema = Joi.object({
  carKm: Joi.number().min(0).optional().default(0)
    .messages({
      'number.base': 'Car km must be a number',
      'number.min': 'Car km cannot be negative'
    }),
  bikeKm: Joi.number().min(0).optional().default(0)
    .messages({
      'number.base': 'Bike km must be a number',
      'number.min': 'Bike km cannot be negative'
    }),
  busKm: Joi.number().min(0).optional().default(0)
    .messages({
      'number.base': 'Bus km must be a number',
      'number.min': 'Bus km cannot be negative'
    }),
  trainKm: Joi.number().min(0).optional().default(0)
    .messages({
      'number.base': 'Train km must be a number',
      'number.min': 'Train km cannot be negative'
    }),
  electricityKwh: Joi.number().min(0).optional().default(0)
    .messages({
      'number.base': 'Electricity kWh must be a number',
      'number.min': 'Electricity kWh cannot be negative'
    }),
  foodHabit: Joi.string().required()
    .messages({
      'any.required': 'Food habits are required',
      'string.base': 'Food habit must be a string'
    }),
  shoppingHabit: Joi.string().required()
    .messages({
      'any.required': 'Shopping habits are required',
      'string.base': 'Shopping habit must be a string'
    })
});

module.exports = footprintSchema;
