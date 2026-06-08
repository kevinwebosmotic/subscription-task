const Subscription = require('../subscription/subscription.model');
const Payment      = require('../payment/payment.model');

async function getSubscriptionCounts() {
  const rows = await Subscription.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  return rows.reduce((acc, r) => { acc[r._id] = r.count; return acc; }, {});
}

async function getPaymentStats() {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const [stats = {}] = await Payment.aggregate([
    {
      $group: {
        _id: null,
        total_payments:      { $sum: 1 },
        successful_payments: { $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] } },
        failed_payments:     { $sum: { $cond: [{ $eq: ['$status', 'failed']  }, 1, 0] } },
        total_revenue:       { $sum: { $cond: [{ $eq: ['$status', 'success'] }, '$amount', 0] } },
        revenue_this_month:  {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$status', 'success'] }, { $gte: ['$processed_at', startOfMonth] }] },
              '$amount', 0,
            ],
          },
        },
      },
    },
  ]);
  return stats;
}

async function getRecentPayments(limit = 10) {
  return Payment.find()
    .populate('customer_id', 'name')
    .populate('plan_id', 'name')
    .sort({ processed_at: -1 })
    .limit(limit)
    .lean({ virtuals: true });
}

async function getUpcomingBilling(limit = 5) {
  return Subscription.find({ status: { $in: ['active', 'trialing'] } })
    .populate('customer_id', 'name')
    .populate('plan_id', 'name price')
    .sort({ next_billing_date: 1 })
    .limit(limit)
    .lean({ virtuals: true });
}

module.exports = { getSubscriptionCounts, getPaymentStats, getRecentPayments, getUpcomingBilling };
