"use client"

// PostContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext"; // ✅ Import to get current user

const PostContext = createContext()

export const PostProvider = ({ children }) => {
  const { user } = useAuth() // ✅ Get logged-in user
  const [posts, setPosts] = useState([])


  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

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
 /* const smartFetch = async (endpoint, options = {}) => {
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
  } */

// ✅ Smart fetch with REAL timeout + fallback to production
const smartFetch = async (endpoint, options = {}) => {
  const apiUrl = getApiUrl()
  const fullUrl = `${apiUrl}${endpoint}`

  // If we're on localhost, try local backend first BUT with a 3s timeout
  if (apiUrl.includes("localhost")) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.log("⏱️ Local backend timed out, aborting:", fullUrl)
      controller.abort()
    }, 3000) // 3 seconds

    try {
      console.log("🔄 Trying local backend:", fullUrl)
      const response = await fetch(fullUrl, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        console.log("✅ Local backend responded successfully")
        return response
      } else {
        console.log("⚠️ Local backend returned non-ok status:", response.status)
      }
    } catch (error) {
      console.log("⚠️ Local backend failed, falling back to production:", error.message)
    }

    // Fallback to production if local fails or times out
    const productionUrl = `https://api.artizen.world${endpoint}`
    console.log("🌐 Using production backend:", productionUrl)
    return fetch(productionUrl, options)
  }

  // 🌐 On the online site (hostname is NOT localhost):
  // getApiUrl() returns "https://api.artizen.world", so we use that directly
  console.log("🌐 Using API:", fullUrl)
  return fetch(fullUrl, options)
}


////LETS SEE IF THE SPEED WILL CHANGE FOR UPLOADING...


  // ✅ Normalize post and calculate "liked" based on user
  const normalizePost = (post) => ({
    _id: post._id || Date.now().toString(),
    title: post.title || "",
    content: post.content || "",
    fullName: post.fullName || "",
    profileImage: post.profileImage || "",
    userEmail: post.userEmail || "", // ✅ add this line
    timestamp: post.timestamp || post.createdAt || null, // ✅ keep server timestamp for correct sorting
    likes: Array.isArray(post.likedBy) ? post.likedBy.length : post.likes || 0,
    liked: Array.isArray(post.likedBy) && user ? post.likedBy.includes(user.email) : false,
    likedBy: post.likedBy || [],
    comments: post.comments || [], // ✅ Include comments array
  })

  const addPost = (post) => {
    setPosts((prev) => [normalizePost(post), ...prev])
  }

 // page = which page from backend
// append = whether to keep old posts and add new ones
const fetchPosts = async (page = 1, append = false) => {
  if (loading) return;                 // avoid double calls
  setLoading(true);

  try {
    // 👇 first load = 10 posts, later loads = 20 posts
    const limit = 10;   // or 20, if you want 20 per page for *all* pages

    console.log(
      "🔄 Fetching posts page",
      page,
      "limit",
      limit,
      "from:",
      getApiUrl()
    );

    const res = await smartFetch(
      `/api/posts/all?page=${page}&limit=${limit}&ts=${Date.now()}`
    );

    if (!res.ok) throw new Error(`posts/all ${res.status}`);

    const data = await res.json(); // { posts: [...], hasMore: true/false }

    if (Array.isArray(data.posts)) {
      const normalized = data.posts.map(normalizePost);

      setPosts(prev =>
        append ? [...prev, ...normalized] : normalized  // ✅ append or replace
      );

      setCurrentPage(page);
      setHasMore(!!data.hasMore);
      console.log(
        `✅ Fetched ${normalized.length} posts (append=${append}) hasMore=${data.hasMore}`
      );
    } else {
      console.warn("⚠️ Unexpected posts response format:", data);
      if (!append) setPosts([]);
    }
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    if (!append) setPosts([]);
  } finally {
    setLoading(false);
  }
};

/* 2️⃣ ADD THIS DIRECTLY UNDER fetchPosts  */
const loadMorePosts = async () => {
  if (loading || !hasMore) return;

  const nextPage = currentPage + 1;

  await fetchPosts(nextPage, true);  // append = true
};


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

  //useEffect(() => {
    //fetchPosts()
  //}, [user]) // 🔁 Refetch when user changes

// 🔥 Fetch once when the provider mounts (covers cold starts / first load)
  useEffect(() => {
    fetchPosts().catch(e => console.error("❌ fetch on mount failed:", e))
  }, [])

  // 🔁 Still refetch when user changes (e.g., login/logout)
  useEffect(() => {
    if (user) fetchPosts().catch(() => {})
  }, [user])

  // 🔄 Optional: refresh when tab gains focus (web)
  useEffect(() => {
    const onFocus = () => fetchPosts().catch(() => {})
    
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", onFocus)
      window.addEventListener?.("focus", onFocus)
      return () => {
        document.removeEventListener("visibilitychange", onFocus)
        window.removeEventListener?.("focus", onFocus)
      }
    }
  }, [])


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
      createPost,

      // 🔽 pagination state & helpers
      currentPage,
      hasMore,
      loading,
      loadMorePosts,

      currentApiUrl: getApiUrl(),
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
