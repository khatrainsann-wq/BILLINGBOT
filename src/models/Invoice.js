const { Schema, model } = require('mongoose');

const InvoiceSchema = new Schema({
  invoiceId: { type: String, required: true, unique: true },
  guildId: String,
  issuerId: String,
  targetId: String,
  product: String,
  amount: Number,
  currency: String,
  paymentMethod: String,
  dueDate: String,
  notes: String,
  status: { type: String, default: 'UNPAID' },
  channelId: String,
  messageId: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('Invoice', InvoiceSchema);
