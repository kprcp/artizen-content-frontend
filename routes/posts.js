const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification'); // ✅ Import Notification model

// ✅ Create a post
router.post('/', async (req, res) => {
  try {
    const {
      title,
      content,
      userEmail,
      fullName,
      profileImage,
      timestamp,
    } = req.body;

    if (!title || !content || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userExists = await User.findOne({ email: userEmail });
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newPost = new Post({
      title,
      content,
      userEmail,
      fullName,
      profileImage,
      timestamp: timestamp || new Date(),
    });

    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    console.error('❌ Error creating post:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get all posts
router.get('/all', async (req, res) => {
  try {
    const { userEmail } = req.query;
    const filter = userEmail ? { userEmail } : {};
    const posts = await Post.find(filter).sort({ timestamp: -1 });

    console.log('📦 Posts sent to client:', posts.map(p => ({
      id: p._id,
      title: p.title,
      userEmail: p.userEmail,
      fullName: p.fullName
    })));

    const enriched = posts.map(post => ({
      ...post.toObject(),
      id: post._id,
      likes: post.likedBy?.length || 0,
    }));

    res.json(enriched);
  } catch (err) {
    console.error('❌ Error fetching posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// ✅ NEW: Add comment to a post
router.post('/comment/:id', async (req, res) => {
  try {
    const { userEmail, fullName, content } = req.body;
    if (!userEmail || !fullName || !content) {
      return res.status(400).json({ error: 'Missing comment fields' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = {
      userEmail,
      fullName,
      content,
      timestamp: new Date(),
    };

    if (!post.comments) post.comments = [];
    post.comments.push(comment);
    await post.save();

    // ✅ Trigger comment notification
    if (post.userEmail !== userEmail) {
      await Notification.create({
        recipientEmail: post.userEmail,
        senderEmail: userEmail,
        senderName: fullName,
        type: 'comment',
        postId: post._id,
      });
    }

    res.json({ message: 'Comment added', post });
  } catch (err) {
    console.error('❌ Error adding comment:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// ✅ NEW: Delete a specific comment from a post
router.delete('/comment/:postId/:commentIndex', async (req, res) => {
  try {
    const { postId, commentIndex } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const index = parseInt(commentIndex);
    if (isNaN(index) || index < 0 || index >= post.comments.length) {
      return res.status(400).json({ error: 'Invalid comment index' });
    }

    post.comments.splice(index, 1);
    await post.save();

    res.json({ message: 'Comment deleted', post });
  } catch (err) {
    console.error('❌ Error deleting comment:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// ✅ DELETE a post by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting post:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// ✅ Toggle like on a post by userEmail
router.post('/like/:id', async (req, res) => {
  try {
    const { userEmail } = req.body;
    if (!userEmail) {
      return res.status(400).json({ error: 'Missing userEmail in body' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const likedIndex = post.likedBy.indexOf(userEmail);
    const isLiking = likedIndex === -1;

    if (!post.likedBy) post.likedBy = [];

    if (isLiking) {
      post.likedBy.push(userEmail);
    } else {
      post.likedBy.splice(likedIndex, 1);
    }

    await post.save();

    // ✅ Trigger like notification
    if (isLiking && post.userEmail !== userEmail) {
      const user = await User.findOne({ email: userEmail });
      await Notification.create({
        recipientEmail: post.userEmail,
        senderEmail: userEmail,
        senderName: user?.fullName || 'Someone',
        type: 'like',
        postId: post._id,
      });
    }

    res.json({
      message: 'Like status updated',
      post: {
        ...post.toObject(),
        likes: post.likedBy.length,
        likedBy: post.likedBy,
      },
    });
  } catch (err) {
    console.error('❌ Error updating like:', err);
    res.status(500).json({ error: 'Failed to update like' });
  }
});

module.exports = router;
