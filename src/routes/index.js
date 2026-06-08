const router          = require('express').Router();
const { verifyToken } = require('../middleware/auth');

router.use('/auth', require('../modules/auth/auth.routes'));

router.use(verifyToken);

router.use('/customers',     require('../modules/customer/customer.routes'));
router.use('/plans',         require('../modules/plan/plan.routes'));
router.use('/subscriptions', require('../modules/subscription/subscription.routes'));
router.use('/payments',      require('../modules/payment/payment.routes'));
router.use('/dashboard',     require('../modules/dashboard/dashboard.routes'));

module.exports = router;
