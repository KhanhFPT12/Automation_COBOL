const mongoose = require('mongoose');
require('dotenv').config();

const Plan = require('./src/models/Plan');
const Subscription = require('./src/models/Subscription');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB!");

    const subs = await Subscription.find({ user_id: '6a625043e1a9b80dd6973e8c' }).populate('plan_id');
    console.log("Subscriptions for hoangnaoh:");
    subs.forEach(s => {
      console.log({
        id: s._id,
        plan_name: s.plan_name,
        plan_id_name: s.plan_id ? s.plan_id.name : null,
        status: s.status,
        current_period_end: s.current_period_end,
      });
    });
  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.disconnect();
  }
}

run();
