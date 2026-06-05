const Joi = require('joi');

const createSchema = Joi.object({
  customer_id: Joi.string().required(),
  plan_id:     Joi.string().required(),
});

const listSchema = Joi.object({
  status:      Joi.string().valid('active', 'trialing', 'failed', 'suspended', 'cancelled').optional(),
  customer_id: Joi.string().optional(),
  limit:       Joi.number().integer().min(1).max(200).default(50),
  offset:      Joi.number().integer().min(0).default(0),
});

module.exports = { createSchema, listSchema };
