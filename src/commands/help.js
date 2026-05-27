const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Show help menu'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('Billing Bot Help')
      .setDescription('Slash Commands:')
      .addFields(
        { name: '/invoice', value: 'Create a new invoice (Admin only)' , inline: false},
        { name: '/setinvoicechannel', value: 'Set invoice logs channel (Admin only)' , inline: false},
        { name: '/invoiceconfig', value: 'Configure company appearance (Admin only)' , inline: false},
        { name: '/paid', value: 'Mark invoice as paid (Admin only)' , inline: false},
        { name: '/cancelinvoice', value: 'Cancel an invoice (Admin only)' , inline: false},
        { name: '/invoiceinfo', value: 'Show invoice details' , inline: false},
        { name: '/invoices', value: 'List invoices for a user' , inline: false}
      )
      .setColor('#0af')
      .setFooter({ text: 'Billing Bot' });
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
