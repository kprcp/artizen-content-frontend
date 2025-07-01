const mongoose = require('mongoose'); // ✅ Add this line at the top
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const Notification = require('../models/Notification'); // ✅ Add this line
const Post = require('../models/Post'); // ✅ Import the Post model



// 🔧 Configure transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: { rejectUnauthorized: false },
  logger: true,
  debug: true
});

transporter.verify((err, success) => {
  if (err) console.error("❌ SMTP connection failed:", err);
  else console.log("✅ SMTP ready to deliver messages");
});

// 🛠 Utility to send mail
async function sendMail(to, subject, text) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text
  });
}

// 🔐 Sign Up
router.post('/signup', async (req, res) => {
  const { fullName, email, dob, password } = req.body;
  if (!fullName || !email || !dob || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({
      fullName,
      email: normalizedEmail,
      dob,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
      verificationCodeExpiry: Date.now() + 60 * 60 * 1000
    });

    await newUser.save();

    await sendMail(
      normalizedEmail,
      'Artizen Email Verification Code',
      `Hello ${fullName},\n\nYour verification code is: ${verificationCode}\n\nIt expires in 1 hour.`
    );

    res.status(201).json({ message: 'User created. Verification code sent.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// 📩 Verify Email
router.post('/verify-email', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user || user.verificationCode !== code || user.verificationCodeExpiry < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired verification code.' });
  }

  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiry = undefined;
  await user.save();

  res.json({ message: 'Email successfully verified.' });
});

// 🔄 Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) return res.status(404).json({ error: 'No account found.' });

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetToken = resetCode;
  user.resetTokenExpiry = Date.now() + 60 * 60 * 1000;
  await user.save();

  await sendMail(
    normalizedEmail,
    'Your Artizen Password Reset Code',
    `Your password reset code is: ${resetCode}`
  );

  res.json({ message: 'Reset code sent.' });
});

// ✅ Confirm Reset Code
router.post('/confirm-reset-code', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'Email and code are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user || user.resetToken !== code || user.resetTokenExpiry < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired code.' });
  }

  res.json({ message: 'Code confirmed. You may reset your password.' });
});

// 🔑 Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: 'Missing fields.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user || user.resetToken !== code || user.resetTokenExpiry < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired code.' });
  }

  const hashedNew = await bcrypt.hash(newPassword, 10);
  user.password = hashedNew;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.json({ message: 'Password reset successful.' });
});

// 🔓 Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) return res.status(404).json({ error: 'No account found.' });
    if (!user.isVerified) return res.status(403).json({ error: 'Verify email first.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect password.' });

    // ✅ GET EMAILS of followed users
    const followingUsers = await User.find({ _id: { $in: user.followings } });
    const followingEmails = followingUsers.map(u => u.email);

    res.json({
      message: 'Login successful',
      user: {
        fullName: user.fullName,
        email: user.email,
        dob: user.dob,
        bio: user.bio,
        link: user.link,
        profileImage: user.profileImage,
        following: followingEmails // ✅ this line fixes your filtering
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// 📤 STEP 1 — Request Email Change Code
router.post('/change-email-request', async (req, res) => {
  const { email } = req.body; // ✅ updated from currentEmail to email
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return res.status(400).json({ error: 'Current email is required.' });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.emailChangeCode = code;
    user.emailChangeExpiry = Date.now() + 60 * 60 * 1000;
    await user.save();

    await sendMail(
      normalizedEmail,
      'Artizen Email Change Verification',
      `Hi ${user.fullName},\n\nTo continue changing your email, enter this code in the app:\n\n${code}\n\nThis code expires in 1 hour.`
    );

    res.json({ message: 'Verification code sent to your current email.' });
  } catch (err) {
    console.error('Change email request error:', err);
    res.status(500).json({ error: 'Failed to send verification email.' });
  }
});

// ✅ STEP 2 — Confirm Code & Provide New Email
router.post('/confirm-change-email', async (req, res) => {
  const { email, code, newEmail } = req.body;

  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedNew = newEmail?.trim().toLowerCase();

  if (!normalizedEmail || !code || !normalizedNew) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || user.emailChangeCode !== code || user.emailChangeExpiry < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired code.' });
    }

    const emailTaken = await User.findOne({ email: normalizedNew });
    if (emailTaken) return res.status(409).json({ error: 'New email is already used.' });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.pendingNewEmail = normalizedNew;
    user.newEmailVerificationCode = verifyCode;
    user.newEmailCodeExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    await sendMail(
      normalizedNew,
      'Artizen New Email Verification Code',
      `Hi ${user.fullName},\n\nTo confirm your new email address, use this code:\n\n${verifyCode}\n\nThis code expires in 1 hour.`
    );

    res.json({ message: 'Code sent to new email. Awaiting final confirmation.' });
  } catch (err) {
    console.error('Confirm email change error:', err);
    res.status(500).json({ error: 'Failed to confirm email change.' });
  }
});

