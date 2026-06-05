const cron            = require('node-cron');
const { logger }      = require('../middleware/logger');
const subscriptionDAO = require('../modules/subscription/subscription.dao');

// TODO: Wire paymentService once payment module is implemented
// Payment processing and retry logic will be triggered here

const SCHEDULE = process.env.CRON_SCHEDULE || '* * * * *';

async function runBillingCycle() {
  const due = await subscriptionDAO.findDue();
  if (!due.length) return;

  logger.info(`Billing cycle started — ${due.length} subscription(s) due`);

  for (const subscription of due) {
    try {
      // TODO: await paymentService.processPayment(subscription)
      logger.info('Subscription due for billing', { subscriptionId: subscription.id });
    } catch (err) {
      logger.error('Error in billing cycle', { subscriptionId: subscription.id, error: err.message });
    }
  }

  logger.info(`Billing cycle completed — ${due.length} subscription(s) checked`);
}

function start() {
  if (!cron.validate(SCHEDULE)) {
    logger.error(`Invalid cron schedule: "${SCHEDULE}" — retry job not started`);
    return;
  }
  logger.info(`Retry job scheduled: "${SCHEDULE}"`);
  cron.schedule(SCHEDULE, async () => {
    try {
      await runBillingCycle();
    } catch (err) {
      logger.error('Billing cycle threw unexpected error', { error: err.message });
    }
  });
}

module.exports = { start, runBillingCycle };
