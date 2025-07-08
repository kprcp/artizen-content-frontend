"use client"

// PostPage.js
import { useEffect } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { usePostContext } from "../contexts1/PostContext"
import { styles } from "../styles/PostPageStyles"

const PostPage = ({ route, navigation }) => {
  const { title, content, fullName, profileImage } = route.params || {}
  const { addPost } = usePostContext()

  // ✅ Smart API URL detection (for future-proofing)
  const getApiUrl = () => {
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")

    return isLocalhost ? "http://localhost:5001" : "https://api.artizen.world"
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

  useEffect(() => {
    if (title?.trim() && content?.trim()) {
      const newPost = {
        id: Date.now().toString(),
        title,
        content,
        likes: 0,
        liked: false,
        fullName: fullName || "",
        profileImage: profileImage || "",
      }
      addPost(newPost)
    }
  }, [title, content, fullName, profileImage])

  const handleDone = () => {
    navigation.navigate("MainApp", { screen: "World" })
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require("../assets/icn_arrow_back.png")} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/logo_artizen.png")} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      {/* Post Box */}
      <View style={styles.postContainer}>
        {/* Profile Picture */}
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profilePicSquare} />
        ) : (
          <View style={styles.profilePicSquare} />
        )}

        {/* Full Name */}
        {fullName ? <Text style={styles.fullName}>{fullName}</Text> : null}

        {/* Title */}
        {title ? <Text style={styles.postTitle}>{title}</Text> : null}

        {/* Content */}
        {content ? <Text style={styles.postContent}>{content}</Text> : null}
      </View>

      {/* Done Button */}
      <TouchableOpacity style={styles.confirmationContainer} onPress={handleDone} activeOpacity={0.8}>
        <Text style={styles.liveText}>Your post is live!</Text>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </View>
  )
}

export default PostPage