// ✅ STEP 3 — Request verification code to new email address
router.post('/request-new-email-verification', async (req, res) => {
  const { oldEmail, newEmail } = req.body;

  if (!oldEmail || !newEmail) {
    return res.status(400).json({ error: 'Both emails are required.' });
  }

  const normalizedOld = oldEmail.trim().toLowerCase();
  const normalizedNew = newEmail.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedOld });
    if (!user) return res.status(404).json({ error: 'Original user not found.' });

    const emailTaken = await User.findOne({ email: normalizedNew });
    if (emailTaken) return res.status(409).json({ error: 'New email is already in use.' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.tempEmail = normalizedNew;
    user.emailChangeCode = code;
    user.emailChangeExpiry = Date.now() + 60 * 60 * 1000;
    await user.save();

    await sendMail(
      normalizedNew,
      'Verify Your New Artizen Email',
      `To confirm your new email address, enter this code:\n\n${code}\n\nThis code expires in 1 hour.`
    );

    res.json({ message: 'Verification code sent to new email.' });
  } catch (err) {
    console.error('New email verification error:', err);
    res.status(500).json({ error: 'Failed to send verification code.' });
  }
});

// ✅ STEP 4 — Confirm code sent to new email & finalize change
router.post('/confirm-new-email-verification', async (req, res) => {
  const { oldEmail, newEmail, code } = req.body;

  if (!oldEmail || !newEmail || !code) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const normalizedOld = oldEmail.trim().toLowerCase();
  const normalizedNew = newEmail.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedOld });

    if (!user ||
        user.tempEmail !== normalizedNew ||
        user.emailChangeCode !== code ||
        user.emailChangeExpiry < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired verification code.' });
    }

    user.email = normalizedNew;
    user.tempEmail = null;
    user.emailChangeCode = null;
    user.emailChangeExpiry = null;
    await user.save();

    res.json({ message: 'New email verified and updated successfully.' });
  } catch (err) {
    console.error('Confirm new email verification error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ✅ ADD: Change Password Route
router.post('/change-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect current password.' });

    const hashedNew = await bcrypt.hash(newPassword, 10);
    user.password = hashedNew;
    await user.save();

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Failed to change password.' });
  }
});

