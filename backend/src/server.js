require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const converterRoutes = require('./routes/converterRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const pricingRoutes = require('./routes/pricingRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const cassoRoutes = require('./routes/cassoRoutes');
const { startMeetingReminderJob } = require('./jobs/meetingReminder');
const { startSubscriptionExpirationJob } = require('./jobs/subscriptionExpiration');
const { startCassoPolling } = require('./services/cassoSubscriptionService');
const { cleanEnvUrl } = require('./utils/env');

const app = express();

// ─── Connect Database ────────────────────────────────────────────
connectDB();
startMeetingReminderJob();
startSubscriptionExpirationJob();
startCassoPolling();

// ─── Security Middleware ─────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: cleanEnvUrl(process.env.CLIENT_URL, 'http://localhost:5173'),
    credentials: true,
  })
);

// ─── Body Parser ─────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── API Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/bms-converter', converterRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/casso', cassoRoutes);

// ─── Health Check ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ALSM API is running',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler ────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

// ─── Start Server ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
