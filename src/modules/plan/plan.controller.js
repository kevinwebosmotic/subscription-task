const planService  = require('./plan.service');
const { AppError } = require('../../middleware/errorHandler');

async function create(req, res) {
  const plan = await planService.createPlan(req.body);
  res.status(201).json({ success: true, data: plan });
}

async function getAll(req, res) {
  const plans = await planService.getAllPlans();
  res.json({ success: true, data: plans });
}

async function getById(req, res, next) {
  const plan = await planService.getPlanById(req.params.id);
  if (!plan) return next(new AppError('Plan not found', 404));
  res.json({ success: true, data: plan });
}

async function update(req, res, next) {
  const existing = await planService.getPlanById(req.params.id);
  if (!existing) return next(new AppError('Plan not found', 404));
  const plan = await planService.updatePlan(req.params.id, req.body);
  res.json({ success: true, data: plan });
}

async function remove(req, res, next) {
  const deleted = await planService.deletePlan(req.params.id);
  if (!deleted) return next(new AppError('Plan not found', 404));
  res.json({ success: true, message: 'Plan deleted' });
}

module.exports = { create, getAll, getById, update, remove };
