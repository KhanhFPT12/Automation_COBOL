require('dotenv').config();
const mongoose = require('mongoose');
const Invoice = require('./src/models/Invoice');

(async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/alsm';
    console.log('Connecting to Mongo:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected!');

    const allInvoices = await Invoice.find({}).lean();
    console.log('Total invoices in DB:', allInvoices.length);
    console.log('Invoices list:');
    allInvoices.forEach(inv => {
      console.log(`- ID: ${inv._id}, Num: ${inv.invoice_number}, Status: ${inv.status} (type: ${typeof inv.status}), Total: ${inv.total} (type: ${typeof inv.total})`);
    });

    const paymentStats = await Invoice.aggregate([
      { $match: { status: 2 } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    console.log('Aggregation result (status = 2):', paymentStats);

    const paymentStatsString = await Invoice.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
    ]);
    console.log('Aggregation result (status = "paid"):', paymentStatsString);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
})();
