const authService = require('./auth.service');

async function register(req, res) {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, data: result });
}

async function login(req, res) {
  const result = await authService.login(req.body);
  res.json({ success: true, data: result });
}

module.exports = { register, login };
