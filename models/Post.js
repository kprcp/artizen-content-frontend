// models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true, // ✅ This ensures fullName is saved with post
  },
  profileImage: {
    type: String, // URL or base64 string
    required: false, // ✅ Optional, included if available
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  likedBy: {
    type: [String], // ✅ List of user emails who liked the post
    default: [],
  },

  // ✅ Comments support added
  comments: [
    {
      userEmail: String,
      fullName: String,
      content: String,
      timestamp: { type: Date, default: Date.now },
    }
  ],
});

module.exports = mongoose.model('Post', PostSchema);
