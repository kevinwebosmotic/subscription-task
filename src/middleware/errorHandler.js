const { logger } = require('./logger');

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const isOperational = err.isOperational || statusCode < 500;

  if (!isOperational) {
    logger.error('Unexpected error', { error: err.message, stack: err.stack });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && !isOperational && { stack: err.stack }),
    },
  });
}

module.exports = { AppError, asyncHandler, notFound, errorHandler };
