const { SlashCommandBuilder } = require('discord.js');
const Invoice = require('../models/Invoice');
const { buildInvoiceEmbed } = require('../utils/embedBuilder');
const Config = require('../models/Config');

module.exports = {
  data: new SlashCommandBuilder().setName('invoiceinfo').setDescription('Show invoice details').addStringOption(o => o.setName('invoiceid').setRequired(true)),
  async execute(interaction) {
    const id = interaction.options.getString('invoiceid');
    const inv = await Invoice.findOne({ invoiceId: id });
    if (!inv) return interaction.reply({ content: 'Invoice not found.', ephemeral: true });
    const cfg = await Config.findOne({ guildId: interaction.guildId });
    const embed = buildInvoiceEmbed(cfg || {}, inv);
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
