const Joi = require('joi');

const listSchema = Joi.object({
  customer_id:     Joi.string().optional(),
  subscription_id: Joi.string().optional(),
  status:          Joi.string().valid('success', 'failed').optional(),
  limit:           Joi.number().integer().min(1).max(200).default(50),
  offset:          Joi.number().integer().min(0).default(0),
});

const simulateSchema = Joi.object({
  force: Joi.string().valid('success', 'failure').optional(),
});

module.exports = { listSchema, simulateSchema };
