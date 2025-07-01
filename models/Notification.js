// models/Notification.js
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipientEmail: String, // who should receive the notification
  senderName: String,     // who triggered it
  senderEmail: String,
  type: String,           // 'like', 'comment', 'follow'
  postId: String,         // optional, for like/comment
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', NotificationSchema);
