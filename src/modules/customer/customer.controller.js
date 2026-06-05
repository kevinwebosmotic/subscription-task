const customerService = require('./customer.service');
const { AppError }    = require('../../middleware/errorHandler');

async function create(req, res) {
  const customer = await customerService.createCustomer(req.body);
  res.status(201).json({ success: true, data: customer });
}

async function getAll(req, res) {
  const customers = await customerService.getAllCustomers(req.query);
  res.json({ success: true, data: customers });
}

async function getById(req, res, next) {
  const customer = await customerService.getCustomerById(req.params.id);
  if (!customer) return next(new AppError('Customer not found', 404));
  res.json({ success: true, data: customer });
}

async function remove(req, res, next) {
  const deleted = await customerService.deleteCustomer(req.params.id);
  if (!deleted) return next(new AppError('Customer not found', 404));
  res.json({ success: true, message: 'Customer deleted' });
}

module.exports = { create, getAll, getById, remove };
