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
            `https://api.artizen.world/api/auth/get-user-by-email?email=${encodeURIComponent(user.email)}`,
          )
          const userData = await userRes.json()
          if (userRes.ok && userData.user) {
            setUser(userData.user)
          }

          const unreadRes = await fetch(`https://api.artizen.world/api/notifications/unread/${user.email}`)
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

  const renderPost = ({ item }) => {
    const isCommentBoxActive = activeCommentBox === item._id
    const userEmail = (user?.email || "").trim().toLowerCase()
    const postEmail = (item?.userEmail || "").trim().toLowerCase()
    const isOwner = userEmail && postEmail && userEmail === postEmail
    const isFollowed = user?.following?.includes(item.userEmail)

    return (
      <View style={styles.postContainer}>
        {isOwner && (
          <TouchableOpacity style={localStyles.trashButton} onPress={() => confirmDeletePost(item._id)}>
            <Icon name="trash-2" size={20} color="red" />
          </TouchableOpacity>
        )}

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

        {item.profileImage ? (
          <Image source={{ uri: item.profileImage }} style={styles.profilePicSquare} resizeMode="cover" />
        ) : (
          <View style={[styles.profilePicSquare, localStyles.noProfileImageBox]}>
            <Text style={styles.noProfileTextLine}>No</Text>
            <Text style={styles.noProfileTextLine}>Profile</Text>
            <Text style={styles.noProfileTextLine}>Picture</Text>
          </View>
        )}

        {item.fullName && <Text style={styles.fullName}>{item.fullName}</Text>}
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postContent}>{item.content}</Text>

        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => toggleLike(item._id)}>
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
            <View style={{ marginTop: 10, width: "100%" }}>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
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
                  width: "100%",
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: "#f1f1f1",
                  position: "relative",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{cmt.fullName}</Text>
                <Text>{cmt.content}</Text>
                {(cmt.userEmail === user?.email || item.userEmail === user?.email) && (
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
        keyExtractor={(item) => item._id}
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
  trashButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 4,
  },
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
})
