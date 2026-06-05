const router                     = require('express').Router();
const planController             = require('./plan.controller');
const { validate }               = require('../../middleware/validate');
const { asyncHandler }           = require('../../middleware/errorHandler');
const { createSchema, updateSchema } = require('./plan.validator');

router.post('/',      validate(createSchema), asyncHandler(planController.create));
router.get('/',                               asyncHandler(planController.getAll));
router.get('/:id',                            asyncHandler(planController.getById));
router.put('/:id',   validate(updateSchema),  asyncHandler(planController.update));
router.delete('/:id',                         asyncHandler(planController.remove));

module.exports = router;
