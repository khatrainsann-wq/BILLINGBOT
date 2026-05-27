const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const Config = require('../models/Config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invoiceconfig')
    .setDescription('Configure invoice appearance (opens modal)'),
  adminOnly: true,
  async execute(interaction) {
    const modal = new ModalBuilder().setCustomId('invoice-config-modal').setTitle('Invoice Config');

    const companyInput = new TextInputBuilder().setCustomId('companyName').setLabel('Company Name').setStyle(TextInputStyle.Short).setRequired(true);
    const logoInput = new TextInputBuilder().setCustomId('companyLogo').setLabel('Company Logo URL').setStyle(TextInputStyle.Short).setRequired(false);
    const footerInput = new TextInputBuilder().setCustomId('footerText').setLabel('Footer Text').setStyle(TextInputStyle.Short).setRequired(false);
    const themeInput = new TextInputBuilder().setCustomId('themeColor').setLabel('Theme Color (hex)').setStyle(TextInputStyle.Short).setRequired(false);
    const pmInput = new TextInputBuilder().setCustomId('paymentMethods').setLabel('Payment Methods (comma separated)').setStyle(TextInputStyle.Paragraph).setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(companyInput),
      new ActionRowBuilder().addComponents(logoInput),
      new ActionRowBuilder().addComponents(footerInput),
      new ActionRowBuilder().addComponents(themeInput),
      new ActionRowBuilder().addComponents(pmInput)
    );

    await interaction.showModal(modal);
  }
};
