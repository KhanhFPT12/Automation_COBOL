const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const PDFDocument = require('pdfkit');

const INVOICE_STORAGE_DIR = path.resolve(__dirname, '../../storage/invoices');

const formatMoney = (amount, currency) => {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getInvoicePdfPath = (invoiceId) =>
  path.join(INVOICE_STORAGE_DIR, `${invoiceId.toString()}.pdf`);

const generateInvoicePdf = async (invoice) => {
  await fsPromises.mkdir(INVOICE_STORAGE_DIR, { recursive: true });
  const outputPath = getInvoicePdfPath(invoice._id);

  // Populate organization & plan if not populated
  if (invoice.populate) {
    try {
      await invoice.populate('organization_id', 'fullName companyName representativeName email businessEmail');
      await invoice.populate('pending_plan_id', 'name');
    } catch { /* ignore if already populated or plain object */ }
  }

  const org = invoice.organization_id || {};
  const customerEmail = org.email || org.businessEmail || 'customer@alsm.io';
  const customerName = org.fullName || org.companyName || org.representativeName || customerEmail.split('@')[0];

  const { InvoiceStatusNames, InvoiceStatus } = require('../models/Invoice');
  const isPaid = invoice.status === InvoiceStatus.PAID;
  const statusLabel = isPaid ? 'PAID' : (InvoiceStatusNames[invoice.status] || 'PENDING').toUpperCase();

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const output = fs.createWriteStream(outputPath);

    output.on('finish', resolve);
    output.on('error', reject);
    doc.on('error', reject);
    doc.pipe(output);

    // ─── 1. TOP HEADER BANNER (Electric Blue Gradient Accent) ────────────────
    doc.rect(0, 0, 595.28, 90).fill('#0061FF');

    // Branding Text Left
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#FFFFFF').text('ALSM PLATFORM', 40, 26);
    doc.fontSize(9).font('Helvetica').fillColor('#DBEAFE').text('Automating Legacy System Modernization', 40, 52);

    // Header Right: TAX INVOICE
    doc.fontSize(16).font('Helvetica-Bold').fillColor('#FFFFFF').text('TAX INVOICE', 380, 28, { align: 'right', width: 175 });
    doc.fontSize(9).font('Helvetica').fillColor('#DBEAFE').text(`#${invoice.invoice_number}`, 380, 50, { align: 'right', width: 175 });

    doc.y = 110;

    // ─── 2. STATUS & INVOICE METADATA ROW ────────────────────────────────────
    const metaY = doc.y;

    // Left Column: Customer Info
    doc.rect(40, metaY, 250, 85).fillAndStroke('#F8FAFC', '#E2E8F0');
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#0F172A').text('BILLED TO:', 52, metaY + 12);
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#0061FF').text(customerName, 52, metaY + 28);
    doc.fontSize(9).font('Helvetica').fillColor('#475569').text(customerEmail, 52, metaY + 44);
    doc.fontSize(8).font('Helvetica').fillColor('#64748B').text('Account ID: ' + (org._id ? org._id.toString() : 'ALSM-USER'), 52, metaY + 60);

    // Right Column: Invoice Details & Status Badge
    doc.rect(305, metaY, 250, 85).fillAndStroke('#F8FAFC', '#E2E8F0');
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#0F172A').text('INVOICE DETAILS:', 317, metaY + 12);
    doc.fontSize(8.5).font('Helvetica').fillColor('#475569').text(`Issue Date: ${formatDate(invoice.invoice_date || invoice.created_at)}`, 317, metaY + 28);
    doc.fontSize(8.5).font('Helvetica').fillColor('#475569').text(`Due Date: ${formatDate(invoice.due_date)}`, 317, metaY + 42);
    doc.fontSize(8.5).font('Helvetica').fillColor('#475569').text(`Payment Ref: ${invoice.payment_reference || 'N/A'}`, 317, metaY + 56);

    // Status Badge Pill Top Right inside Box
    const badgeColor = isPaid ? '#059669' : '#D97706';
    const badgeBg = isPaid ? '#D1FAE5' : '#FEF3C7';
    doc.roundedRect(485, metaY + 12, 60, 18, 9).fillAndStroke(badgeBg, badgeColor);
    doc.fontSize(8).font('Helvetica-Bold').fillColor(badgeColor).text(statusLabel, 485, metaY + 16, { width: 60, align: 'center' });

    doc.y = metaY + 105;

    // ─── 3. TABLE OF CHARGES ──────────────────────────────────────────────────
    const tableTop = doc.y;

    // Header Row Background
    doc.rect(40, tableTop, 515, 24).fill('#0F172A');
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#FFFFFF');
    doc.text('#', 50, tableTop + 7, { width: 20 });
    doc.text('DESCRIPTION / SERVICE PLAN', 80, tableTop + 7, { width: 230 });
    doc.text('PERIOD', 310, tableTop + 7, { width: 100 });
    doc.text('QTY', 415, tableTop + 7, { width: 35, align: 'right' });
    doc.text('AMOUNT', 460, tableTop + 7, { width: 85, align: 'right' });

    let currentY = tableTop + 24;

    const items = (invoice.line_items && invoice.line_items.length > 0)
      ? invoice.line_items
      : [{
          description: `Subscription Upgrade - ${invoice.pending_plan_id?.name || 'Pro Plan'}`,
          quantity: 1,
          amount: invoice.amount || invoice.total,
          period_start: invoice.created_at,
          period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }];

    items.forEach((item, index) => {
      const rowBg = index % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
      doc.rect(40, currentY, 515, 32).fillAndStroke(rowBg, '#F1F5F9');

      doc.fontSize(8.5).font('Helvetica').fillColor('#475569').text(String(index + 1), 50, currentY + 10, { width: 20 });
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#0F172A').text(item.description || 'Modernization Service', 80, currentY + 10, { width: 220 });

      const periodText = item.period_start && item.period_end
        ? `${formatDate(item.period_start)} - ${formatDate(item.period_end)}`
        : 'Monthly Billing';
      doc.fontSize(8).font('Helvetica').fillColor('#64748B').text(periodText, 310, currentY + 11, { width: 100 });

      doc.fontSize(8.5).font('Helvetica').fillColor('#334155').text(String(item.quantity || 1), 415, currentY + 10, { width: 35, align: 'right' });
      doc.fontSize(9).font('Helvetica-Bold').fillColor('#0F172A').text(formatMoney(item.amount, invoice.currency), 460, currentY + 10, { width: 85, align: 'right' });

      currentY += 32;
    });

    doc.y = currentY + 15;

    // ─── 4. SUMMARY & TOTALS SECTION ─────────────────────────────────────────
    const summaryY = doc.y;

    // Left Note
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#0F172A').text('PAYMENT TERMS & NOTES:', 40, summaryY);
    doc.fontSize(8).font('Helvetica').fillColor('#64748B').text(
      'Thank you for upgrading your ALSM subscription.\nAll service licenses are credited automatically upon successful payment.',
      40, summaryY + 14, { width: 260 }
    );

    // Right Summary Table Box
    const totalsX = 330;
    doc.rect(totalsX, summaryY, 225, 85).fillAndStroke('#F8FAFC', '#E2E8F0');

    let sumRowY = summaryY + 10;

    // Subtotal
    doc.fontSize(8.5).font('Helvetica').fillColor('#475569').text('Subtotal:', totalsX + 15, sumRowY);
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#0F172A').text(formatMoney(invoice.amount || invoice.total, invoice.currency), totalsX + 110, sumRowY, { width: 100, align: 'right' });

    sumRowY += 18;
    // Tax
    doc.fontSize(8.5).font('Helvetica').fillColor('#475569').text(`Tax (${invoice.tax_rate || 0}% VAT):`, totalsX + 15, sumRowY);
    doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#0F172A').text(formatMoney(invoice.tax_amount || 0, invoice.currency), totalsX + 110, sumRowY, { width: 100, align: 'right' });

    sumRowY += 20;
    // Grand Total Banner
    doc.rect(totalsX, sumRowY, 225, 37).fill('#0061FF');
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#FFFFFF').text('TOTAL PAID:', totalsX + 15, sumRowY + 11);
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#FFFFFF').text(formatMoney(invoice.total, invoice.currency), totalsX + 100, sumRowY + 10, { width: 110, align: 'right' });

    // ─── 5. FOOTER BRANDING BANNER ───────────────────────────────────────────
    const footerY = 770;
    doc.strokeColor('#CBD5E1').moveTo(40, footerY).lineTo(555, footerY).stroke();

    doc.fontSize(8).font('Helvetica-Bold').fillColor('#0061FF').text('ALSM PLATFORM - AUTOMATING LEGACY SYSTEM MODERNIZATION', 40, footerY + 10, { align: 'center' });
    doc.fontSize(7.5).font('Helvetica').fillColor('#94A3B8').text(
      'Support Email: support@alsm.io  |  Website: https://alsm.io  |  Official Automated Computer Generated Document',
      40, footerY + 22, { align: 'center' }
    );

    doc.end();
  });

  return outputPath;
};

module.exports = { generateInvoicePdf, getInvoicePdfPath };
