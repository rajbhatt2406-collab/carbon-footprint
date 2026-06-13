const Joi = require('joi');

const challengeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  points: Joi.number().integer().min(1).required(),
  completed: Joi.boolean().optional().default(false),
  userId: Joi.string().optional(),
  weekStartDate: Joi.string().optional()
});

module.exports = challengeSchema;
