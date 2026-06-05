const Joi = require('joi');

const createSchema = Joi.object({
  name:  Joi.string().trim().min(1).max(120).required(),
  email: Joi.string().email().lowercase().required(),
});

module.exports = { createSchema };