// ✅ ADD: Update Profile Route (Full Name, Bio, Link)
router.post('/update-profile', async (req, res) => {
  const { email, fullName, bio, link } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required.' });

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (fullName !== undefined) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    if (link !== undefined) user.link = link;

    await user.save();

    res.json({ message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// ✅ NEW: Update Profile Image Route
router.post('/update-profile-image', async (req, res) => {
  const { email, profileImage } = req.body;

  if (!email || !profileImage) {
    return res.status(400).json({ error: 'Email and profile image are required.' });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    user.profileImage = profileImage;
    await user.save();

    res.json({ message: 'Profile image updated successfully.', profileImage: user.profileImage });
  } catch (err) {
    console.error('Profile image update error:', err);
    res.status(500).json({ error: 'Failed to update profile image.' });
  }
});

// 🔍 Search users by full name (case-insensitive)
router.get('/search-users', async (req, res) => {
  const q = req.query.q?.trim();
  if (!q) return res.status(400).json({ error: 'Search query required.' });

  try {
    const regex = new RegExp(q, 'i'); // case-insensitive partial match
    const users = await User.find({ fullName: regex })
      .select('fullName email bio profileImage') // return only public info
      .limit(20); // optional: limit results

    res.json(users);
  } catch (err) {
    console.error('Search users error:', err);
    res.status(500).json({ error: 'Server error while searching users.' });
  }
});


// ...all your existing code above remains unchanged...

// ✅ NEW: Fetch follow counts
router.get('/user-follow-counts', async (req, res) => {
  const email = (req.query.email || req.query.userId)?.trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const followerCount = await User.countDocuments({ followings: user._id });
    const followingCount = user.followings?.length || 0;


    res.json({ followerCount, followingCount });
  } catch (err) {
    console.error('Fetch follow counts error:', err);
    res.status(500).json({ error: 'Failed to fetch counts.' });
  }
});

// ✅ NEW: Toggle Follow / Unfollow
router.post('/toggle-follow', async (req, res) => {
  const { followerId, followingId } = req.body;

  if (!followerId || !followingId) {
    return res.status(400).json({ error: 'Both followerId and followingId are required.' });
  }

  try {
    const follower = await User.findOne({ email: followerId });
    const following = await User.findOne({ email: followingId });

    if (!follower || !following) {
      return res.status(404).json({ error: 'User(s) not found.' });
    }

    const followingObjectId = following._id.toString();
    const followerObjectId = follower._id.toString();

    const isFollowing = follower.followings.some(
      (id) => id.toString() === followingObjectId
    );

    if (isFollowing) {
      // Unfollow
      follower.followings = follower.followings.filter(
        (id) => id.toString() !== followingObjectId
      );
      following.followers = following.followers.filter(
        (id) => id.toString() !== followerObjectId
      );
    } else {
      // Follow
      follower.followings.push(following._id);
      following.followers.push(follower._id);

      // ✅ Trigger follow notification
      await Notification.create({
        recipientEmail: following.email,
        senderEmail: follower.email,
        senderName: follower.fullName,
        type: 'follow',
      });
    }

    await follower.save();
    await following.save();

    res.json({ following: !isFollowing });
  } catch (err) {
    console.error('Toggle follow error:', err);
    res.status(500).json({ error: 'Server error while toggling follow.' });
  }
});


// ✅ NEW: Check Follow Status
router.get('/check-follow', async (req, res) => {
  const { followerId, followingId } = req.query;

  if (!followerId || !followingId) {
    return res.status(400).json({ error: 'Both followerId and followingId are required.' });
  }

  try {
    const follower = await User.findOne({ email: followerId });
    const following = await User.findOne({ email: followingId });

    if (!follower || !following) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isFollowing = follower.followings.includes(following._id);
    res.json({ following: isFollowing });
  } catch (err) {
    console.error('Check follow error:', err);
    res.status(500).json({ error: 'Server error while checking follow status.' });
  }
});

// ✅ NEW: Get user by email (used to refresh followings)
router.get('/get-user-by-email', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const followingUsers = await User.find({ _id: { $in: user.followings } });
    const followingEmails = followingUsers.map(u => u.email);

    res.json({
      user: {
        fullName: user.fullName,
        email: user.email,
        bio: user.bio,
        link: user.link,
        profileImage: user.profileImage,
        following: followingEmails
      }
    });
  } catch (err) {
    console.error('Get user by email error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ NEW: Delete Account and Related Posts + Comments
router.post('/delete-account', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required.' });

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // ✅ Delete all posts authored by this user
    await Post.deleteMany({ userEmail: normalizedEmail });

    // ✅ Remove all comments made by this user from any post
    await Post.updateMany(
      {},
      { $pull: { comments: { userEmail: normalizedEmail } } }
    );

    // ✅ 🔥 Add this line to delete notifications
    await Notification.deleteMany({ recipientEmail: normalizedEmail });

    // ✅ Delete the user
    await User.deleteOne({ email: normalizedEmail });

    res.json({ message: 'Account and all associated data deleted.' });
  } catch (err) {
    console.error('Delete account error:', err);
    res.status(500).json({ error: 'Failed to delete account.' });
  }
});



module.exports = router;
