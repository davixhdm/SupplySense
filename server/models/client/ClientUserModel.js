import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const clientUserSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientOrg',
      required: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'user'],
      default: 'user'
    },
 department: {
  type: String,
  enum: ['finance', 'hr', 'procurement', 'sales', 'warehouse', 'management', 'other'],
  default: 'other'
    },
    phone: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      default: null
    },
    verificationTokenExpires: {
      type: Date,
      default: null
    },
    lastLogin: {
      type: Date,
      default: null
    },
    lastLoginIp: {
      type: String,
      default: ''
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: {
      type: Date,
      default: null
    },
    passwordChangedAt: {
      type: Date,
      default: null
    },
    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpires: {
      type: Date,
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClientUser',
      default: null
    }
  },
  { timestamps: true }
);

clientUserSchema.index({ organizationId: 1, email: 1 }, { unique: true });

clientUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  if (this.isNew) return next();
  this.passwordChangedAt = new Date();
  next();
});

clientUserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

clientUserSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > new Date();
};

clientUserSchema.methods.incrementLoginAttempts = async function () {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
  }
  return this.save();
};

clientUserSchema.methods.resetLoginAttempts = async function () {
  this.loginAttempts = 0;
  this.lockUntil = null;
  this.lastLogin = new Date();
  return this.save();
};

clientUserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpires;
  delete obj.verificationToken;
  delete obj.verificationTokenExpires;
  return obj;
};

const ClientUser = mongoose.model('ClientUser', clientUserSchema);

export default ClientUser;