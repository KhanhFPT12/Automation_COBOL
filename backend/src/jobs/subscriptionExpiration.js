const { cancelExpiredSubscriptions } = require('../services/subscriptionService');

const CHECK_INTERVAL_MS = 60 * 1000;

async function checkExpiredSubscriptions() {
  try {
    await cancelExpiredSubscriptions();
  } catch (error) {
    console.warn('subscriptionExpiration job failed:', error.message);
  }
}

function startSubscriptionExpirationJob() {
  void checkExpiredSubscriptions();
  setInterval(checkExpiredSubscriptions, CHECK_INTERVAL_MS);
}

module.exports = { startSubscriptionExpirationJob };
