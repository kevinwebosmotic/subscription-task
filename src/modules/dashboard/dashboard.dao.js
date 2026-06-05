const Subscription = require('../subscription/subscription.model');

// TODO: Payment stats will be added once the payment module is implemented
// const Payment = require('../payment/payment.model');

async function getSubscriptionCounts() {
  const rows = await Subscription.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  return rows.reduce((acc, r) => { acc[r._id] = r.count; return acc; }, {});
}

async function getUpcomingBilling(limit = 5) {
  return Subscription.find({ status: { $in: ['active', 'trialing'] } })
    .populate('customer_id', 'name')
    .populate('plan_id', 'name price')
    .sort({ next_billing_date: 1 })
    .limit(limit)
    .lean({ virtuals: true });
}

module.exports = { getSubscriptionCounts, getUpcomingBilling };
