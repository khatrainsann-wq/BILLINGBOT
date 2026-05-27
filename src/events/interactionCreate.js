const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionsBitField } = require('discord.js');
const { buildInvoiceEmbed } = require('../utils/embedBuilder');
const Invoice = require('../models/Invoice');
const Config = require('../models/Config');

function genInvoiceId() {
  return `INV-${Date.now().toString(36).toUpperCase().slice(-8)}-${Math.floor(Math.random() * 9000) + 1000}`;
}

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        const cmd = client.commands.get(interaction.commandName);
        if (!cmd) return;
        // admin check for invoice command
        if (cmd.adminOnly) {
          if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({ content: 'You need Manage Server permission.', ephemeral: true });
          }
        }
        await cmd.execute(interaction, client);
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId === 'create-invoice-modal') {
          await interaction.deferReply({ ephemeral: true });
          const target = interaction.fields.getTextInputValue('targetId');
          const product = interaction.fields.getTextInputValue('product');
          const amount = parseFloat(interaction.fields.getTextInputValue('amount')) || 0;
          const currency = interaction.fields.getTextInputValue('currency') || 'USD';
          const paymentMethod = interaction.fields.getTextInputValue('paymentMethod') || 'PayPal';
          const dueDate = interaction.fields.getTextInputValue('dueDate') || '—';
          const notes = interaction.fields.getTextInputValue('notes') || '—';

          const invoiceId = genInvoiceId();
          const invoiceDoc = new Invoice({
            invoiceId,
            guildId: interaction.guildId,
            issuerId: interaction.user.id,
            targetId: target.replace(/[<@!>]/g, ''),
            product,
            amount,
            currency,
            paymentMethod,
            dueDate,
            notes,
            status: 'UNPAID'
          });

          const cfg = await Config.findOne({ guildId: interaction.guildId });
          const embed = buildInvoiceEmbed(cfg || {}, invoiceDoc);

          // send to invoice channel if set
          if (cfg?.invoiceChannelId) {
            const ch = await client.channels.fetch(cfg.invoiceChannelId).catch(() => null);
            if (ch?.isTextBased()) {
              const msg = await ch.send({ embeds: [embed] }).catch(() => null);
              if (msg) {
                invoiceDoc.channelId = ch.id;
                invoiceDoc.messageId = msg.id;
              }
            }
          }

          // DM user
          try {
            const user = await client.users.fetch(invoiceDoc.targetId);
            await user.send({ embeds: [embed] }).catch(() => null);
          } catch (e) {}

          await invoiceDoc.save();
          await interaction.editReply({ content: `Invoice ${invoiceId} created and delivered.` });
        } else if (interaction.customId === 'invoice-config-modal') {
          // save config
          await interaction.deferReply({ ephemeral: true });
          const companyName = interaction.fields.getTextInputValue('companyName');
          const companyLogo = interaction.fields.getTextInputValue('companyLogo');
          const footerText = interaction.fields.getTextInputValue('footerText');
          const themeColor = interaction.fields.getTextInputValue('themeColor');
          const paymentMethods = interaction.fields.getTextInputValue('paymentMethods');
          const cfg = await Config.findOneAndUpdate(
            { guildId: interaction.guildId },
            {
              companyName,
              companyLogo,
              footerText,
              themeColor,
              paymentMethods: paymentMethods ? paymentMethods.split(',').map(s => s.trim()) : undefined
            },
            { upsert: true, new: true }
          );
          await interaction.editReply({ content: 'Invoice configuration saved.', ephemeral: true });
        }
      }
    } catch (err) {
      console.error('interaction error', err);
      if (interaction.replied || interaction.deferred) {
        try { await interaction.editReply({ content: 'An error occurred.' }); } catch {};
      } else if (interaction && interaction.isRepliable && !interaction.replied) {
        try { await interaction.reply({ content: 'An error occurred.', ephemeral: true }); } catch {};
      }
    }
  }
};
