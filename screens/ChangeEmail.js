import { useState } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts1/AuthContext';
import styles from '../styles/ChangeEmailStyles';

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
      
      const response = await fetch('https://api.artizen.world/api/auth/change-email-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }) // ✅ Changed from 'currentEmail' to 'email'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification email.');
      }

      Alert.alert('Verification Sent', 'Check your inbox for a verification code.');
      navigation.navigate('ChangeEmailVerificationScreen', { email: user.email });
    } catch (err) {
      console.error('Email change request error:', err.message);
      Alert.alert('Error', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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