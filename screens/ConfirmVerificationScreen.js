"use client"

import { useEffect, useState } from "react"
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native"
import { confirmStyles as styles } from "../styles/ConfirmVerificationStyles"

const ConfirmVerificationScreen = ({ navigation, route }) => {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
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

  const handleConfirm = async () => {
    if (!code.trim()) {
      setError("⚠️ Please enter the verification code.")
      return
    }

    setError("")
    setLoading(true)

    try {
      const response = await fetch("https://api.artizen.world/api/auth/confirm-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (response.ok) {
        // ✅ Navigate to reset password screen with email + code
        navigation.navigate("ResetPasswordScreen", { email, code })
      } else {
        setError(`⚠️ ${data.error || "Invalid or expired code."}`)
      }
    } catch (err) {
      console.error(err)
      setError("⚠️ Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require("../assets/icn_arrow_back.png")} style={styles.backIcon} resizeMode="contain" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../assets/logo_artizen.png")} style={styles.logo} resizeMode="contain" />
      </View>

      <Text style={styles.title}>Confirm Verification</Text>
      <Text style={styles.subTitle}>Enter the code sent to your email</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.label}>Verification Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Code"
        placeholderTextColor="#999"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirm} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Verifying..." : "Confirm"}</Text>
      </TouchableOpacity>

      {/* Back to Login */}
      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={[styles.linkText, { marginTop: 30 }]}>Back to Login</Text>
      </TouchableOpacity>

      {/* Create an Account */}
      <TouchableOpacity onPress={() => navigation.navigate("SignUpScreen")}>
        <Text style={[styles.linkText, { marginTop: 8 }]}>Create an account</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ConfirmVerificationScreen
