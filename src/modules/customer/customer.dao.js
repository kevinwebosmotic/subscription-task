const Customer     = require('./customer.model');
const { AppError } = require('../../middleware/errorHandler');

async function create({ name, email }) {
  try {
    const doc = await Customer.create({ name, email });
    return doc.toJSON();
  } catch (err) {
    if (err.code === 11000) throw new AppError(`Customer with email "${email}" already exists`, 409);
    throw err;
  }
}

async function findById(id) {
  try {
    const doc = await Customer.findById(id);
    return doc ? doc.toJSON() : null;
  } catch { return null; }
}

async function findAll({ limit = 50, offset = 0 } = {}) {
  const docs = await Customer.find().sort({ created_at: -1 }).skip(offset).limit(limit);
  return docs.map((d) => d.toJSON());
}

async function deleteById(id) {
  try {
    const result = await Customer.findByIdAndDelete(id);
    return !!result;
  } catch { return false; }
}

module.exports = { create, findById, findAll, deleteById };
