const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  dob:      { type: String, required: true },
  password: { type: String, required: true },

  // ✅ Added for Edit Profile
  bio:  { type: String, default: '' },
  link: { type: String, default: '' },

  // ✅ NEW: Profile Image
  profileImage: { type: String, default: '' }, // <-- Added

  // ✅ Email verification
  verificationCode:       { type: String, default: null },
  verificationCodeExpiry: { type: Date,   default: null },
  isVerified:             { type: Boolean, default: false },

  // ✅ Forgot password
  resetToken:       { type: String, default: null },
  resetTokenExpiry: { type: Date,   default: null },

  // ✅ Email change flow (Step 1 & 2)
  tempEmail:         { type: String, default: null },
  emailChangeCode:   { type: String, default: null },
  emailChangeExpiry: { type: Date,   default: null },

  // ✅ New Email Verification (Step 3 & 4)
  pendingNewEmail:          { type: String, default: null },
  newEmailVerificationCode: { type: String, default: null },
  newEmailCodeExpires:      { type: Date,   default: null },

  // ✅ Social Relationships
  followers:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

}, { timestamps: true });

// ✅ Hide sensitive/internal fields when sending user object
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.verificationCode;
    delete ret.verificationCodeExpiry;
    delete ret.resetToken;
    delete ret.resetTokenExpiry;
    delete ret.emailChangeCode;
    delete ret.emailChangeExpiry;
    delete ret.tempEmail;
    delete ret.pendingNewEmail;
    delete ret.newEmailVerificationCode;
    delete ret.newEmailCodeExpires;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
