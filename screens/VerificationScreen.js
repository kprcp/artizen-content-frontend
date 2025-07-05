import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import VerificationStyles from '../styles/VerificationStyles';
import { useAuth } from '../contexts1/AuthContext'; // ✅ add AuthContext

const VerificationScreen = ({ route, navigation }) => {
  const { email, password } = route.params; // ✅ password is passed from SignUpScreen
  const { setUser } = useAuth(); // ✅ get setUser from context

  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirm = async () => {
    if (!code.trim()) {
      setErrorMessage("⚠️ Please enter the verification code.");
      return;
    }

    try {
      // ✅ Step 1: Verify the email
      const verifyRes = await fetch('https://artizen-backend.onrender.com/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setErrorMessage(`⚠️ ${verifyData.error || 'Verification failed.'}`);
        return;
      }

      // ✅ Step 2: Log in automatically
      const loginRes = await fetch('https://artizen-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setErrorMessage(`⚠️ ${loginData.error || 'Login failed after verification.'}`);
        return;
      }

      // ✅ Step 3: Save user in context and redirect
      setUser(loginData.user);

      Alert.alert("✅ Verified", "Your email has been successfully verified.");
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
    } catch (error) {
      setErrorMessage("⚠️ Network error. Please try again.");
    }
  };

  return (
    <View style={VerificationStyles.container}>
      {/* Header */}
      <View style={VerificationStyles.header}>
        <TouchableOpacity
          style={VerificationStyles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/icn_arrow_back.png')}
            style={VerificationStyles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={VerificationStyles.logoContainer} pointerEvents="none">
          <Image
            source={require('../assets/logo_artizen.png')}
            style={VerificationStyles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Content */}
      <View style={VerificationStyles.titleContainer}>
        <Text style={VerificationStyles.title}>Verify Your Email</Text>

        {errorMessage ? (
          <Text style={{ color: 'red', marginVertical: 5 }}>{errorMessage}</Text>
        ) : null}

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
  );
};

export default VerificationScreen;
