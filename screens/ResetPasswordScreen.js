import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { resetStyles as styles } from '../styles/ResetPasswordStyles';

const ResetPasswordScreen = ({ navigation, route }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!password || !confirm) {
      setError('⚠️ Please fill in both fields.');
      return;
    }

    if (password !== confirm) {
      setError('⚠️ Passwords do not match.');
      return;
    }

    const { email, code } = route.params;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://artizen-backend.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('LoginScreen');
      } else {
        setError(`⚠️ ${data.error || 'Something went wrong.'}`);
      }
    } catch (err) {
      console.error(err);
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

      <Text style={styles.title}>Reset Your Password</Text>
      <Text style={styles.subTitle}>Enter your new password below</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.label}>New Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter Your New Password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image source={require('../assets/icn_show.png')} style={styles.eyeIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Re-Enter Your New Password"
          placeholderTextColor="#999"
          secureTextEntry={!showConfirmPassword}
          value={confirm}
          onChangeText={setConfirm}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Image source={require('../assets/icn_show.png')} style={styles.eyeIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleConfirm} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Submitting...' : 'Confirm'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={[styles.linkText, { marginTop: 30 }]}>Back to Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
        <Text style={[styles.linkText, { marginTop: 8 }]}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;