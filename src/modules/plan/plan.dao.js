const Plan = require('./plan.model');

async function create({ name, description, price, interval, trial_days = 0 }) {
  const doc = await Plan.create({ name, description: description || null, price, interval, trial_days });
  return doc.toJSON();
}

async function findById(id) {
  try {
    const doc = await Plan.findById(id);
    return doc ? doc.toJSON() : null;
  } catch { return null; }
}

async function findAll() {
  const docs = await Plan.find().sort({ created_at: -1 });
  return docs.map((d) => d.toJSON());
}

async function updateById(id, fields) {
  const allowed = ['name', 'description', 'price', 'interval', 'trial_days'];
  const updates = Object.fromEntries(Object.entries(fields).filter(([k]) => allowed.includes(k)));
  if (!Object.keys(updates).length) return findById(id);
  try {
    const doc = await Plan.findByIdAndUpdate(id, updates, { new: true });
    return doc ? doc.toJSON() : null;
  } catch { return null; }
}

async function deleteById(id) {
  try {
    const result = await Plan.findByIdAndDelete(id);
    return !!result;
  } catch { return false; }
}

module.exports = { create, findById, findAll, updateById, deleteById };
