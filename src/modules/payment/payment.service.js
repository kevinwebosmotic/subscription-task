const paymentDAO          = require('./payment.dao');
const subscriptionService = require('../subscription/subscription.service');
const emailService        = require('../../shared/email.service');
const { logger }          = require('../../middleware/logger');

const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '3', 10);

const DECLINE_REASONS = [
  'Payment declined: insufficient funds',
  'Payment declined: card expired',
  'Payment declined: do not honor',
  'Payment gateway timeout',
  'Invalid card number',
];

function simulateOutcome(force) {
  if (force === 'success') return true;
  if (force === 'failure') return false;
  return Math.random() < parseFloat(process.env.PAYMENT_SUCCESS_RATE || '0.7');
}

async function processPayment(subscription, { force } = {}) {
  const success       = simulateOutcome(force);
  const attemptNumber = subscription.retry_count + 1;

  const payment = await paymentDAO.create({
    subscription_id: subscription.id,
    customer_id:     subscription.customer_id,
    plan_id:         subscription.plan_id,
    amount:          subscription.price,
    status:          success ? 'success' : 'failed',
    attempt_number:  attemptNumber,
    error_message:   success ? null : DECLINE_REASONS[Math.floor(Math.random() * DECLINE_REASONS.length)],
  });

  let updatedSubscription;

  if (success) {
    updatedSubscription = await subscriptionService.markSuccess(subscription.id, subscription.interval);
    logger.info('Payment succeeded', { subscriptionId: subscription.id, amount: subscription.price, attempt: attemptNumber });

    await emailService.paymentSuccess({
      customerEmail:   subscription.customer_email,
      customerName:    subscription.customer_name,
      planName:        subscription.plan_name,
      amount:          subscription.price,
      nextBillingDate: updatedSubscription.next_billing_date,
    });
  } else {
    updatedSubscription = await subscriptionService.markFailed(subscription.id, subscription.retry_count);
    const suspended = updatedSubscription.status === 'suspended';

    logger.warn('Payment failed', {
      subscriptionId: subscription.id,
      attempt:        attemptNumber,
      retryCount:     updatedSubscription.retry_count,
      status:         updatedSubscription.status,
    });

    await emailService.paymentFailed({
      customerEmail: subscription.customer_email,
      customerName:  subscription.customer_name,
      planName:      subscription.plan_name,
      retryCount:    updatedSubscription.retry_count,
      maxRetries:    MAX_RETRIES,
      nextRetryDate: updatedSubscription.next_billing_date,
    });

    if (suspended) {
      await emailService.subscriptionSuspended({
        customerEmail: subscription.customer_email,
        customerName:  subscription.customer_name,
        planName:      subscription.plan_name,
      });
    }
  }

  return { payment, subscription: updatedSubscription };
}

async function getAllPayments(filters) {
  return paymentDAO.findAll(filters);
}

async function getPaymentsByCustomer(customerId) {
  return paymentDAO.findAll({ customer_id: customerId });
}

module.exports = { processPayment, getAllPayments, getPaymentsByCustomer };
