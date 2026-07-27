const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-fix: assign old anonymous logs to the first Admin user
    try {
      const User = require('../models/User');
      const ConversionLog = require('../models/ConversionLog');
      
      const adminUser = await User.findOne({ role: 'ADMIN' });
      if (adminUser) {
        const result = await ConversionLog.updateMany(
          { user: null },
          { $set: { user: adminUser._id } }
        );
        if (result.modifiedCount > 0) {
          console.log(`✅ Fixed ${result.modifiedCount} old anonymous conversion logs.`);
        }
      }
    } catch (fixErr) {
      console.warn('⚠️ Could not auto-fix old conversion logs:', fixErr.message);
    }
    
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
