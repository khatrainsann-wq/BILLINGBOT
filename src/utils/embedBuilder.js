const { EmbedBuilder } = require('discord.js');

function buildInvoiceEmbed(cfg, invoice) {
  const color = cfg?.themeColor || '#0af';
  const footer = cfg?.footerText || 'Powered by BillingBot';

  const embed = new EmbedBuilder()
    .setTitle('Invoice')
    .setColor(color)
    .setThumbnail(cfg?.companyLogo)
    .addFields(
      { name: 'Invoice ID', value: invoice.invoiceId, inline: true },
      { name: 'Status', value: invoice.status, inline: true },
      { name: 'Amount', value: `${invoice.amount} ${invoice.currency}`, inline: true },
      { name: 'Product / Service', value: invoice.product || '—', inline: false },
      { name: 'Payment Method', value: invoice.paymentMethod || '—', inline: true },
      { name: 'Due Date', value: invoice.dueDate || 'No due date', inline: true },
      { name: 'Notes', value: invoice.notes || '—', inline: false }
    )
    .setFooter({ text: footer })
    .setTimestamp(invoice.createdAt || new Date());

  return embed;
}

module.exports = { buildInvoiceEmbed };
