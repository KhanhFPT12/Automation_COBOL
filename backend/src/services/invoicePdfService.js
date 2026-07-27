const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const PDFDocument = require('pdfkit');

// TODO: Local disk is temporary for development. Before production, upload
// invoice PDFs to Cloudinary (or another object-storage provider), persist the
// provider URL/public ID in pdf_url, and remove the local-file dependency.
const INVOICE_STORAGE_DIR = path.resolve(__dirname, '../../storage/invoices');

const formatMoney = (amount, currency) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

const formatDate = (date) => new Date(date).toLocaleDateString('en-US');

const getInvoicePdfPath = (invoiceId) =>
  path.join(INVOICE_STORAGE_DIR, `${invoiceId.toString()}.pdf`);

const generateInvoicePdf = async (invoice, customerName) => {
  await fsPromises.mkdir(INVOICE_STORAGE_DIR, { recursive: true });
  const outputPath = getInvoicePdfPath(invoice._id);

  await new Promise((resolve, reject) => {
    const document = new PDFDocument({ size: 'A4', margin: 50 });
    const output = fs.createWriteStream(outputPath);

    output.on('finish', resolve);
    output.on('error', reject);
    document.on('error', reject);
    document.pipe(output);

    // --- LOGO ---
    const logoPath = path.resolve(__dirname, '../../../frontend/public/images/alsm2-logo.png');
    try {
      if (fs.existsSync(logoPath)) {
        document.image(logoPath, 50, 40, { width: 110 });
        document.moveDown(4);
      }
    } catch (e) { /* logo not found, skip */ }
    document.moveDown(1);

    // --- HEADER ---
    document.fontSize(24).fillColor('#0f172a').text('INVOICE', { align: 'right' });
    document.moveDown(0.5);
    document.fontSize(10).fillColor('#475569').text('Bill To:');
    document.fontSize(12).fillColor('#0f172a').text(customerName || 'Valued Customer');
    document.moveDown(0.5);
    document.fontSize(10).fillColor('#475569');
    document.text(`Invoice number: ${invoice.invoice_number}`);
    document.text(`Invoice date: ${formatDate(invoice.invoice_date)}`);
    document.text(`Due date: ${formatDate(invoice.due_date)}`);
    const { InvoiceStatusNames } = require('../models/Invoice');
    const statusText = (InvoiceStatusNames[invoice.status] || 'draft').toUpperCase();
    document.text(`Status: ${statusText}`);

    document.moveDown(2);
    document.fontSize(13).fillColor('#0f172a').text('Description', 50, document.y, { continued: true });
    document.text('Quantity', 330, document.y, { width: 70, align: 'right', continued: true });
    document.text('Amount', 420, document.y, { width: 125, align: 'right' });
    document.moveDown(0.5);
    document.strokeColor('#cbd5e1').moveTo(50, document.y).lineTo(545, document.y).stroke();
    document.moveDown(0.75);

    invoice.line_items.forEach((item) => {
      const rowY = document.y;
      document.fontSize(10).fillColor('#334155').text(item.description, 50, rowY, { width: 260 });
      document.text(String(item.quantity), 330, rowY, { width: 70, align: 'right' });
      document.text(formatMoney(item.amount, invoice.currency), 420, rowY, { width: 125, align: 'right' });
      document.fontSize(8).fillColor('#64748b').text(
        `${formatDate(item.period_start)} - ${formatDate(item.period_end)}`,
        50,
        document.y + 2,
        { width: 260 }
      );
      document.moveDown(1.25);
    });

    document.moveDown();
    const totalsX = 350;
    document.fontSize(10).fillColor('#475569');
    document.text('Subtotal', totalsX, document.y, { continued: true });
    document.text(formatMoney(invoice.amount, invoice.currency), 420, document.y, { width: 125, align: 'right' });
    document.text(`Tax (${invoice.tax_rate}%)`, totalsX, document.y, { continued: true });
    document.text(formatMoney(invoice.tax_amount, invoice.currency), 420, document.y, { width: 125, align: 'right' });
    document.moveDown(0.5);
    document.fontSize(13).fillColor('#0f172a').text('Total', totalsX, document.y, { continued: true });
    document.text(formatMoney(invoice.total, invoice.currency), 420, document.y, { width: 125, align: 'right' });

    document.moveDown(3);
    document.fontSize(9).fillColor('#64748b').text('Thank you for your business.', { align: 'center' });
    document.end();
  });

  return outputPath;
};

module.exports = { generateInvoicePdf, getInvoicePdfPath };
