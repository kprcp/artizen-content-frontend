import React, { useState } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/ChangeEmailVerificationStyles';

const ChangeEmailVerificationScreen = ({ navigation, route }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const email = route.params?.email;

  const handleConfirm = () => {
    if (!code.trim()) {
      setError('⚠️ Please enter the verification code.');
      return;
    }

    if (!email) {
      setError('⚠️ Email missing. Cannot continue.');
      return;
    }

    // ✅ Navigate directly — backend will validate in NewEmailScreen
    navigation.navigate('NewEmailScreen', { email, code });
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
          />
        </TouchableOpacity>

        <View style={styles.logoContainer} pointerEvents="none">
          <Image
            source={require('../assets/logo_artizen.png')}
            style={styles.logo}
          />
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

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleConfirm}
        >
          <Text style={styles.updateButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangeEmailVerificationScreen;