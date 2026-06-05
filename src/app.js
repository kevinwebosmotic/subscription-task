require('dotenv').config();
const fs      = require('fs');
const path    = require('path');
const express = require('express');
const { requestLogger, logger } = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { connect } = require('./config/database');
const retryJob    = require('./jobs/retryJob');

const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestLogger);

app.get('/api/health', (_, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', require('./routes/index'));

app.use(notFound);
app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '3000', 10);

(async () => {
  try {
    await connect();
    logger.info('MongoDB connected');
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      retryJob.start();
    });
  } catch (err) {
    logger.error('Failed to connect to MongoDB', { error: err.message });
    process.exit(1);
  }
})();

module.exports = app;
