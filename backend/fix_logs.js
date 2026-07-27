const mongoose = require('mongoose');
const ConversionLog = require('./src/models/ConversionLog');
const User = require('./src/models/User');
require('dotenv').config();

async function run() {
  try {
    console.log('Connecting to', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find().select('_id email role');
    console.log('Users:', users);
    
    if (users.length > 0) {
      // Pick the first admin, or first user
      let targetUser = users.find(u => u.role === 'ADMIN') || users[0];
      console.log('Target user for null logs:', targetUser.email);
      
      const result = await ConversionLog.updateMany(
        { user: null },
        { $set: { user: targetUser._id } }
      );
      console.log('Update result:', result);
    }
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();
