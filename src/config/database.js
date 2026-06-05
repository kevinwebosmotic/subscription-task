const mongoose = require('mongoose');

async function connect() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/subscription_platform';
  await mongoose.connect(uri);
}

module.exports = { connect };
