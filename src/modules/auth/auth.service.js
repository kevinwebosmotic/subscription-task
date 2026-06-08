const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('./auth.model');
const { AppError } = require('../../middleware/errorHandler');

const JWT_SECRET  = process.env.JWT_SECRET  || 'changeme-secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

async function register({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError(`Email "${email}" is already registered`, 409);

  const hashed = await bcrypt.hash(password, 10);
  const user   = await User.create({ name, email, password: hashed });
  const token  = generateToken(user.toJSON());

  return { user: user.toJSON(), token };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('Invalid email or password', 401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError('Invalid email or password', 401);

  const token = generateToken(user.toJSON());
  return { user: user.toJSON(), token };
}

module.exports = { register, login };
