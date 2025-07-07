"use client"

// PostContext.js
import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"; // ✅ Import to get current user

const PostContext = createContext()

export const PostProvider = ({ children }) => {
  const { user } = useAuth() // ✅ Get logged-in user
  const [posts, setPosts] = useState([])

  // ✅ Smart API URL detection - built into PostContext
  const getApiUrl = () => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return "http://localhost:5001"
      }
    }
    return "https://api.artizen.world"
  }

  // ✅ Smart fetch that tries local first, then falls back to production
  const smartFetch = async (endpoint, options = {}) => {
    const apiUrl = getApiUrl()
    const fullUrl = `${apiUrl}${endpoint}`

    // If we're on localhost, try local backend first
    if (apiUrl.includes("localhost")) {
      try {
        console.log("🔄 Trying local backend:", fullUrl)
        const response = await fetch(fullUrl, {
          ...options,
          timeout: 3000, // 3 second timeout for local
        })

        if (response.ok) {
          console.log("✅ Local backend responded successfully")
          return response
        }
      } catch (error) {
        console.log("⚠️ Local backend not available, falling back to production")
        // Fallback to production
        const productionUrl = `https://api.artizen.world${endpoint}`
        console.log("🌐 Using production backend:", productionUrl)
        return fetch(productionUrl, options)
      }
    }

    // Direct production call
    console.log("🌐 Using API:", fullUrl)
    return fetch(fullUrl, options)
  }

  // ✅ Normalize post and calculate "liked" based on user
  const normalizePost = (post) => ({
    _id: post._id || Date.now().toString(),
    title: post.title || "",
    content: post.content || "",
    fullName: post.fullName || "",
    profileImage: post.profileImage || "",
    userEmail: post.userEmail || "", // ✅ add this line
    likes: Array.isArray(post.likedBy) ? post.likedBy.length : post.likes || 0,
    liked: Array.isArray(post.likedBy) && user ? post.likedBy.includes(user.email) : false,
    likedBy: post.likedBy || [],
    comments: post.comments || [], // ✅ Include comments array
  })

  const addPost = (post) => {
    setPosts((prev) => [normalizePost(post), ...prev])
  }

  const fetchPosts = async () => {
    try {
      console.log("🔄 Fetching posts from:", getApiUrl())
      const res = await smartFetch("/api/posts/all")
      const data = await res.json()
      if (Array.isArray(data)) {
        const normalized = data.map(normalizePost)
        setPosts(normalized)
        console.log(`✅ Fetched ${normalized.length} posts successfully`)
      } else {
        console.warn("⚠️ Unexpected posts response format:", data)
      }
    } catch (err) {
      console.error("❌ Error fetching posts:", err)
    }
  }

  const toggleLike = async (id) => {
    if (!user?.email) return
    try {
      const res = await smartFetch(`/api/posts/like/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user.email }),
      })
      const data = await res.json()
      if (res.ok && data.post) {
        const updated = normalizePost(data.post)
        setPosts((prev) => prev.map((p) => (p._id === id ? updated : p)))
      }
    } catch (err) {
      console.error("❌ Error toggling like:", err)
    }
  }

  const deletePost = async (id) => {
    try {
      const res = await smartFetch(`/api/posts/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post._id !== id))
      }
    } catch (err) {
      console.error("❌ Error deleting post:", err)
    }
  }

  // ✅ Add a comment to a post
  const addComment = async (postId, content) => {
    if (!user?.email || !user?.fullName || !content) return
    try {
      const res = await smartFetch(`/api/posts/comment/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          fullName: user.fullName,
          content,
        }),
      })
      const data = await res.json()
      if (res.ok && data.post) {
        const updated = normalizePost(data.post)
        setPosts((prev) => prev.map((p) => (p._id === postId ? updated : p)))
      }
    } catch (err) {
      console.error("❌ Error adding comment:", err)
    }
  }

  // ✅ Delete a comment from a post
  const deleteComment = async (postId, commentIndex) => {
    try {
      const res = await smartFetch(`/api/posts/comment/${postId}/${commentIndex}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (res.ok && data.post) {
        const updated = normalizePost(data.post)
        setPosts((prev) => prev.map((p) => (p._id === postId ? updated : p)))
      } else {
        console.warn("⚠️ Failed to delete comment:", data)
      }
    } catch (err) {
      console.error("❌ Error deleting comment:", err)
    }
  }

  // ✅ NEW: Create a new post function
  const createPost = async (postData) => {
    try {
      console.log("🚀 Creating post with API URL:", getApiUrl())
      const res = await smartFetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })
      const data = await res.json()
      if (res.ok) {
        const newPost = normalizePost(data.post || data)
        setPosts((prev) => [newPost, ...prev])
        console.log("✅ Post created successfully")
        return newPost
      } else {
        throw new Error(data.message || "Failed to create post")
      }
    } catch (err) {
      console.error("❌ Error creating post:", err)
      throw err
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [user]) // 🔁 Refetch when user changes

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
        createPost, // ✅ NEW: Add createPost to context
        currentApiUrl: getApiUrl(), // ✅ NEW: Expose current API URL
      }}
    >
      {children}
    </PostContext.Provider>
  )
}

export const usePostContext = () => useContext(PostContext)

export const usePosts = () => {
  const { posts, fetchPosts, createPost } = usePostContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refreshPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      await fetchPosts()
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  return { posts, loading, error, refreshPosts, createPost }
}
