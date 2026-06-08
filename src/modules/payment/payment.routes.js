const router             = require('express').Router();
const paymentController  = require('./payment.controller');
const { validate }       = require('../../middleware/validate');
const { asyncHandler }   = require('../../middleware/errorHandler');
const { listSchema, simulateSchema } = require('./payment.validator');

router.get('/',                          validate(listSchema, 'query'), asyncHandler(paymentController.getAll));
router.get('/customer/:customerId',                                     asyncHandler(paymentController.getByCustomer));
router.post('/simulate/:subscriptionId', validate(simulateSchema),      asyncHandler(paymentController.simulate));

module.exports = router;
