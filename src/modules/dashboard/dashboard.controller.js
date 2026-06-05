const dashboardService = require('./dashboard.service');

async function getDashboard(req, res) {
  const data = await dashboardService.getDashboardStats();
  res.json({ success: true, data });
}

module.exports = { getDashboard };
