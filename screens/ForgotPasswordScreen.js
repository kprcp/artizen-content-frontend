"use client"

import { useEffect, useState } from "react"
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native"
import { forgotStyles as styles } from "../styles/ForgotPasswordStyles"

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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

  const isValidEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(input)
  }

  const handleSendCode = async () => {
    if (!email) {
      setError("⚠️ Please enter your email.")
      return
    }
    if (!isValidEmail(email)) {
      setError("⚠️ Invalid email format.")
      return
    }

    setError("")
    setLoading(true)

    try {
      const response = await fetch("https://api.artizen.world/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        // ✅ Navigate to code confirmation screen with email
        navigation.navigate("ConfirmVerificationScreen", { email })
      } else {
        setError(`⚠️ ${data.error || "Something went wrong."}`)
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

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subTitle}>Enter your email to receive a verification code</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSendCode} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Sending..." : "Send Verification Code"}</Text>
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

export default ForgotPasswordScreen
