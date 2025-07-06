import { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts1/AuthContext'; // ✅ Use the custom hook
import styles from '../styles/ChangePasswordStyles';

const ChangePassword = ({ navigation }) => {
  const { user } = useAuth(); // ✅ Get user from AuthContext

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reenteredPassword, setReenteredPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showReentered, setShowReentered] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    setError('');

    if (!currentPassword || !newPassword || !reenteredPassword) {
      setError('⚠️ Please fill in all fields.');
      return;
    }

    if (newPassword !== reenteredPassword) {
      setError('⚠️ New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('⚠️ Password must be at least 6 characters.');
      return;
    }

    if (!user?.email) {
      setError('⚠️ User not logged in.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://api.artizen.world/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: user.email.trim(), // ✅ Include user's email
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.goBack();
      } else {
        setError(`⚠️ ${data.error || 'Failed to update password.'}`);
      }
    } catch (err) {
      console.error('Password update error:', err);
      setError('⚠️ Network error. Please try again.');
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
        <Text style={styles.profileName}>Change Password</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Current Password */}
        <Text style={styles.label}>Current Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showCurrent}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
            <Image source={require('../assets/icn_show.png')} style={styles.eyeIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        {/* New Password */}
        <Text style={styles.label}>New Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNew}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowNew(!showNew)}>
            <Image source={require('../assets/icn_show.png')} style={styles.eyeIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        {/* Re-enter New Password */}
        <Text style={styles.label}>Re-enter New Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Re-enter new password"
            value={reenteredPassword}
            onChangeText={setReenteredPassword}
            secureTextEntry={!showReentered}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowReentered(!showReentered)}>
            <Image source={require('../assets/icn_show.png')} style={styles.eyeIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdatePassword}
          disabled={loading}
        >
          <Text style={styles.updateButtonText}>
            {loading ? 'Updating...' : 'Update'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePassword;
