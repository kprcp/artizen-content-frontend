"use client"

import { useEffect, useState } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { useAuth } from "../contexts1/AuthContext"; // ✅ added
import SettingsStyle from "../styles/SettingsStyle"

const SettingsScreen = ({ navigation }) => {
  const [accountPrivate, setIsPrivate] = useState(false)
  const [allowComments, setAllowComments] = useState(false)
  const [emailPressed, setEmailPressed] = useState(false)
  const [passwordPressed, setPasswordPressed] = useState(false)
  const { user, setUser } = useAuth() // ✅ grab the logged-in user

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

  const handleEmailPress = () => {
    setEmailPressed(true)
    setTimeout(() => setEmailPressed(false), 150)
    navigation.navigate("ChangeEmailScreen")
  }

  const handlePasswordPress = () => {
    setPasswordPressed(true)
    setTimeout(() => setPasswordPressed(false), 150)
    navigation.navigate("ChangePasswordScreen")
  }

  const handleLogout = () => {
    setUser(null)
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }],
    })
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure to delete your account?")
    if (!confirmed) return

    try {
      const res = await fetch("https://api.artizen.world/api/auth/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }), // ✅ email from user context
      })

      const data = await res.json()

      if (res.ok) {
        console.log(data.message)
        setUser(null) // ✅ log out the user
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginScreen" }],
        })
      } else {
        console.error("Deletion failed:", data.error)
        alert("Failed to delete account.")
      }
    } catch (err) {
      console.error("Error deleting account:", err)
      alert("Server error. Please try again.")
    }
  }

  return (
    <View style={SettingsStyle.container}>
      {/* Header */}
      <View style={SettingsStyle.header}>
        <TouchableOpacity style={SettingsStyle.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Image source={require("../assets/icn_arrow_back.png")} style={SettingsStyle.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <View style={SettingsStyle.logoContainer} pointerEvents="none">
          <Image source={require("../assets/logo_artizen.png")} style={SettingsStyle.logo} resizeMode="contain" />
        </View>
      </View>

      {/* Content */}
      <View style={SettingsStyle.profileTextContainer}>
        <Text style={SettingsStyle.profileName}>Settings</Text>

        <TouchableOpacity
          onPress={handleEmailPress}
          activeOpacity={0.8}
          style={[SettingsStyle.input, SettingsStyle.clickableInput, emailPressed && SettingsStyle.inputPressed]}
        >
          <View style={SettingsStyle.inputRow}>
            <Text style={SettingsStyle.inputText}>Change Email</Text>
            <Image
              source={require("../assets/icn_arrow_forward.png")}
              style={SettingsStyle.arrowIcon}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePasswordPress}
          activeOpacity={0.8}
          style={[SettingsStyle.input, SettingsStyle.clickableInput, passwordPressed && SettingsStyle.inputPressed]}
        >
          <View style={SettingsStyle.inputRow}>
            <Text style={SettingsStyle.inputText}>Change Password</Text>
            <Image
              source={require("../assets/icn_arrow_forward.png")}
              style={SettingsStyle.arrowIcon}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>

        {/* Toggle 1 - Account Private */}
        {/*        <View style={[SettingsStyle.input, SettingsStyle.switchBox]}>
          <Text style={SettingsStyle.inputText}>Private Account</Text>
          <Switch
            value={accountPrivate}
            onValueChange={setIsPrivate}
            trackColor={{ false: '#ccc', true: '#007AFF' }}
            thumbColor={accountPrivate ? '#007AFF' : '#f4f3f4'}
            ios_backgroundColor="#ccc"
          />
        </View>
        */}

        {/* Toggle 2 - Comments */}
        {/*        <View style={[SettingsStyle.input, SettingsStyle.switchBox]}>
          <Text style={SettingsStyle.inputText}>Comments</Text>
          <Switch
            value={allowComments}
            onValueChange={setAllowComments}
            trackColor={{ false: '#ccc', true: '#007AFF' }}
            thumbColor={allowComments ? '#007AFF' : '#f4f3f4'}
            ios_backgroundColor="#ccc"
          />
        </View>
        */}

        {/* ✅ Log Out Button */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.8}
          style={[SettingsStyle.input, SettingsStyle.logoutBox]}
        >
          <View style={SettingsStyle.inputRow}>
            <Text style={SettingsStyle.logoutText}>Log Out</Text>
          </View>
        </TouchableOpacity>

        {/* ✅ Delete Account Button */}
        <TouchableOpacity onPress={handleDeleteAccount} activeOpacity={0.8} style={SettingsStyle.deleteButton}>
          <Text style={SettingsStyle.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SettingsScreen
