// routes/notification.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// 📨 Create a new notification (e.g., like, comment, follow)
router.post('/create', async (req, res) => {
  try {
    const { recipientEmail, senderName, senderEmail, type, postId } = req.body;

    const newNotification = new Notification({
      recipientEmail,
      senderName,
      senderEmail,
      type,
      postId,
      read: false, // ✅ Ensure unread on creation
    });

    await newNotification.save();
    res.status(201).json({ success: true, notification: newNotification });
  } catch (err) {
    console.error('Failed to create notification:', err);
    res.status(500).json({ success: false, error: 'Failed to create notification' });
  }
});

// 📬 Get all notifications for a user AND mark them as read
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const notifications = await Notification.find({ recipientEmail: email }).sort({ createdAt: -1 });

    // ✅ Mark as read after fetch
    await Notification.updateMany(
      { recipientEmail: email, read: false },
      { $set: { read: true } }
    );

    res.json({ success: true, notifications });
  } catch (err) {
    console.error('Failed to fetch notifications:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
  }
});

// 🔴 NEW: Check if there are unread notifications
router.get('/unread/:email', async (req, res) => {
  try {
    const { email } = req.params;

    const count = await Notification.countDocuments({
      recipientEmail: email,
      read: false,
    });

    res.json({ success: true, count });
  } catch (err) {
    console.error('Failed to check unread notifications:', err);
    res.status(500).json({ success: false, error: 'Failed to check unread notifications' });
  }
});

// ❌ Optional: Clear all notifications for a user
router.delete('/clear/:email', async (req, res) => {
  try {
    const { email } = req.params;
    await Notification.deleteMany({ recipientEmail: email });
    res.json({ success: true, message: 'Notifications cleared' });
  } catch (err) {
    console.error('Error clearing notifications:', err);
    res.status(500).json({ success: false, error: 'Failed to clear notifications' });
  }
});

module.exports = router;
