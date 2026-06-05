const subscriptionService = require('./subscription.service');
const { AppError }        = require('../../middleware/errorHandler');

async function subscribe(req, res) {
  const subscription = await subscriptionService.subscribe(req.body);
  res.status(201).json({ success: true, data: subscription });
}

async function getAll(req, res) {
  const subscriptions = await subscriptionService.getAllSubscriptions(req.query);
  res.json({ success: true, data: subscriptions });
}

async function getById(req, res, next) {
  const subscription = await subscriptionService.getSubscriptionById(req.params.id);
  if (!subscription) return next(new AppError('Subscription not found', 404));
  res.json({ success: true, data: subscription });
}

async function cancel(req, res) {
  const subscription = await subscriptionService.cancelSubscription(req.params.id);
  res.json({ success: true, data: subscription });
}

async function reactivate(req, res) {
  const subscription = await subscriptionService.reactivateSubscription(req.params.id);
  res.json({ success: true, data: subscription });
}

module.exports = { subscribe, getAll, getById, cancel, reactivate };
