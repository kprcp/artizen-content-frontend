import React, { useState, useEffect } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../styles/EditProfileStyles';
import { useAuth } from '../contexts1/AuthContext';
import * as ImagePicker from 'expo-image-picker';

const EditProfileScreen = ({ navigation }) => {
  const { user, setUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setBio(user.bio || '');
      setLink(user.link || '');
    }
  }, [user]);

  const handleUpdate = async () => {
    setError('');
    setSuccess('');

    if (!user?.email) {
      setError('⚠️ User not logged in.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://artizen-backend.onrender.com/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: user.email.trim(),
          fullName: fullName.trim(),
          bio: bio.trim(),
          link: link.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser((prevUser) => ({
          ...prevUser,
          fullName: fullName.trim(),
          bio: bio.trim(),
          link: link.trim(),
        }));
        setSuccess('✅ Profile updated successfully!');
        navigation.goBack();
      } else {
        setError(`⚠️ ${data.error || 'Failed to update profile.'}`);
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setError('⚠️ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      const uri = asset.uri || '';
      const base64 = asset.base64 || '';
      const { width, height } = asset;

      const isJPG = uri.match(/\.(jpe?g)$/i);
      const isPNG = uri.match(/\.png$/i);

      if (!isJPG && !isPNG) {
        alert('❌ Invalid image. Please upload a JPG or PNG image that is at least 400x400 pixels.');
        return;
      }

      if (width < 400 || height < 400) {
        alert('❌ Image too small. Please select an image at least 400x400 pixels.');
        return;
      }

      const fileType = isPNG ? 'png' : 'jpeg';
      const dataUri = `data:image/${fileType};base64,${base64}`;

      try {
        const response = await fetch('https://artizen-backend.onrender.com/api/auth/update-profile-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            profileImage: dataUri,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setUser((prev) => ({ ...prev, profileImage: dataUri }));
        } else {
          alert(data.error || 'Failed to update image.');
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert('Network error.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/icn_arrow_back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo_artizen.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.profileTextContainer}>
        <Text style={styles.profileName}>Edit Profile</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        {user?.profileImage ? (
          <View style={styles.emptySquare}>
            <Image
              source={{ uri: user.profileImage }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
        ) : (
          <TouchableOpacity style={styles.emptySquare} onPress={handleChangePhoto} activeOpacity={0.8}>
            <Image
              source={require('../assets/icn_add_light_blue.png')}
              style={styles.addIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.changePhotoButton} onPress={handleChangePhoto}>
          <Text style={styles.changePhotoButtonText}>Change Photo</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Bio"
          value={bio}
          onChangeText={setBio}
        />

        <Text style={styles.label}>Link</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Link"
          value={link}
          onChangeText={setLink}
        />

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={loading}>
          <Text style={styles.updateButtonText}>
            {loading ? 'Updating...' : 'Update'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfileScreen;
