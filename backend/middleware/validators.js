const Joi = require('joi');
const registerSchema = require('../schemas/registerSchema');
const loginSchema = require('../schemas/loginSchema');
const footprintSchema = require('../schemas/footprintSchema');
const goalSchema = require('../schemas/goalSchema');

/**
 * Higher-order middleware to validate req.body against a Joi schema.
 */
const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });
  if (error) {
    const formattedErrors = error.details.map(err => ({
      msg: err.message,
      path: err.path[0],
      location: 'body'
    }));
    return res.status(400).json({ errors: formattedErrors });
  }
  next();
};

const registerValidator = validateBody(registerSchema);
const loginValidator = validateBody(loginSchema);
const footprintValidator = validateBody(footprintSchema);
const goalValidator = validateBody(goalSchema);

// Custom validator to check both req.params.id and req.body.currentProgress
const goalProgressSchema = Joi.object({
  id: Joi.string().required()
    .messages({
      'any.required': 'Goal ID is required',
      'string.empty': 'Goal ID is required'
    }),
  currentProgress: Joi.number().min(0).required()
    .messages({
      'number.base': 'Current progress must be a number',
      'number.min': 'Current progress cannot be negative',
      'any.required': 'Current progress is required'
    })
});

const goalProgressValidator = (req, res, next) => {
  const data = {
    id: req.params.id,
    currentProgress: req.body.currentProgress
  };
  const { error } = goalProgressSchema.validate(data, { abortEarly: false });
  if (error) {
    const formattedErrors = error.details.map(err => ({
      msg: err.message,
      path: err.path[0],
      location: err.path[0] === 'id' ? 'params' : 'body'
    }));
    return res.status(400).json({ errors: formattedErrors });
  }
  next();
};

module.exports = {
  registerValidator,
  loginValidator,
  footprintValidator,
  goalValidator,
  goalProgressValidator
};
