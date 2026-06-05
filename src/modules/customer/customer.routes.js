const router             = require('express').Router();
const customerController = require('./customer.controller');
const { validate }       = require('../../middleware/validate');
const { asyncHandler }   = require('../../middleware/errorHandler');
const { createSchema }   = require('./customer.validator');

router.post('/',      validate(createSchema), asyncHandler(customerController.create));
router.get('/',                               asyncHandler(customerController.getAll));
router.get('/:id',                            asyncHandler(customerController.getById));
router.delete('/:id',                         asyncHandler(customerController.remove));

module.exports = router;
