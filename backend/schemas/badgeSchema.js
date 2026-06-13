const Joi = require('joi');

const badgeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  badgeType: Joi.string().required(),
  unlockedAt: Joi.date().iso().optional(),
  userId: Joi.string().optional()
});

module.exports = badgeSchema;
