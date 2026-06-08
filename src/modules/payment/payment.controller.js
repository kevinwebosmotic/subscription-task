const paymentService      = require('./payment.service');
const subscriptionService = require('../subscription/subscription.service');
const { AppError }        = require('../../middleware/errorHandler');

async function getAll(req, res) {
  const payments = await paymentService.getAllPayments(req.query);
  res.json({ success: true, data: payments });
}

async function getByCustomer(req, res) {
  const payments = await paymentService.getPaymentsByCustomer(req.params.customerId);
  res.json({ success: true, data: payments });
}

async function simulate(req, res, next) {
  const subscription = await subscriptionService.getSubscriptionById(req.params.subscriptionId);
  if (!subscription) return next(new AppError('Subscription not found', 404));
  if (['cancelled', 'suspended'].includes(subscription.status)) {
    return next(new AppError(`Cannot process payment for a ${subscription.status} subscription`, 400));
  }
  const result = await paymentService.processPayment(subscription, { force: req.body.force });
  res.json({ success: true, data: result });
}

module.exports = { getAll, getByCustomer, simulate };
