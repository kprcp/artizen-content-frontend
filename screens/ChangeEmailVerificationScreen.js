"use client"

import { useEffect, useState } from "react"
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native"
import styles from "../styles/ChangeEmailVerificationStyles"

const ChangeEmailVerificationScreen = ({ navigation, route }) => {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const email = route.params?.email

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

  const handleConfirm = () => {
    if (!code.trim()) {
      setError("⚠️ Please enter the verification code.")
      return
    }
    if (!email) {
      setError("⚠️ Email missing. Cannot continue.")
      return
    }

    // ✅ Navigate directly — backend will validate in NewEmailScreen
    navigation.navigate("NewEmailScreen", { email, code })
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Image source={require("../assets/icn_arrow_back.png")} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.logoContainer} pointerEvents="none">
          <Image source={require("../assets/logo_artizen.png")} style={styles.logo} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.profileTextContainer}>
        <Text style={styles.profileName}>Confirm Email Verification</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Text style={styles.label}>Verification Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter verification code"
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.updateButton} onPress={handleConfirm}>
          <Text style={styles.updateButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ChangeEmailVerificationScreen
