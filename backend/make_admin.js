const mongoose = require('mongoose');
const User = require('./src/models/User'); 

const MONGODB_URI = 'mongodb://127.0.0.1:27017/alsm';

async function makeAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@admin.com';
    const password = 'password123';

    let user = await User.findOne({ email });

    if (!user) {
      console.log('Admin user not found, creating a new one...');
      // By default the model hashes password in pre-save hook
      user = new User({
        fullName: 'System Admin',
        email: email,
        password: password,
        phone: '0123456789',
        accountType: 'INDIVIDUAL',
        role: 'ADMIN',
        isEmailVerified: true,
        isActive: true
      });
      await user.save();
      console.log(`Created new admin account. Email: ${email} / Password: ${password}`);
    } else {
      console.log('Admin user found, updating role to ADMIN and verifying email...');
      user.role = 'ADMIN';
      user.isEmailVerified = true;
      user.isActive = true;
      await user.save({ validateBeforeSave: false });
      console.log(`Updated existing user ${email} to ADMIN.`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

makeAdmin();
