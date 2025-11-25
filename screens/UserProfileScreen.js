"use client"
import { useFocusEffect } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"

import Icon from "react-native-vector-icons/Feather"
import ProfileAvatar from "../components/ProfileAvatar"
import { useAuth } from "../contexts1/AuthContext"
import { usePostContext } from "../contexts1/PostContext"
import styles from "../styles/UserProfileStyles"


const { width } = Dimensions.get("window")

// ✅ Smart API URL function
const getApiUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5001"
    }
  }
  return "https://api.artizen.world"
}

const UserProfileScreen = ({ route, navigation }) => {
  const { user: currentUser, setUser } = useAuth() // ✅ include setUser
  const {
  posts,
  toggleLike,
  addComment,
  deleteComment,
  hasMore,
  loading,
  loadMorePosts,
} = usePostContext()
  const { user: passedUser } = route.params
  const [user, setUserProfile] = useState(passedUser?.email ? passedUser : null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [activeCommentBox, setActiveCommentBox] = useState(null)
  const [commentText, setCommentText] = useState("")

  // 🔥 AGGRESSIVE TITLE SETTING - Same as other screens
  useEffect(() => {
    const setTitle = () => {
      if (typeof document !== "undefined") {
        document.title = "Artizen"
      }
    }
    // Set immediately
    setTitle()
    // Set after a small delay to override anything else
    const timer1 = setTimeout(setTitle, 100)
    const timer2 = setTimeout(setTitle, 500)
    const timer3 = setTimeout(setTitle, 1000)
    // Set on focus (when user clicks on tab)
    const handleFocus = () => setTitle()
    window.addEventListener?.("focus", handleFocus)
    // Cleanup
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      window.removeEventListener?.("focus", handleFocus)
    }
  }, [])

  // 🔄 Also set title whenever component re-renders
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "Artizen"
    }
  })

  useEffect(() => {
    if (!user) return
    fetchFollowCounts(user.email)
    checkFollowStatus(user.email)
  }, [user])

  useFocusEffect(
    React.useCallback(() => {
      const email = route?.params?.user?.email
      if (email) {
        setUserProfile(route.params.user)
        fetchFollowCounts(email)
        checkFollowStatus(email)
      }
    }, [route?.params?.user]), // Updated dependency array
  )

  const fetchFollowCounts = async (email) => {
    try {
      const res = await fetch(`${getApiUrl()}/api/auth/user-follow-counts?email=${email}`)
      const data = await res.json()
      setFollowerCount(data.followerCount)
      setFollowingCount(data.followingCount)
    } catch (err) {
      console.error("Count fetch error:", err)
    }
  }

  const checkFollowStatus = async (email) => {
    try {
      const res = await fetch(
        `https://api.artizen.world/api/auth/check-follow?followerId=${currentUser.email}&followingId=${email}`,
      )
      const data = await res.json()
      setIsFollowing(data.following)
    } catch (err) {
      console.error("Check follow error:", err)
    }
  }

  const refreshCurrentUser = async () => {
    try {
      const res = await fetch(`https://api.artizen.world/api/auth/get-user-by-email?email=${currentUser.email}`)
      const data = await res.json()
      if (res.ok && data.user) {
        const followingUsers = data.user.followings || []
        const followingEmails = followingUsers.map((id) => id.email || id)
        const updatedUser = {
          ...currentUser,
          following: followingEmails,
        }
        setUser(updatedUser) // ✅ update context + localStorage
      }
    } catch (err) {
      console.error("❌ Failed to refresh user:", err)
    }
  }

  const toggleFollow = async () => {
    try {
      const res = await fetch(`https://api.artizen.world/api/auth/toggle-follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followerId: currentUser.email,
          followingId: user.email,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Toggle follow failed")
      const newFollowState = data.following
      setIsFollowing(newFollowState)
      setFollowerCount((prev) => (newFollowState ? prev + 1 : Math.max(prev - 1, 0)))
      await refreshCurrentUser() // ✅ ensure WorldScreen updates
    } catch (err) {
      console.error("Follow toggle error:", err)
      Alert.alert("Error", "Could not follow/unfollow user.")
    }
  }

  const confirmDeleteComment = (postId, index) => {
    Alert.alert("Delete Comment", "Are you sure to delete this comment?", [
      { text: "No", style: "cancel" },
      { text: "Yes", style: "destructive", onPress: () => deleteComment(postId, index) },
    ])
  }

  const renderPost = ({ item }) => {
    const isCommentBoxActive = activeCommentBox === item._id
    return (
      <View style={postStyles.postContainer}>
        <Text style={postStyles.postTitle}>{item.title}</Text>
        <Text style={postStyles.postContent}>{item.content}</Text>
        <View style={postStyles.iconRow}>
          <TouchableOpacity style={postStyles.iconButton} onPress={() => toggleLike(item.id || item._id)}>
            <Icon name="thumbs-up" size={20} color={item.liked ? "#007AFF" : "#555"} style={{ marginRight: 6 }} />
            <Text style={[postStyles.iconLabel, { color: item.liked ? "#007AFF" : "#555" }]}>
              Like{item.likes > 0 ? ` (${item.likes})` : ""}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={postStyles.iconButton}
            onPress={() => setActiveCommentBox(isCommentBoxActive ? null : item._id)}
          >
            <Icon
              name="message-circle"
              size={20}
              color={isCommentBoxActive ? "#007AFF" : "#555"}
              style={{ marginRight: 6 }}
            />
            <Text style={[postStyles.iconLabel, { color: isCommentBoxActive ? "#007AFF" : "#555" }]}>
              Comment{item.comments?.length > 0 ? ` (${item.comments.length})` : ""}
            </Text>
          </TouchableOpacity>
        </View>
        {isCommentBoxActive && (
          <>
            <View style={{ marginTop: 10 }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  backgroundColor: "#ffffff",
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 6,
                }}
                placeholder="Write a comment..."
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity
                style={{
                  backgroundColor: "#007AFF",
                  padding: 8,
                  borderRadius: 8,
                  alignItems: "center",
                }}
                onPress={async () => {
                  await addComment(item._id, commentText)
                  setCommentText("")
                }}
              >
                <Text style={{ color: "white" }}>Comment</Text>
              </TouchableOpacity>
            </View>
            {item.comments?.map((cmt, idx) => (
              <View
                key={idx}
                style={{
                  marginTop: 10,
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: "#ffffff",
                  borderColor: "#ccc",
                  borderWidth: 1,
                  position: "relative",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{cmt.fullName}</Text>
                <Text>{cmt.content}</Text>
                {cmt.userEmail === currentUser?.email && (
                  <TouchableOpacity
                    style={{ position: "absolute", top: 6, right: 6 }}
                    onPress={() => confirmDeleteComment(item._id, idx)}
                  >
                    <Icon name="trash" size={16} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </>
        )}
      </View>
    )
  }

async function startChatWithUser(other) {
  try {
    const BASE = getApiUrl()

    // ✅ Robust email resolution (currentUser might be a string in localStorage)
    const myEmail = (currentUser?.email || currentUser || "").trim().toLowerCase()
    const otherEmail = (other?.email || "").trim().toLowerCase()

    if (!myEmail || !otherEmail) {
      console.log("❌ Missing emails:", { myEmail, otherEmail, currentUser, other })
      throw new Error("Missing user emails")
    }

    const tRes = await fetch(`${BASE}/api/chat/threads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Email": myEmail,
      },
      body: JSON.stringify({ userEmail: otherEmail }),
    })

    const tJson = await tRes.json()
    if (!tRes.ok) throw new Error(tJson?.error || `Thread create failed (${tRes.status})`)

    const threadId = tJson?.id || tJson?._id
    if (!threadId) throw new Error("No thread id returned")

    navigation.navigate("ChatUserScreen", { user: other, threadId })
  } catch (e) {
    console.error("startChatWithUser error:", e)
    Alert.alert("Chat error", e.message || "Could not start chat. Please try again.")
  }
}




  if (!user) return null

  return (
    <div
      style={{
        height: "100vh",
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
        
      }}
    >
        <View style={[styles.container, { backgroundColor: "#ffffff", minHeight: "100%" }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Image
              source={require("../assets/icn_arrow_back.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.logoContainer} pointerEvents="none">
            <Image source={require("../assets/logo_artizen.png")} style={styles.logo} resizeMode="contain" />
          </View>
        </View>

        {/* Profile */}
       <View style={styles.emptySquare}>
  <ProfileAvatar
    name={user.fullName}
    imageUrl={user.profileImage}
    // make it fill the square and remove inner border/margin
    style={{ width: "100%", height: "100%", borderRadius: 20 }}
    innerBorder={false}
    marginRight={false}
  />
</View>


        <View style={styles.followContainer}>
          <View style={styles.followItem}>
            <Text style={styles.followNumber}>{followingCount}</Text>
            <Text style={styles.followText}>Followings</Text>
          </View>
          <View style={styles.followItem}>
            <Text style={styles.followNumber}>{followerCount}</Text>
            <Text style={styles.followText}>Followers</Text>
          </View>
        </View>

        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>{user.fullName}</Text>
          {user.bio ? <Text style={styles.profileBio}>{user.bio}</Text> : null}
          {user.link ? <Text style={styles.profileBio}>{user.link}</Text> : null}
         <View style={styles.actionRow}>
  <TouchableOpacity
    style={[styles.editButton, { backgroundColor: isFollowing ? "#ccc" : "#007bff" }]}
    onPress={toggleFollow}
  >
    <Text style={styles.editButtonText}>{isFollowing ? "Following" : "Follow"}</Text>
  </TouchableOpacity>

 <TouchableOpacity
  style={[styles.chatButton, { zIndex: 999, elevation: 999 }]}
  activeOpacity={0.7}
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  onPress={() => {
    console.log("✅ CHAT ICON PRESSED")
    startChatWithUser(user)
  }}
>
  <Image
    source={require("../assets/icn_chat_blue.png")}
    style={styles.chatIcon}
    resizeMode="contain"
  />
</TouchableOpacity>


</View>

          <View style={styles.divider} />
        </View>

        {/* Posts */}
       <FlatList
  style={{ backgroundColor: "#ffffff", flexGrow: 1 }}
  numColumns={2}
  columnWrapperStyle={{ justifyContent: "flex-start" }}
  data={[...posts.filter((post) => post.userEmail === user.email)].sort(
    (a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp),
  )}
  keyExtractor={(item) => item.id || item._id}
  renderItem={renderPost}
  ListEmptyComponent={
    !loading ? (
      <View style={[styles.createPostContainer, { backgroundColor: "#ffffff" }]}>
        <Text style={styles.createPostText}>No Posts Yet</Text>
      </View>
    ) : null
  }
  contentContainerStyle={{ paddingBottom: 90, flexGrow: 1 }}
  keyboardShouldPersistTaps="handled"
  showsVerticalScrollIndicator={false}
  scrollEnabled={false}   // keep your outer div scrolling; fine to leave
  ListFooterComponent={
    hasMore ? (
      <TouchableOpacity
        onPress={loadMorePosts}
        disabled={loading}
        style={{
          marginTop: 20,
          marginBottom: 40,
          alignSelf: "center",
          paddingHorizontal: 18,
          paddingVertical: 10,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#ccc",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={{ marginRight: 6, color: "#333", fontSize: 14 }}>
          {loading ? "Loading..." : "Load more posts"}
        </Text>
        {!loading && <Icon name="chevron-down" size={18} color="#333" />}
      </TouchableOpacity>
    ) : null
  }
/>

      </View>
    </div>
  )
}

export default UserProfileScreen

const postStyles = StyleSheet.create({
  postContainer: {
    marginTop: 20,
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderColor: "#ccc",
    borderWidth: 1,
    position: "relative",
    width: width / 2 - 30,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  postContent: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  iconLabel: {
    fontSize: 14,
  },
})
