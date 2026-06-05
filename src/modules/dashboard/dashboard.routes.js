const router              = require('express').Router();
const dashboardController = require('./dashboard.controller');
const { asyncHandler }    = require('../../middleware/errorHandler');

router.get('/', asyncHandler(dashboardController.getDashboard));

module.exports = router;
