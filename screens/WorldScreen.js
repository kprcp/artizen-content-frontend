"use client"

// WorldScreen.js
import { useFocusEffect } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import { Alert, FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { useAuth } from "../contexts1/AuthContext"
import { usePostContext } from "../contexts1/PostContext"
import styles from "../styles/WorldStyles"

const WorldScreen = ({ navigation }) => {
  const { posts, toggleLike, addComment, deleteComment, deletePost, fetchPosts } = usePostContext()
  const { user, setUser } = useAuth()
  const [menuVisibleId, setMenuVisibleId] = useState(null)
  const [activeCommentBox, setActiveCommentBox] = useState(null)
  const [commentText, setCommentText] = useState("")
  const [hasUnread, setHasUnread] = useState(false) // ✅ New state

  // ✅ Smart API URL detection
  const getApiUrl = () => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return "http://localhost:5001"
      }
    }
    return "https://api.artizen.world"
  }

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

  useFocusEffect(
    React.useCallback(() => {
      const refreshData = async () => {
        try {
          const userRes = await fetch(
            `${getApiUrl()}/api/auth/get-user-by-email?email=${encodeURIComponent(user.email)}`,
          )
          const userData = await userRes.json()
          if (userRes.ok && userData.user) {
            setUser(userData.user)
          }

          const unreadRes = await fetch(`${getApiUrl()}/api/notifications/unread/${user.email}`)
          const unreadData = await unreadRes.json()
          if (unreadData.success) {
            setHasUnread(unreadData.count > 0)
          }
        } catch (err) {
          console.error("❌ Failed to refresh:", err)
        }
        fetchPosts()
      }

      refreshData()
    }, [user?.email]),
  )

  const confirmDeletePost = (id) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure to delete this post?")
      if (confirmed) deletePost(id)
    } else {
      Alert.alert("Delete Post", "Are you sure to delete this post?", [
        { text: "No", style: "cancel" },
        { text: "Yes", style: "destructive", onPress: () => deletePost(id) },
      ])
    }
  }

  const confirmDeleteComment = (postId, index) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure to delete this comment?")
      if (confirmed) deleteComment(postId, index)
    } else {
      Alert.alert("Delete Comment", "Are you sure to delete this comment?", [
        { text: "No", style: "cancel" },
        { text: "Yes", style: "destructive", onPress: () => deleteComment(postId, index) },
      ])
    }
  }

  const handleReport = (id) => {
    setMenuVisibleId(null)
    alert("Reported post: " + id)
  }

  // ✅ Handle delete from 3-dot menu (for user's own posts)
  const handleDeleteFromMenu = (id) => {
    setMenuVisibleId(null) // Close menu first
    confirmDeletePost(id) // Then show confirmation
  }

  // ✅ Helper function to get the current profile image for any user
  const getCurrentProfileImage = (postUserEmail) => {
    // If this post belongs to the current logged-in user, use their latest profile image
    if (postUserEmail === user?.email) {
      return user.profileImage
    }
    // For other users, we'd need to fetch their latest data, but for now return the cached image
    // You could enhance this by maintaining a cache of all users' latest profile images
    return null
  }

  const renderPost = ({ item }) => {
    const isCommentBoxActive = activeCommentBox === item._id
    const userEmail = (user?.email || "").trim().toLowerCase()
    const postEmail = (item?.userEmail || "").trim().toLowerCase()
    const isOwner = userEmail && postEmail && userEmail === postEmail
    const isFollowed = user?.following?.includes(item.userEmail)

    // ✅ Get the current profile image (prioritize live user data over cached post data)
    const currentProfileImage = getCurrentProfileImage(item.userEmail) || item.profileImage

    return (
      <View style={[styles.postContainer, localStyles.postContainerOverride]}>
        {/* ✅ Show 3-dot menu for user's own posts with Delete option */}
        {isOwner && (
          <>
            <TouchableOpacity
              style={localStyles.threeDotsButton}
              onPress={() => setMenuVisibleId(menuVisibleId === item._id ? null : item._id)}
            >
              <Icon name="more-vertical" size={20} color="#555" />
            </TouchableOpacity>
            {menuVisibleId === item._id && (
              <View style={localStyles.dropdownMenu}>
                <TouchableOpacity onPress={() => handleDeleteFromMenu(item._id)}>
                  <Text style={localStyles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* ✅ Show 3-dot menu for followed users' posts with Report option */}
        {!isOwner && isFollowed && (
          <>
            <TouchableOpacity
              style={localStyles.threeDotsButton}
              onPress={() => setMenuVisibleId(menuVisibleId === item._id ? null : item._id)}
            >
              <Icon name="more-vertical" size={20} color="#555" />
            </TouchableOpacity>
            {menuVisibleId === item._id && (
              <View style={localStyles.dropdownMenu}>
                <TouchableOpacity onPress={() => handleReport(item._id)}>
                  <Text style={localStyles.reportText}>Report</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {/* ✅ Use current profile image instead of cached post image */}
        {currentProfileImage ? (
          <Image
            source={{ uri: currentProfileImage }}
            style={styles.profilePicSquare}
            resizeMode="cover"
            key={`${item._id}-${currentProfileImage}`} // ✅ Force re-render when image changes
          />
        ) : (
          <View style={[styles.profilePicSquare, localStyles.noProfileImageBox]}>
            <Text style={styles.noProfileTextLine}>No</Text>
            <Text style={styles.noProfileTextLine}>Profile</Text>
            <Text style={styles.noProfileTextLine}>Picture</Text>
          </View>
        )}

        {/* ✅ Use current user's name if it's their post */}
        {isOwner ? (
          <Text style={styles.fullName}>{user.fullName}</Text>
        ) : (
          item.fullName && <Text style={styles.fullName}>{item.fullName}</Text>
        )}

        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postContent}>{item.content}</Text>

        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => toggleLike(item.id || item._id)}>
            <Icon name="thumbs-up" size={20} color={item.liked ? "#007AFF" : "#555"} style={{ marginRight: 6 }} />
            <Text style={[styles.iconLabel, { color: item.liked ? "#007AFF" : "#555" }]}>
              Like{item.likes > 0 ? ` (${item.likes})` : ""}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setActiveCommentBox(isCommentBoxActive ? null : item._id)}
          >
            <Icon
              name="message-circle"
              size={20}
              color={isCommentBoxActive ? "#007AFF" : "#555"}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.iconLabel, { color: isCommentBoxActive ? "#007AFF" : "#555" }]}>
              Comment{item.comments?.length > 0 ? ` (${item.comments.length})` : ""}
            </Text>
          </TouchableOpacity>
        </View>

        {isCommentBoxActive && (
          <>
            <View style={localStyles.commentBoxContainer}>
              <TextInput
                style={localStyles.commentInput}
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
                  await addComment(item.id || item._id, commentText)
                  setCommentText("")
                }}
              >
                <Text style={{ color: "white" }}>Comment</Text>
              </TouchableOpacity>
            </View>
            {item.comments?.map((cmt, idx) => (
              <View key={idx} style={localStyles.commentContainer}>
                <Text style={{ fontWeight: "bold" }}>{cmt.fullName}</Text>
                <Text>{cmt.content}</Text>
                {(cmt.userEmail === user?.email || item.userEmail === user?.email) && (
                  <>
                    <TouchableOpacity
                      style={{ position: "absolute", top: 6, right: 6, padding: 2 }}
                      onPress={() =>
                        setMenuVisibleId(
                          menuVisibleId === `comment-${item._id}-${idx}` ? null : `comment-${item._id}-${idx}`,
                        )
                      }
                    >
                      <Icon name="more-vertical" size={14} color="#555" />
                    </TouchableOpacity>
                    {menuVisibleId === `comment-${item._id}-${idx}` && (
                      <View style={[localStyles.dropdownMenu, { top: 25, right: 6 }]}>
                        <TouchableOpacity
                          onPress={() => {
                            setMenuVisibleId(null)
                            confirmDeleteComment(item._id, idx)
                          }}
                        >
                          <Text style={localStyles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                )}
              </View>
            ))}
          </>
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/logo_artizen.png")} style={styles.logo} resizeMode="contain" />
        </View>
        <TouchableOpacity
          style={localStyles.notificationButton}
          onPress={() => {
            setHasUnread(false)
            navigation.navigate("Notifications")
          }}
        >
          <Icon name="bell" size={22} color="#333" />
          {hasUnread && <View style={localStyles.redDot} />}
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts.filter((post) => user?.following?.includes(post.userEmail) || post.userEmail === user?.email)}
        renderItem={renderPost}
        keyExtractor={(item) => item.id || item._id}
        style={{ flex: 1 }}
        contentContainerStyle={[styles.feedContainer, { paddingBottom: 80 }]} // optional extra spacing
        ListEmptyComponent={<Text style={{ marginTop: 50, fontSize: 16, color: "#888" }}>No posts yet.</Text>}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default WorldScreen

const localStyles = StyleSheet.create({
  threeDotsButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 4,
  },
  dropdownMenu: {
    position: "absolute",
    top: 35,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    zIndex: 10,
    elevation: 5,
  },
  reportText: {
    color: "red",
    fontSize: 14,
    fontWeight: "600",
  },
  // ✅ Added delete text style for user's own posts
  deleteText: {
    color: "red",
    fontSize: 14,
    fontWeight: "600",
  },
  notificationButton: {
    position: "absolute",
    right: 15,
    top: 22,
  },
  redDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },
  noProfileImageBox: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  postContainerOverride: {
    backgroundColor: "#ffffff", // ✅ Changed from gray to white
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0", // Light gray border for definition
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // For Android shadow
  },
  commentBoxContainer: {
    marginTop: 10,
    width: "100%",
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 8,
    marginBottom: 6,
  },
  commentContainer: {
    marginTop: 10,
    width: "100%",
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderColor: "#ccc",
    borderWidth: 1,
    position: "relative",
  },
})
