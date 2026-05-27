const { SlashCommandBuilder } = require('discord.js');
const Invoice = require('../models/Invoice');
const { buildInvoiceEmbed } = require('../utils/embedBuilder');
const Config = require('../models/Config');

module.exports = {
  data: new SlashCommandBuilder().setName('invoices').setDescription('List invoices for a user').addUserOption(o => o.setName('user').setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getUser('user') || interaction.user;
    const list = await Invoice.find({ targetId: target.id }).sort({ createdAt: -1 }).limit(10);
    if (!list.length) return interaction.reply({ content: 'No invoices found for that user.', ephemeral: true });
    const cfg = await Config.findOne({ guildId: interaction.guildId });
    const embeds = list.map(i => buildInvoiceEmbed(cfg || {}, i));
    return interaction.reply({ embeds: embeds.slice(0, 10), ephemeral: true });
  }
};
