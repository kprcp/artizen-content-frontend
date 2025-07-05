// screens/NewEmailScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { newEmailStyles as styles } from '../styles/NewEmailStyles';

const NewEmailScreen = ({ navigation, route }) => {
  const { email: oldEmail, code } = route.params;
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = async () => {
    const trimmedNewEmail = newEmail.trim().toLowerCase();
    const trimmedConfirmEmail = confirmEmail.trim().toLowerCase();

    if (!trimmedNewEmail || !trimmedConfirmEmail) {
      setError('⚠️ Please fill in both fields.');
      return;
    }

    if (trimmedNewEmail !== trimmedConfirmEmail) {
      setError('⚠️ Emails do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Request a code to the new email for confirmation
      const response = await fetch('https://artizen-backend.onrender.com/api/auth/request-new-email-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldEmail, newEmail: trimmedNewEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('ConfirmNewEmailVerificationScreen', {
          oldEmail,
          newEmail: trimmedNewEmail,
        });
      } else {
        setError(`⚠️ ${data.error || 'Failed to send verification to new email.'}`);
      }
    } catch (err) {
      console.error('Email verification request error:', err);
      setError('⚠️ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image
          source={require('../assets/icn_arrow_back.png')}
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/logo_artizen.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Enter your new email</Text>
      <Text style={styles.subTitle}>Provide a new email address</Text>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* New Email */}
      <Text style={styles.label}>New Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new email"
        placeholderTextColor="#999"
        value={newEmail}
        onChangeText={setNewEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Confirm Email */}
      <Text style={styles.label}>Re-enter New Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Re-enter new email"
        placeholderTextColor="#999"
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Confirm Button */}
      <TouchableOpacity style={styles.button} onPress={handleEmailChange} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Confirm'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewEmailScreen;