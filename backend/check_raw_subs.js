const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const Subscription = require('./src/models/Subscription');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB!");

    const subs = await Subscription.find({});
    for (const s of subs) {
      const u = await User.findById(s.user_id);
      console.log({
        user_name: u ? u.fullName : 'Unknown',
        user_email: u ? u.email : 'Unknown',
        sub_id: s._id,
        plan_id: s.plan_id,
        plan_name: s.plan_name,
        status: s.status,
        current_period_end: s.current_period_end,
      });
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.disconnect();
  }
}

run();
