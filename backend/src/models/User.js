const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // ─── INDIVIDUAL fields ───────────────────────────────────────
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      // sparse: multiple docs can have null, but non-null values must be unique
      unique: true,
      sparse: true,
    },

    // ─── ENTERPRISE fields ───────────────────────────────────────
    companyName: {
      type: String,
      trim: true,
    },
    businessEmail: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    representativeName: { type: String, trim: true },
    representativePosition: { type: String, trim: true },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+', null],
      default: null,
    },
    industry: { type: String, trim: true },
    legacySystemType: [{ type: String, trim: true }],
    targetTechStack: [{ type: String, trim: true }],

    // ─── COMMON fields ───────────────────────────────────────────
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    accountType: {
      type: String,
      enum: ['INDIVIDUAL', 'ENTERPRISE'],
      required: [true, 'Account type is required'],
    },
    role: {
      type: String,
      // ADMIN = ALSM platform staff (manages all users/meetings), distinct
      // from ENTERPRISE_ADMIN which is just the representative of one
      // customer's enterprise account.
      enum: ['USER', 'ENTERPRISE_ADMIN', 'ADMIN'],
      required: [true, 'Role is required'],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // ─── Account status (admin lock/unlock) ──────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },

    // ─── Usage stats (surfaced in the Admin Dashboard) ───────────
    convertCount: {
      type: Number,
      default: 0,
    },
    credits: {
      type: Number,
      default: null,
    },
    avatarUrl: {
      type: String,
      default: null,
    },

    // ─── Token fields (hidden from normal queries) ───────────────
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

// ─── Enforce role based on accountType (extra security layer) ────
// ADMIN is granted out-of-band (see promoteIfAdminEmail below) and must
// never be clobbered back to USER/ENTERPRISE_ADMIN by this hook.
userSchema.pre('save', function (next) {
  if (this.role !== 'ADMIN' && (this.isModified('accountType') || this.isNew)) {
    if (this.accountType === 'INDIVIDUAL') this.role = 'USER';
    if (this.accountType === 'ENTERPRISE') this.role = 'ENTERPRISE_ADMIN';
  }
  next();
});

// ─── Promote to platform ADMIN if the email is listed in ADMIN_EMAILS ────
userSchema.pre('save', function (next) {
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const candidateEmail = (this.email || this.businessEmail || '').toLowerCase();
  if (candidateEmail && adminEmails.includes(candidateEmail)) {
    this.role = 'ADMIN';
  }
  next();
});

// ─── Hash password before saving ────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── Instance method: compare password ──────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Remove sensitive fields from JSON output ────────────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpires;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
