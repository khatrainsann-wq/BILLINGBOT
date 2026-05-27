const { SlashCommandBuilder } = require('discord.js');
const Invoice = require('../models/Invoice');
const Config = require('../models/Config');
const { buildInvoiceEmbed } = require('../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder().setName('paid').setDescription('Mark invoice as paid').addStringOption(o => o.setName('invoiceid').setRequired(true)),
  adminOnly: true,
  async execute(interaction) {
    const id = interaction.options.getString('invoiceid');
    const inv = await Invoice.findOne({ invoiceId: id });
    if (!inv) return interaction.reply({ content: 'Invoice not found.', ephemeral: true });
    inv.status = 'PAID';
    await inv.save();
    const cfg = await Config.findOne({ guildId: interaction.guildId });
    const embed = buildInvoiceEmbed(cfg || {}, inv).setColor('#22c55e');
    // update message in channel
    if (inv.channelId && inv.messageId) {
      try {
        const ch = await interaction.client.channels.fetch(inv.channelId);
        const msg = await ch.messages.fetch(inv.messageId);
        await msg.edit({ embeds: [embed] }).catch(() => null);
      } catch (e) {}
    }
    // DM target
    try { const user = await interaction.client.users.fetch(inv.targetId); await user.send({ content: `Your invoice ${inv.invoiceId} has been marked as PAID.`, embeds: [embed] }).catch(()=>{}); } catch(e){}
    return interaction.reply({ content: `Invoice ${inv.invoiceId} marked as PAID.`, ephemeral: true });
  }
};
