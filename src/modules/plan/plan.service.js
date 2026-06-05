const planDAO = require('./plan.dao');

async function createPlan(data) {
  return planDAO.create(data);
}

async function getPlanById(id) {
  return planDAO.findById(id);
}

async function getAllPlans() {
  return planDAO.findAll();
}

async function updatePlan(id, fields) {
  return planDAO.updateById(id, fields);
}

async function deletePlan(id) {
  return planDAO.deleteById(id);
}

module.exports = { createPlan, getPlanById, getAllPlans, updatePlan, deletePlan };
