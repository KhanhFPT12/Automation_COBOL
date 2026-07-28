const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const PDFDocument = require('pdfkit');

const INVOICE_STORAGE_DIR = path.resolve(__dirname, '../../storage/invoices');
const FONT_REGULAR_PATH = path.resolve(__dirname, '../assets/fonts/Arial.ttf');
const FONT_BOLD_PATH = path.resolve(__dirname, '../assets/fonts/Arial-Bold.ttf');
const LOGO_PATH = path.resolve(__dirname, '../assets/images/alsm2-logo.png');

const formatMoney = (amount, currency) => {
  if (!amount && amount !== 0) return '0 ₫';
  if (currency === 'VND' || !currency) {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
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
    } catch { /* ignore if plain object */ }
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

    // ─── REGISTER UNICODE FONTS ──────────────────────────────────────────────
    const hasRegularFont = fs.existsSync(FONT_REGULAR_PATH);
    const hasBoldFont = fs.existsSync(FONT_BOLD_PATH);

    if (hasRegularFont && hasBoldFont) {
      doc.registerFont('AppFont', FONT_REGULAR_PATH);
      doc.registerFont('AppFont-Bold', FONT_BOLD_PATH);
    } else {
      doc.registerFont('AppFont', 'Helvetica');
      doc.registerFont('AppFont-Bold', 'Helvetica-Bold');
    }

    // ─── 1. TOP HEADER BANNER (Clean Modern SaaS Light Theme) ────────────────
    // Top 5px Electric Blue Accent Bar
    doc.rect(0, 0, 595.28, 5).fill('#0061FF');

    // Header Background Box (Light Slate Tint so logo pops out)
    doc.rect(0, 5, 595.28, 95).fill('#FAFCFF');
    doc.strokeColor('#E2E8F0').lineWidth(1).moveTo(0, 100).lineTo(595.28, 100).stroke();

    // Draw Group Logo on clean background
    const hasLogo = fs.existsSync(LOGO_PATH);
    if (hasLogo) {
      try {
        doc.image(LOGO_PATH, 40, 18, { height: 48 });
      } catch {
        doc.fontSize(20).font('AppFont-Bold').fillColor('#0F172A').text('ALSM PLATFORM', 40, 24);
      }
    } else {
      doc.fontSize(20).font('AppFont-Bold').fillColor('#0F172A').text('ALSM PLATFORM', 40, 24);
    }

    // Sub-heading Left
    doc.fontSize(8.5).font('AppFont').fillColor('#64748B').text('Automating Legacy System Modernization', 40, 72);

    // Header Right: TAX INVOICE
    doc.fontSize(16).font('AppFont-Bold').fillColor('#0F172A').text('TAX INVOICE', 360, 22, { align: 'right', width: 195 });
    doc.fontSize(9).font('AppFont-Bold').fillColor('#0061FF').text(`Invoice No: #${invoice.invoice_number}`, 360, 46, { align: 'right', width: 195 });
    doc.fontSize(8).font('AppFont').fillColor('#64748B').text('Invoice ID: ' + (invoice._id ? invoice._id.toString() : 'ALSM-INV'), 360, 64, { align: 'right', width: 195 });

    doc.y = 118;

    // ─── 2. METADATA & CUSTOMER CARDS ────────────────────────────────────────
    const metaY = doc.y;

    // Left Box: Customer Details
    doc.rect(40, metaY, 250, 88).fillAndStroke('#F8FAFC', '#E2E8F0');
    doc.fontSize(8.5).font('AppFont-Bold').fillColor('#0F172A').text('BILLED TO:', 52, metaY + 12);
    doc.fontSize(10).font('AppFont-Bold').fillColor('#0061FF').text(customerName, 52, metaY + 28, { width: 226 });
    doc.fontSize(8.5).font('AppFont').fillColor('#475569').text(`Email: ${customerEmail}`, 52, metaY + 45, { width: 226 });
    doc.fontSize(8).font('AppFont').fillColor('#64748B').text('Account ID: ' + (org._id ? org._id.toString() : 'ALSM-USER'), 52, metaY + 62);

    // Right Box: Payment & Status Info
    doc.rect(305, metaY, 250, 88).fillAndStroke('#F8FAFC', '#E2E8F0');
    doc.fontSize(8.5).font('AppFont-Bold').fillColor('#0F172A').text('INVOICE DETAILS:', 317, metaY + 12);
    doc.fontSize(8.5).font('AppFont').fillColor('#475569').text(`Issue Date: ${formatDate(invoice.invoice_date || invoice.created_at)}`, 317, metaY + 28);
    doc.fontSize(8.5).font('AppFont').fillColor('#475569').text(`Due Date: ${formatDate(invoice.due_date)}`, 317, metaY + 43);
    doc.fontSize(8.5).font('AppFont').fillColor('#475569').text(`Payment Ref: ${invoice.payment_reference || 'N/A'}`, 317, metaY + 58);

    // Status Badge Top Right inside Box
    const badgeColor = isPaid ? '#059669' : '#D97706';
    const badgeBg = isPaid ? '#D1FAE5' : '#FEF3C7';
    doc.roundedRect(440, metaY + 10, 105, 18, 9).fillAndStroke(badgeBg, badgeColor);
    doc.fontSize(7.5).font('AppFont-Bold').fillColor(badgeColor).text(statusLabel, 440, metaY + 14, { width: 105, align: 'center' });

    doc.y = metaY + 108;

    // ─── 3. TABLE OF CHARGES ──────────────────────────────────────────────────
    const tableTop = doc.y;

    // Table Header Row
    doc.rect(40, tableTop, 515, 26).fill('#0F172A');
    doc.fontSize(8.5).font('AppFont-Bold').fillColor('#FFFFFF');
    doc.text('#', 50, tableTop + 8, { width: 20 });
    doc.text('DESCRIPTION / SERVICE PLAN', 80, tableTop + 8, { width: 220 });
    doc.text('PERIOD', 300, tableTop + 8, { width: 100 });
    doc.text('QTY', 405, tableTop + 8, { width: 30, align: 'right' });
    doc.text('AMOUNT', 445, tableTop + 8, { width: 100, align: 'right' });

    let currentY = tableTop + 26;

    const items = (invoice.line_items && invoice.line_items.length > 0)
      ? invoice.line_items
      : [{
          description: `Subscription Plan - ${invoice.pending_plan_id?.name || 'Pro Plan'}`,
          quantity: 1,
          amount: invoice.amount || invoice.total,
          period_start: invoice.created_at,
          period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        }];

    items.forEach((item, index) => {
      const rowBg = index % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
      doc.rect(40, currentY, 515, 34).fillAndStroke(rowBg, '#F1F5F9');

      doc.fontSize(8.5).font('AppFont').fillColor('#475569').text(String(index + 1), 50, currentY + 11, { width: 20 });
      doc.fontSize(9).font('AppFont-Bold').fillColor('#0F172A').text(item.description || 'ALSM Code Modernization Service', 80, currentY + 11, { width: 210 });

      const periodText = item.period_start && item.period_end
        ? `${formatDate(item.period_start)} - ${formatDate(item.period_end)}`
        : 'Monthly Billing';
      doc.fontSize(8).font('AppFont').fillColor('#64748B').text(periodText, 300, currentY + 12, { width: 100 });

      doc.fontSize(8.5).font('AppFont').fillColor('#334155').text(String(item.quantity || 1), 405, currentY + 11, { width: 30, align: 'right' });
      doc.fontSize(9).font('AppFont-Bold').fillColor('#0F172A').text(formatMoney(item.amount, invoice.currency), 445, currentY + 11, { width: 100, align: 'right' });

      currentY += 34;
    });

    doc.y = currentY + 15;

    // ─── 4. SUMMARY & TOTALS SECTION ─────────────────────────────────────────
    const summaryY = doc.y;

    // Left Terms / Notes
    doc.fontSize(8.5).font('AppFont-Bold').fillColor('#0F172A').text('PAYMENT TERMS & NOTES:', 40, summaryY);
    doc.fontSize(8).font('AppFont').fillColor('#64748B').text(
      'Thank you for upgrading your subscription on the ALSM Platform.\nCOBOL source code conversion limits are credited automatically upon successful payment.',
      40, summaryY + 14, { width: 260 }
    );

    // Right Summary Table Box
    const totalsX = 320;
    doc.rect(totalsX, summaryY, 235, 90).fillAndStroke('#F8FAFC', '#E2E8F0');

    let sumRowY = summaryY + 10;

    // Subtotal
    doc.fontSize(8.5).font('AppFont').fillColor('#475569').text('Subtotal:', totalsX + 12, sumRowY);
    doc.fontSize(8.5).font('AppFont-Bold').fillColor('#0F172A').text(formatMoney(invoice.amount || invoice.total, invoice.currency), totalsX + 115, sumRowY, { width: 105, align: 'right' });

    sumRowY += 18;
    // Tax
    doc.fontSize(8.5).font('AppFont').fillColor('#475569').text(`Tax (${invoice.tax_rate || 0}% VAT):`, totalsX + 12, sumRowY);
    doc.fontSize(8.5).font('AppFont-Bold').fillColor('#0F172A').text(formatMoney(invoice.tax_amount || 0, invoice.currency), totalsX + 115, sumRowY, { width: 105, align: 'right' });

    sumRowY += 20;
    // Grand Total Banner
    doc.rect(totalsX, sumRowY, 235, 42).fill('#0061FF');
    doc.fontSize(9.5).font('AppFont-Bold').fillColor('#FFFFFF').text('TOTAL PAID:', totalsX + 12, sumRowY + 13);
    doc.fontSize(11).font('AppFont-Bold').fillColor('#FFFFFF').text(formatMoney(invoice.total, invoice.currency), totalsX + 115, sumRowY + 12, { width: 108, align: 'right' });

    // ─── 5. FOOTER BRANDING BANNER ───────────────────────────────────────────
    const footerY = 770;
    doc.strokeColor('#CBD5E1').moveTo(40, footerY).lineTo(555, footerY).stroke();

    doc.fontSize(8).font('AppFont-Bold').fillColor('#0061FF').text('ALSM PLATFORM - AUTOMATING LEGACY SYSTEM MODERNIZATION', 40, footerY + 10, { align: 'center' });
    doc.fontSize(7.5).font('AppFont').fillColor('#94A3B8').text(
      'Support Email: support@alsm.io  |  Website: https://alsm.io  |  Official Automated Computer Generated Document',
      40, footerY + 23, { align: 'center' }
    );

    doc.end();
  });

  return outputPath;
};

module.exports = { generateInvoicePdf, getInvoicePdfPath };
