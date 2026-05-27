const Config = require('../models/Config');
const Invoice = require('../models/Invoice');
const { buildInvoiceEmbed } = require('../utils/embedBuilder');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // handled in interactionCreate.js main handler
  }
};
