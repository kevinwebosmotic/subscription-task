const router = require('express').Router();

router.use('/customers',     require('../modules/customer/customer.routes'));
router.use('/plans',         require('../modules/plan/plan.routes'));
router.use('/subscriptions', require('../modules/subscription/subscription.routes'));
router.use('/dashboard',     require('../modules/dashboard/dashboard.routes'));

// TODO: Payment and Webhook modules — pending implementation
// router.use('/payments',  require('../modules/payment/payment.routes'));
// router.use('/webhooks',  require('../modules/webhook/webhook.routes'));

module.exports = router;
