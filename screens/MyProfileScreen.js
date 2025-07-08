"use client"
import { useFocusEffect } from "@react-navigation/native"
import * as ImagePicker from "expo-image-picker"
import React, { useEffect, useState } from "react"
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { useAuth } from "../contexts1/AuthContext"
import { usePostContext } from "../contexts1/PostContext"
import { styles } from "../styles/MyProfileStyles"

const { width } = Dimensions.get("window")

const MyProfileScreen = ({ navigation }) => {
  const { posts, toggleLike, deletePost, addComment, deleteComment } = usePostContext()
  const { user, setUser } = useAuth()
  const [imageUri, setImageUri] = useState(null)
  const [activeCommentBox, setActiveCommentBox] = useState(null)
  const [commentText, setCommentText] = useState("")
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [menuVisibleId, setMenuVisibleId] = useState(null)
  // ✅ Add loading states like EditProfileScreen
  const [imageUploading, setImageUploading] = useState(false)

  // ✅ Smart API URL detection - same as EditProfileScreen and PostContext
  const getApiUrl = () => "https://api.artizen.world"


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

  const fetchCounts = async () => {
    try {
      // ✅ Use smart API URL detection
      const res = await fetch(`${getApiUrl()}/api/auth/user-follow-counts?email=${user.email}`)
      const data = await res.json()
      if (res.ok) {
        setFollowerCount(data.followerCount || 0)
        setFollowingCount(data.followingCount || 0)
      }
    } catch (err) {
      console.error("❌ Failed to fetch follow counts:", err)
    }
  }

  useEffect(() => {
    if (user?.profileImage) {
      setImageUri(user.profileImage)
    }
    if (user?.email) fetchCounts()
  }, [user])

  useFocusEffect(
    React.useCallback(() => {
      if (user?.email) {
        fetchCounts()
      }
    }, [user?.email]),
  )

  // ✅ Updated uploadProfileImage to match EditProfileScreen functionality
  const uploadProfileImage = async (base64Uri) => {
    try {
      console.log("🚀 uploadProfileImage called")
      console.log("🌐 Using API URL:", getApiUrl())

      const response = await fetch(`${getApiUrl()}/api/auth/update-profile-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          profileImage: base64Uri,
        }),
      })

      const data = await response.json()
      console.log("📡 Server response:", response.status, data)

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`)
      }

      console.log("✅ Server upload successful!")
      setUser((prev) => ({ ...prev, profileImage: base64Uri }))
      alert("✅ Your profile picture has been updated!")
    } catch (err) {
      console.error("❌ Upload error:", err)
      alert(`❌ Upload failed: ${err.message}`)
    }
  }

  // ✅ Updated handlePickImage to match EditProfileScreen functionality exactly
  const handlePickImage = async () => {
    console.log("🔄 Change photo button clicked")
    console.log("👤 Current user:", user?.email)

    // ✅ Check if we're in a web environment
    if (typeof window !== "undefined" && window.document) {
      console.log("🌐 Web environment detected")
      // Web environment - use HTML input
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/jpeg,image/jpg,image/png"
      input.onchange = (event) => {
        console.log("📁 File input changed")
        const file = event.target.files[0]
        if (!file) {
          console.log("❌ No file selected")
          return
        }

        console.log("📁 File selected:", {
          name: file.name,
          type: file.type,
          size: file.size,
        })

        // Validate file type
        if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
          console.log("❌ Invalid file type:", file.type)
          alert("❌ Invalid format. Please upload a JPG or PNG image.")
          return
        }

        // Create image to check dimensions
        const img = new window.Image()
        img.onload = () => {
          console.log("📐 Image dimensions:", img.width, "x", img.height)
          if (img.width < 200 || img.height < 200) {
            console.log("❌ Image too small")
            alert("❌ Image too small. Please select an image that is at least 200x200 pixels.")
            return
          }

          console.log("✅ Image validation passed")
          setImageUploading(true)

          // Convert to base64
          const reader = new FileReader()
          reader.onload = async (e) => {
            const base64 = e.target.result
            console.log("📄 Base64 conversion complete, length:", base64.length)
            console.log("📄 Base64 preview:", base64.substring(0, 100) + "...")

            // Update UI immediately for better UX
            console.log("🔄 Updating UI with new image")
            setUser((prev) => {
              console.log("👤 Previous user image:", prev?.profileImage?.substring(0, 50) + "...")
              const updated = { ...prev, profileImage: base64 }
              console.log("👤 Updated user image:", updated?.profileImage?.substring(0, 50) + "...")
              return updated
            })

            // Upload to server
            console.log("🚀 Starting server upload...")
            await uploadProfileImage(base64)
            setImageUploading(false)
          }
          reader.onerror = () => {
            console.error("❌ File read error")
            alert("❌ Failed to read file")
            setImageUploading(false)
          }
          console.log("📖 Starting file read...")
          reader.readAsDataURL(file)
        }
        img.onerror = () => {
          console.error("❌ Image load error")
          alert("❌ Invalid image file")
        }
        console.log("🖼️ Creating image object URL...")
        img.src = URL.createObjectURL(file)
      }
      console.log("🖱️ Triggering file picker...")
      input.click()
      return
    }

    console.log("📱 Mobile environment - using ImagePicker")
    // Mobile environment - use ImagePicker
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        alert("Permission to access media library is required!")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      })

      if (!result.canceled) {
        const asset = result.assets[0]
        const uri = asset.uri || ""
        const base64 = asset.base64 || ""
        const { width, height } = asset

        const isJPG = uri.match(/\.(jpe?g)$/i)
        const isPNG = uri.match(/\.png$/i)

        if (!isJPG && !isPNG) {
          alert("❌ Invalid format. Please upload a JPG or PNG image.")
          return
        }

        if (width < 200 || height < 200) {
          alert("❌ Image too small. Please select an image that is at least 200x200 pixels.")
          return
        }

        setImageUploading(true)

        const fileType = isPNG ? "png" : "jpeg"
        const dataUri = `data:image/${fileType};base64,${base64}`

        // Update UI immediately
        setUser((prev) => ({ ...prev, profileImage: dataUri }))

        // Upload to server
        await uploadProfileImage(dataUri)
        setImageUploading(false)
      }
    } catch (error) {
      console.error("ImagePicker error:", error)
      alert("❌ Error accessing image picker. Please try again.")
      setImageUploading(false)
    }
  }

  const confirmDelete = (id) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure to delete this post?")
      if (confirmed) deletePost(id)
    } else {
      // For mobile, use a simple alert since Alert.alert might not be available
      const confirmed = window.confirm("Are you sure to delete this post?")
      if (confirmed) deletePost(id)
    }
  }

  const confirmDeleteComment = (postId, index) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure to delete this comment?")
      if (confirmed) deleteComment(postId, index)
    } else {
      // For mobile, use a simple alert since Alert.alert might not be available
      const confirmed = window.confirm("Are you sure to delete this comment?")
      if (confirmed) deleteComment(postId, index)
    }
  }

  // ✅ Handle delete from 3-dot menu
  const handleDeleteFromMenu = (id) => {
    setMenuVisibleId(null) // Close menu first
    confirmDelete(id) // Then show confirmation
  }

  const renderPost = ({ item }) => {
    const isCommentBoxActive = activeCommentBox === item._id

    return (
      <View style={[postStyles.postContainer, { width: width / 2 - 30 }]}>
        {/* ✅ Replaced trash button with 3-dot menu */}
        <TouchableOpacity
          style={postStyles.threeDotsButton}
          onPress={() => setMenuVisibleId(menuVisibleId === item._id ? null : item._id)}
        >
          <Icon name="more-vertical" size={20} color="#555" />
        </TouchableOpacity>

        {/* ✅ Dropdown menu with Delete option */}
        {menuVisibleId === item._id && (
          <View style={postStyles.dropdownMenu}>
            <TouchableOpacity onPress={() => handleDeleteFromMenu(item._id || item.id)}>
              <Text style={postStyles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}

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
            <View style={postStyles.commentBoxContainer}>
              <TextInput
                style={postStyles.commentInput}
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
              <View key={idx} style={postStyles.commentContainer}>
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
                      <View style={[postStyles.dropdownMenu, { top: 25, right: 6 }]}>
                        <TouchableOpacity
                          onPress={() => {
                            setMenuVisibleId(null)
                            confirmDeleteComment(item._id, idx)
                          }}
                        >
                          <Text style={postStyles.deleteText}>Delete</Text>
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { minHeight: "100%" }]}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={require("../assets/logo_artizen.png")} style={styles.logo} resizeMode="contain" />
          </View>
          <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate("SettingsScreen")}>
            <Image source={require("../assets/icn_settings.png")} style={styles.settingsIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        {/* ✅ Updated profile image section to match EditProfileScreen */}
        {!imageUri ? (
          <TouchableOpacity
            style={styles.emptySquare}
            onPress={handlePickImage}
            activeOpacity={0.8}
            disabled={imageUploading} // ✅ Disable when uploading
          >
            <Image source={require("../assets/icn_add_light_blue.png")} style={styles.addIcon} resizeMode="contain" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.emptySquare}
            onPress={handlePickImage}
            disabled={imageUploading} // ✅ Disable when uploading
          >
            <Image source={{ uri: imageUri }} style={styles.profileImage} resizeMode="cover" key={imageUri} />
            {/* ✅ Show loading overlay when uploading - same as EditProfileScreen */}
            {imageUploading && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 20, // Match the profile image border radius
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Uploading...</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

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
          <Text style={styles.profileName}>{user?.fullName || "Your Name Here"}</Text>
          {user?.bio && <Text style={styles.profileBio}>{user.bio}</Text>}
          {user?.link && <Text style={styles.profileBio}>{user.link}</Text>}

          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditProfileScreen")}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <View style={styles.divider} />
        </View>

        <FlatList
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "flex-start" }}
          data={[...posts.filter((p) => p.userEmail === user?.email)].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          )}
          keyExtractor={(item) => item.id || item._id}
          renderItem={renderPost}
          ListEmptyComponent={
            <View style={styles.createPostContainer}>
              <Text style={styles.createPostText}>No Posts Yet</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 90 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  )
}

export default MyProfileScreen

const postStyles = StyleSheet.create({
  postContainer: {
    marginTop: 20,
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#ffffff", // ✅ Changed from "#fafafa" to white
    borderColor: "#e0e0e0", // ✅ Lighter border color
    borderWidth: 1,
    position: "relative",
    // ✅ Add subtle shadow for modern card look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // For Android shadow
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
  // ✅ Updated styles for 3-dot menu
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
  deleteText: {
    color: "red",
    fontSize: 14,
    fontWeight: "600",
  },
  commentBoxContainer: {
    marginTop: 10,
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
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderColor: "#ccc",
    borderWidth: 1,
    position: "relative",
  },
})
