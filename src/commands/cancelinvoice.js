const { SlashCommandBuilder } = require('discord.js');
const Invoice = require('../models/Invoice');
const Config = require('../models/Config');
const { buildInvoiceEmbed } = require('../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder().setName('cancelinvoice').setDescription('Cancel an invoice').addStringOption(o => o.setName('invoiceid').setRequired(true)),
  adminOnly: true,
  async execute(interaction) {
    const id = interaction.options.getString('invoiceid');
    const inv = await Invoice.findOne({ invoiceId: id });
    if (!inv) return interaction.reply({ content: 'Invoice not found.', ephemeral: true });
    inv.status = 'CANCELLED';
    await inv.save();
    const cfg = await Config.findOne({ guildId: interaction.guildId });
    const embed = buildInvoiceEmbed(cfg || {}, inv).setColor('#ef4444');
    if (inv.channelId && inv.messageId) {
      try {
        const ch = await interaction.client.channels.fetch(inv.channelId);
        const msg = await ch.messages.fetch(inv.messageId);
        await msg.edit({ embeds: [embed] }).catch(() => null);
      } catch (e) {}
    }
    try { const user = await interaction.client.users.fetch(inv.targetId); await user.send({ content: `Your invoice ${inv.invoiceId} has been cancelled.`, embeds: [embed] }).catch(()=>{}); } catch(e){}
    return interaction.reply({ content: `Invoice ${inv.invoiceId} cancelled.`, ephemeral: true });
  }
};
