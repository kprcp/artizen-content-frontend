import React, { useState } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../styles/ChangeEmailStyles';
import { useAuth } from '../contexts1/AuthContext';

const ChangeEmail = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleChangeEmail = async () => {
    if (!user?.email) {
      Alert.alert('Error', 'User email not found.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('https://artizen-backend.onrender.com/api/auth/change-email-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentEmail: user.email })  // 👈 matches backend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification email.');
      }

      Alert.alert('Verification Sent', 'Check your inbox for a verification code.');
      navigation.navigate('ChangeEmailVerificationScreen', { email: user.email }); // ✅ updated line

    } catch (err) {
      console.error('Email change request error:', err.message);
      Alert.alert('Error', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Image
            source={require('../assets/icn_arrow_back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.logoContainer} pointerEvents="none">
          <Image
            source={require('../assets/logo_artizen.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.profileTextContainer}>
        <Text style={styles.profileName}>Change Email</Text>

        <Text style={styles.label}>Current Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#f5f5f5' }]}
          value={user?.email || ''}
          editable={false}
        />

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleChangeEmail}
          disabled={loading}
        >
          <Text style={styles.updateButtonText}>
            {loading ? 'Sending...' : 'Change'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangeEmail;
