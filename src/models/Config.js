const { Schema, model } = require('mongoose');

const ConfigSchema = new Schema({
  guildId: { type: String, required: true, unique: true },
  invoiceChannelId: String,
  companyName: { type: String, default: 'Your Company' },
  companyLogo: String,
  footerText: { type: String, default: 'Powered by BillingBot' },
  themeColor: { type: String, default: '#0af' },
  paymentMethods: { type: [String], default: ['PayPal', 'Crypto', 'Bank Transfer'] }
});

module.exports = model('Config', ConfigSchema);
