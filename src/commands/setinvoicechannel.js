const { SlashCommandBuilder, ChannelType } = require('discord.js');
const Config = require('../models/Config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setinvoicechannel')
    .setDescription('Set the invoice logs channel')
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel to post invoices').setRequired(true)),
  adminOnly: true,
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    if (!channel || !channel.isTextBased()) return interaction.reply({ content: 'Please choose a text channel.', ephemeral: true });
    const cfg = await Config.findOneAndUpdate({ guildId: interaction.guildId }, { invoiceChannelId: channel.id }, { upsert: true, new: true });
    return interaction.reply({ content: `Invoice channel set to ${channel.toString()}`, ephemeral: true });
  }
};
