const router          = require('express').Router();
const authController  = require('./auth.controller');
const { validate }    = require('../../middleware/validate');
const { asyncHandler } = require('../../middleware/errorHandler');
const { registerSchema, loginSchema } = require('./auth.validator');

router.post('/register', validate(registerSchema), asyncHandler(authController.register));
router.post('/login',    validate(loginSchema),    asyncHandler(authController.login));

module.exports = router;
