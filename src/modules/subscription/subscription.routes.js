const router                 = require('express').Router();
const subscriptionController = require('./subscription.controller');
const { validate }           = require('../../middleware/validate');
const { asyncHandler }       = require('../../middleware/errorHandler');
const { createSchema, listSchema } = require('./subscription.validator');

router.post('/',               validate(createSchema),        asyncHandler(subscriptionController.subscribe));
router.get('/',                validate(listSchema, 'query'), asyncHandler(subscriptionController.getAll));
router.get('/:id',                                             asyncHandler(subscriptionController.getById));
router.post('/:id/cancel',                                     asyncHandler(subscriptionController.cancel));
router.post('/:id/reactivate',                                 asyncHandler(subscriptionController.reactivate));

module.exports = router;
