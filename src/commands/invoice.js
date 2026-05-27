const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const Config = require('../models/Config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invoice')
    .setDescription('Create a new invoice')
    .addUserOption(opt => opt.setName('user').setDescription('Target user').setRequired(true)),
  adminOnly: true,
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const cfg = await Config.findOne({ guildId: interaction.guildId });

    const modal = new ModalBuilder().setCustomId('create-invoice-modal').setTitle('Create Invoice');

    const targetInput = new TextInputBuilder()
      .setCustomId('targetId')
      .setLabel('Target (mention or id)')
      .setStyle(TextInputStyle.Short)
      .setValue(`<@${target.id}>`)
      .setRequired(true);

    const productInput = new TextInputBuilder()
      .setCustomId('product')
      .setLabel('Product / Service')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const amountInput = new TextInputBuilder()
      .setCustomId('amount')
      .setLabel('Amount (number)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const currencyInput = new TextInputBuilder()
      .setCustomId('currency')
      .setLabel('Currency (e.g. USD)')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setValue('USD');

    const paymentInput = new TextInputBuilder()
      .setCustomId('paymentMethod')
      .setLabel('Payment Method')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setValue((cfg?.paymentMethods?.[0]) || 'PayPal');

    const dueInput = new TextInputBuilder()
      .setCustomId('dueDate')
      .setLabel('Due Date (optional)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const notesInput = new TextInputBuilder()
      .setCustomId('notes')
      .setLabel('Notes (optional)')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    // Modal supports up to 5 inputs; we'll combine a few
    modal.addComponents(
      new ActionRowBuilder().addComponents(targetInput),
      new ActionRowBuilder().addComponents(productInput),
      new ActionRowBuilder().addComponents(amountInput),
      new ActionRowBuilder().addComponents(currencyInput),
      new ActionRowBuilder().addComponents(paymentInput)
    );

    // We will send notes and due date via follow-up ephemeral prompt if needed
    await interaction.showModal(modal);
  }
};
