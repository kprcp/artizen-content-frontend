// screens/ConfirmNewEmailVerificationScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/ConfirmNewEmailVerificationStyles';

const ConfirmNewEmailVerificationScreen = ({ navigation, route }) => {
  const { oldEmail, newEmail } = route.params;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!code.trim()) {
      setError('⚠️ Please enter the verification code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://artizen-backend.onrender.com/api/auth/confirm-new-email-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldEmail, newEmail, code }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('SettingsScreen');
      } else {
        setError(`⚠️ ${data.error || 'Invalid or expired code.'}`);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('⚠️ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../assets/icn_arrow_back.png')} style={styles.backIcon} resizeMode="contain" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/logo_artizen.png')} style={styles.logo} resizeMode="contain" />
      </View>

      {/* Title & Subtitle */}
      <Text style={styles.title}>Confirm New Email Verification</Text>
      <Text style={styles.subTitle}>Enter the code sent to your new email address</Text>

      {/* Error */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Input */}
      <Text style={styles.label}>Verification Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter code"
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={handleConfirm} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Confirm'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmNewEmailVerificationScreen;
