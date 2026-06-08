const dashboardDAO = require('./dashboard.dao');

async function getDashboardStats() {
  const [counts, stats, recentPayments, upcomingBilling] = await Promise.all([
    dashboardDAO.getSubscriptionCounts(),
    dashboardDAO.getPaymentStats(),
    dashboardDAO.getRecentPayments(10),
    dashboardDAO.getUpcomingBilling(5),
  ]);

  const total = Object.values(counts).reduce((a, b) => a + Number(b), 0);
  const successRate = stats.total_payments
    ? ((stats.successful_payments / stats.total_payments) * 100).toFixed(1)
    : '0.0';

  return {
    subscriptions: {
      active:    counts.active    || 0,
      trialing:  counts.trialing  || 0,
      failed:    counts.failed    || 0,
      suspended: counts.suspended || 0,
      cancelled: counts.cancelled || 0,
      total,
    },
    revenue: {
      total:      parseFloat((stats.total_revenue      || 0).toFixed(2)),
      this_month: parseFloat((stats.revenue_this_month || 0).toFixed(2)),
    },
    payments: {
      total:                stats.total_payments      || 0,
      successful:           stats.successful_payments || 0,
      failed:               stats.failed_payments     || 0,
      success_rate_percent: parseFloat(successRate),
    },
    recent_payments:  recentPayments,
    upcoming_billing: upcomingBilling,
  };
}

module.exports = { getDashboardStats };
