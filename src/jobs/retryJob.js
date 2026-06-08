const cron            = require('node-cron');
const { logger }      = require('../middleware/logger');
const subscriptionDAO = require('../modules/subscription/subscription.dao');
const paymentService  = require('../modules/payment/payment.service');

const SCHEDULE = process.env.CRON_SCHEDULE || '* * * * *';

async function runBillingCycle() {
  const due = await subscriptionDAO.findDue();
  if (!due.length) return;

  logger.info(`Billing cycle started — ${due.length} subscription(s) due`);

  for (const subscription of due) {
    try {
      await paymentService.processPayment(subscription);
    } catch (err) {
      logger.error('Error processing subscription in billing cycle', {
        subscriptionId: subscription.id,
        error: err.message,
      });
    }
  }

  logger.info(`Billing cycle completed — ${due.length} subscription(s) processed`);
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
