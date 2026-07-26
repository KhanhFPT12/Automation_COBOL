const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/alsm';

// Minimal Plan Schema Definition just to insert the starter plan
const PlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  is_active: { type: Boolean, default: true }
}, { strict: false });

const Plan = mongoose.model('Plan', PlanSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if starter plan exists
    const existing = await Plan.findOne({ slug: 'starter' });
    if (!existing) {
      await Plan.create({
        name: 'Starter',
        slug: 'starter',
        description: 'Default free starter plan',
        price: 0,
        is_active: true
      });
      console.log('Successfully inserted Starter plan!');
    } else {
      console.log('Starter plan already exists.');
    }
  } catch (error) {
    console.error('Error seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

seed();
