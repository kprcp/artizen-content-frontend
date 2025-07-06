"use client"

import { useEffect, useState } from "react"
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useAuth } from "../contexts1/AuthContext"; // ✅ add AuthContext
import VerificationStyles from "../styles/VerificationStyles"

const VerificationScreen = ({ route, navigation }) => {
  const { email, password } = route.params // ✅ password is passed from SignUpScreen
  const { setUser } = useAuth() // ✅ get setUser from context
  const [code, setCode] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

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
      setErrorMessage("⚠️ Please enter the verification code.")
      return
    }

    try {
      // ✅ Step 1: Verify the email
      const verifyRes = await fetch("https://api.artizen.world/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      })

      const verifyData = await verifyRes.json()

      if (!verifyRes.ok) {
        setErrorMessage(`⚠️ ${verifyData.error || "Verification failed."}`)
        return
      }

      // ✅ Step 2: Log in automatically
      const loginRes = await fetch("https://api.artizen.world/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const loginData = await loginRes.json()

      if (!loginRes.ok) {
        setErrorMessage(`⚠️ ${loginData.error || "Login failed after verification."}`)
        return
      }

      // ✅ Step 3: Save user in context and redirect
      setUser(loginData.user)
      Alert.alert("✅ Verified", "Your email has been successfully verified.")
      navigation.reset({
        index: 0,
        routes: [{ name: "MainApp" }],
      })
    } catch (error) {
      setErrorMessage("⚠️ Network error. Please try again.")
    }
  }

  return (
    <View style={VerificationStyles.container}>
      {/* Header */}
      <View style={VerificationStyles.header}>
        <TouchableOpacity style={VerificationStyles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Image
            source={require("../assets/icn_arrow_back.png")}
            style={VerificationStyles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={VerificationStyles.logoContainer} pointerEvents="none">
          <Image source={require("../assets/logo_artizen.png")} style={VerificationStyles.logo} resizeMode="contain" />
        </View>
      </View>

      {/* Content */}
      <View style={VerificationStyles.titleContainer}>
        <Text style={VerificationStyles.title}>Verify Your Email</Text>
        {errorMessage ? <Text style={{ color: "red", marginVertical: 5 }}>{errorMessage}</Text> : null}
        <TextInput
          style={VerificationStyles.input}
          value={code}
          onChangeText={setCode}
          placeholder="Enter confirmation code"
          placeholderTextColor="#888"
          keyboardType="numeric"
        />
        <TouchableOpacity style={VerificationStyles.confirmButton} onPress={handleConfirm}>
          <Text style={VerificationStyles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default VerificationScreen
