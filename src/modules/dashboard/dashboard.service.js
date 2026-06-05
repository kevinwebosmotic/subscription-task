const dashboardDAO = require('./dashboard.dao');

// TODO: Payment stats (revenue, success rate) will be added once payment module is complete

async function getDashboardStats() {
  const [counts, upcomingBilling] = await Promise.all([
    dashboardDAO.getSubscriptionCounts(),
    dashboardDAO.getUpcomingBilling(5),
  ]);

  const total = Object.values(counts).reduce((a, b) => a + Number(b), 0);

  return {
    subscriptions: {
      active:    counts.active    || 0,
      trialing:  counts.trialing  || 0,
      failed:    counts.failed    || 0,
      suspended: counts.suspended || 0,
      cancelled: counts.cancelled || 0,
      total,
    },
    upcoming_billing: upcomingBilling,
  };
}

module.exports = { getDashboardStats };
