// PostContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext'; // ✅ Import to get current user

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { user } = useAuth(); // ✅ Get logged-in user
  const [posts, setPosts] = useState([]);

  // ✅ Normalize post and calculate "liked" based on user
  const normalizePost = (post) => ({
    _id: post._id || Date.now().toString(),
    title: post.title || '',
    content: post.content || '',
    fullName: post.fullName || '',
    profileImage: post.profileImage || '',
    userEmail: post.userEmail || '', // ✅ add this line
    likes: Array.isArray(post.likedBy) ? post.likedBy.length : post.likes || 0,
    liked: Array.isArray(post.likedBy) && user ? post.likedBy.includes(user.email) : false,
    likedBy: post.likedBy || [],
    comments: post.comments || [], // ✅ Include comments array
  });

  const addPost = (post) => {
    setPosts((prev) => [normalizePost(post), ...prev]);
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('https://artizen-backend.onrender.com/api/posts/all');
      const data = await res.json();
      if (Array.isArray(data)) {
        const normalized = data.map(normalizePost);
        setPosts(normalized);
      } else {
        console.warn('⚠️ Unexpected posts response format:', data);
      }
    } catch (err) {
      console.error('❌ Error fetching posts:', err);
    }
  };

  const toggleLike = async (id) => {
    if (!user?.email) return;
    try {
      const res = await fetch(`https://artizen-backend.onrender.com/api/posts/like/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user.email }),
      });
      const data = await res.json();

      if (res.ok && data.post) {
        const updated = normalizePost(data.post);
        setPosts((prev) =>
          prev.map((p) => (p._id === id ? updated : p))
        );
      }
    } catch (err) {
      console.error('❌ Error toggling like:', err);
    }
  };

  const deletePost = async (id) => {
    try {
      const res = await fetch(`https://artizen-backend.onrender.com/api/posts/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post._id !== id));
      }
    } catch (err) {
      console.error('❌ Error deleting post:', err);
    }
  };

  // ✅ Add a comment to a post
  const addComment = async (postId, content) => {
    if (!user?.email || !user?.fullName || !content) return;
    try {
      const res = await fetch(`https://artizen-backend.onrender.com/api/posts/comment/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          fullName: user.fullName,
          content,
        }),
      });

      const data = await res.json();

      if (res.ok && data.post) {
        const updated = normalizePost(data.post);
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? updated : p))
        );
      }
    } catch (err) {
      console.error('❌ Error adding comment:', err);
    }
  };

  // ✅ Delete a comment from a post
  const deleteComment = async (postId, commentIndex) => {
    try {
      const res = await fetch(`https://artizen-backend.onrender.com/api/posts/comment/${postId}/${commentIndex}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok && data.post) {
        const updated = normalizePost(data.post);
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? updated : p))
        );
      } else {
        console.warn('⚠️ Failed to delete comment:', data);
      }
    } catch (err) {
      console.error('❌ Error deleting comment:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]); // 🔁 Refetch when user changes

  return (
    <PostContext.Provider
      value={{
        posts,
        addPost,
        fetchPosts,
        toggleLike,
        deletePost,
        addComment,
        deleteComment,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => useContext(PostContext);
