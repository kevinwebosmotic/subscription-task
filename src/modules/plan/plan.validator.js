const Joi = require('joi');

const createSchema = Joi.object({
  name:        Joi.string().trim().min(1).max(120).required(),
  description: Joi.string().trim().max(500).optional(),
  price:       Joi.number().positive().precision(2).required(),
  interval:    Joi.string().valid('monthly', 'yearly').required(),
  trial_days:  Joi.number().integer().min(0).default(0),
});

const updateSchema = Joi.object({
  name:        Joi.string().trim().min(1).max(120),
  description: Joi.string().trim().max(500),
  price:       Joi.number().positive().precision(2),
  interval:    Joi.string().valid('monthly', 'yearly'),
  trial_days:  Joi.number().integer().min(0),
}).min(1);

module.exports = { createSchema, updateSchema };
