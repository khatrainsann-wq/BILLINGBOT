const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) throw new Error('Missing MongoDB URI');
  await mongoose.connect(uri, {
    dbName: 'billingbot'
  });
  console.log('MongoDB connected');
}

module.exports = { connectDB };
