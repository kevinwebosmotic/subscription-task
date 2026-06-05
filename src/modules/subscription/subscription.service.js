const subscriptionDAO = require('./subscription.dao');
const customerDAO     = require('../customer/customer.dao');
const planDAO         = require('../plan/plan.dao');
const { AppError }    = require('../../middleware/errorHandler');

const MAX_RETRIES     = parseInt(process.env.MAX_RETRIES || '3', 10);
const RETRY_INTERVALS = (process.env.RETRY_INTERVALS || '1,6,24').split(',').map(Number);

function addInterval(date, interval) {
  const d = new Date(date);
  if (interval === 'monthly') d.setMonth(d.getMonth() + 1);
  else d.setFullYear(d.getFullYear() + 1);
  return d;
}

function addHours(date, hours) {
  return new Date(new Date(date).getTime() + hours * 3_600_000);
}

async function subscribe({ customer_id, plan_id }) {
  const [customer, plan] = await Promise.all([
    customerDAO.findById(customer_id),
    planDAO.findById(plan_id),
  ]);
  if (!customer) throw new AppError('Customer not found', 404);
  if (!plan)     throw new AppError('Plan not found', 404);

  const status = plan.trial_days > 0 ? 'trialing' : 'active';
  const next_billing_date = plan.trial_days > 0
    ? new Date(Date.now() + plan.trial_days * 86_400_000)
    : addInterval(new Date(), plan.interval);

  return subscriptionDAO.create({ customer_id, plan_id, status, next_billing_date });
}

async function getSubscriptionById(id) {
  return subscriptionDAO.findById(id);
}

async function getAllSubscriptions(filters) {
  return subscriptionDAO.findAll(filters);
}

async function cancelSubscription(id) {
  const existing = await subscriptionDAO.findById(id);
  if (!existing) throw new AppError('Subscription not found', 404);
  if (existing.status === 'cancelled') throw new AppError('Subscription is already cancelled', 400);
  return subscriptionDAO.updateById(id, { status: 'cancelled' });
}

async function reactivateSubscription(id) {
  const existing = await subscriptionDAO.findById(id);
  if (!existing) throw new AppError('Subscription not found', 404);
  if (!['suspended', 'cancelled', 'failed'].includes(existing.status)) {
    throw new AppError(`Cannot reactivate a subscription with status "${existing.status}"`, 400);
  }
  const plan = await planDAO.findById(existing.plan_id);
  const next_billing_date = addInterval(new Date(), plan.interval);
  return subscriptionDAO.updateById(id, { status: 'active', retry_count: 0, next_billing_date });
}

async function markSuccess(subscriptionId, planInterval) {
  const next_billing_date = addInterval(new Date(), planInterval);
  return subscriptionDAO.updateById(subscriptionId, { status: 'active', retry_count: 0, next_billing_date });
}

async function markFailed(subscriptionId, currentRetryCount) {
  const newRetryCount = currentRetryCount + 1;
  const isSuspended   = newRetryCount > MAX_RETRIES;

  const update = isSuspended
    ? { status: 'suspended', retry_count: newRetryCount }
    : {
        status:            'failed',
        retry_count:       newRetryCount,
        next_billing_date: addHours(new Date(), RETRY_INTERVALS[newRetryCount - 1] || 24),
      };

  return subscriptionDAO.updateById(subscriptionId, update);
}

module.exports = {
  subscribe, getSubscriptionById, getAllSubscriptions,
  cancelSubscription, reactivateSubscription,
  markSuccess, markFailed,
};
