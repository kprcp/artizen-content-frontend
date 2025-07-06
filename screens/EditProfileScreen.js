"use client"
import * as ImagePicker from "expo-image-picker"
import { useEffect, useState } from "react"
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useAuth } from "../contexts1/AuthContext"
import { styles } from "../styles/EditProfileStyles"

const EditProfileScreen = ({ navigation }) => {
  const { user, setUser } = useAuth()
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [link, setLink] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

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

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "")
      setBio(user.bio || "")
      setLink(user.link || "")
    }
  }, [user])

  const handleUpdate = async () => {
    setError("")
    setSuccess("")
    if (!user?.email) {
      setError("⚠️ User not logged in.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${getApiUrl()}/api/auth/update-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: user.email.trim(),
          fullName: fullName.trim(),
          bio: bio.trim(),
          link: link.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // ✅ Update user context with new profile data
        setUser((prevUser) => ({
          ...prevUser,
          fullName: fullName.trim(),
          bio: bio.trim(),
          link: link.trim(),
        }))
        setSuccess("✅ Profile updated successfully!")

        // ✅ Navigate back after a brief delay to show success message
        setTimeout(() => {
          navigation.goBack()
        }, 1500)
      } else {
        setError(`⚠️ ${data.error || "Failed to update profile."}`)
      }
    } catch (err) {
      console.error("Update profile error:", err)
      setError("⚠️ Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      console.log("✅ Server upload successful!")
      setUser((prev) => ({ ...prev, profileImage: base64Uri }))
      setSuccess("✅ Your profile picture has been updated!")

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("❌ Upload error:", err)
      setError(`❌ Upload failed: ${err.message}`)
      setTimeout(() => setError(""), 5000)
    }
  }

  const handleChangePhoto = async () => {
    console.log("🔄 Change photo button clicked")
    console.log("👤 Current user:", user?.email)

    // Clear any previous messages
    setError("")
    setSuccess("")

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
          setError("❌ Invalid format. Please upload a JPG or PNG image.")
          return
        }

        // Create image to check dimensions
        const img = new window.Image()
        img.onload = () => {
          console.log("📐 Image dimensions:", img.width, "x", img.height)

          if (img.width < 200 || img.height < 200) {
            console.log("❌ Image too small")
            setError("❌ Image too small. Please select an image that is at least 200x200 pixels.")
            return
          }

          console.log("✅ Image validation passed")
          setImageUploading(true)
          setSuccess("🔄 Processing image...")

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
            setError("❌ Failed to read file")
            setImageUploading(false)
          }

          console.log("📖 Starting file read...")
          reader.readAsDataURL(file)
        }

        img.onerror = () => {
          console.error("❌ Image load error")
          setError("❌ Invalid image file")
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
        Alert.alert("Permission Required", "Permission to access media library is required!")
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
          Alert.alert("Error", "❌ Invalid format. Please upload a JPG or PNG image.")
          return
        }

        if (width < 200 || height < 200) {
          Alert.alert("Error", "❌ Image too small. Please select an image that is at least 200x200 pixels.")
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
      Alert.alert("Error", "❌ Error accessing image picker. Please try again.")
      setImageUploading(false)
    }
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

      {/* Content */}
      <View style={styles.profileTextContainer}>
        <Text style={styles.profileName}>Edit Profile</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        {user?.profileImage ? (
          <View style={styles.emptySquare}>
            <Image
              source={{ uri: user.profileImage }}
              style={styles.profileImage}
              resizeMode="cover"
              key={user.profileImage} // ✅ Force re-render when image changes
            />
            {/* ✅ Show loading overlay when uploading */}
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
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Uploading...</Text>
              </View>
            )}
          </View>
        ) : (
          <TouchableOpacity style={styles.emptySquare} onPress={handleChangePhoto} activeOpacity={0.8}>
            <Image source={require("../assets/icn_add_light_blue.png")} style={styles.addIcon} resizeMode="contain" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.changePhotoButton, imageUploading && { opacity: 0.6 }]}
          onPress={handleChangePhoto}
          disabled={imageUploading} // ✅ Disable button while uploading
        >
          <Text style={styles.changePhotoButtonText}>{imageUploading ? "Uploading..." : "Change Photo"}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput style={styles.input} placeholder="Enter your Bio" value={bio} onChangeText={setBio} />

        <Text style={styles.label}>Link</Text>
        <TextInput style={styles.input} placeholder="Enter your Link" value={link} onChangeText={setLink} />

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={loading || imageUploading}>
          <Text style={styles.updateButtonText}>{loading ? "Updating..." : "Update"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default EditProfileScreen
