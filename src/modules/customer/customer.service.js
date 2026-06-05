const customerDAO = require('./customer.dao');

async function createCustomer(data) {
  return customerDAO.create(data);
}

async function getCustomerById(id) {
  return customerDAO.findById(id);
}

async function getAllCustomers({ limit, offset } = {}) {
  return customerDAO.findAll({ limit, offset });
}

async function deleteCustomer(id) {
  return customerDAO.deleteById(id);
}

module.exports = { createCustomer, getCustomerById, getAllCustomers, deleteCustomer };
