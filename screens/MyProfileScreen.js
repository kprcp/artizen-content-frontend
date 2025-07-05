import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { styles } from '../styles/MyProfileStyles';
import Icon from 'react-native-vector-icons/Feather';
import { usePostContext } from '../contexts1/PostContext';
import { useAuth } from '../contexts1/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MyProfileScreen = ({ navigation }) => {
  const { posts, toggleLike, deletePost, addComment, deleteComment } = usePostContext();
  const { user, setUser } = useAuth();

  const [imageUri, setImageUri] = useState(null);
  const [activeCommentBox, setActiveCommentBox] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const fetchCounts = async () => {
    try {
      const res = await fetch(`https://artizen-backend.onrender.com/api/auth/user-follow-counts?email=${user.email}`);
      const data = await res.json();
      if (res.ok) {
        setFollowerCount(data.followerCount || 0);
        setFollowingCount(data.followingCount || 0);
      }
    } catch (err) {
      console.error('❌ Failed to fetch follow counts:', err);
    }
  };

  useEffect(() => {
    if (user?.profileImage) {
      setImageUri(user.profileImage);
    }
    if (user?.email) fetchCounts();
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      if (user?.email) {
        fetchCounts();
      }
    }, [user?.email])
  );

  const uploadProfileImage = async (base64Uri) => {
    try {
      const response = await fetch('https://artizen-backend.onrender.com/api/auth/update-profile-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          profileImage: base64Uri,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Upload Failed', data.error || 'Try again.');
      } else {
        console.log('✅ Profile image updated on server');
        setUser(prev => ({ ...prev, profileImage: base64Uri }));
      }
    } catch (err) {
      console.error('Image upload error:', err);
      Alert.alert('Error', 'Could not upload image.');
    }
  };

  const handlePickImage = async () => {
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
      const dataUri = `data:image/jpeg;base64,${asset.base64}`;
      setImageUri(dataUri);
      uploadProfileImage(dataUri);
    }
  };

  const confirmDelete = (id) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure to delete this post?');
      if (confirmed) deletePost(id);
    } else {
      Alert.alert('Delete Post', 'Are you sure to delete this post?', [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', style: 'destructive', onPress: () => deletePost(id) },
      ]);
    }
  };

  const confirmDeleteComment = (postId, index) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure to delete this comment?');
      if (confirmed) deleteComment(postId, index);
    } else {
      Alert.alert('Delete Comment', 'Are you sure to delete this comment?', [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', style: 'destructive', onPress: () => deleteComment(postId, index) },
      ]);
    }
  };

  const renderPost = ({ item }) => {
    const isCommentBoxActive = activeCommentBox === item._id;

    return (
      <View style={[postStyles.postContainer, { width: width / 2 - 30 }]}>
        <TouchableOpacity
          style={postStyles.trashButton}
          onPress={() => confirmDelete(item._id || item.id)}
        >
          <Icon name="trash-2" size={20} color="red" />
        </TouchableOpacity>

        <Text style={postStyles.postTitle}>{item.title}</Text>
        <Text style={postStyles.postContent}>{item.content}</Text>

        <View style={postStyles.iconRow}>
          <TouchableOpacity
            style={postStyles.iconButton}
            onPress={() => toggleLike(item.id || item._id)}
          >
            <Icon
              name="thumbs-up"
              size={20}
              color={item.liked ? '#007AFF' : '#555'}
              style={{ marginRight: 6 }}
            />
            <Text style={[postStyles.iconLabel, { color: item.liked ? '#007AFF' : '#555' }]}>Like{item.likes > 0 ? ` (${item.likes})` : ''}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={postStyles.iconButton}
            onPress={() => setActiveCommentBox(isCommentBoxActive ? null : item._id)}
          >
            <Icon name="message-circle" size={20} color={isCommentBoxActive ? '#007AFF' : '#555'} style={{ marginRight: 6 }} />
            <Text style={[postStyles.iconLabel, { color: isCommentBoxActive ? '#007AFF' : '#555' }]}>Comment{item.comments?.length > 0 ? ` (${item.comments.length})` : ''}</Text>
          </TouchableOpacity>
        </View>

        {isCommentBoxActive && (
          <>
            <View style={{ marginTop: 10 }}>
              <TextInput
                style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, marginBottom: 6 }}
                placeholder="Write a comment..."
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity
                style={{ backgroundColor: '#007AFF', padding: 8, borderRadius: 8, alignItems: 'center' }}
                onPress={async () => {
                  await addComment(item._id, commentText);
                  setCommentText('');
                }}
              >
                <Text style={{ color: 'white' }}>Comment</Text>
              </TouchableOpacity>
            </View>

            {item.comments?.map((cmt, idx) => (
              <View
                key={idx}
                style={{
                  marginTop: 10,
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: '#f1f1f1',
                  position: 'relative',
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>{cmt.fullName}</Text>
                <Text>{cmt.content}</Text>
                {(cmt.userEmail === user?.email || item.userEmail === user?.email) && (
                  <TouchableOpacity
                    style={{ position: 'absolute', top: 6, right: 6 }}
                    onPress={() => confirmDeleteComment(item._id, idx)}
                  >
                    <Icon name="trash" size={16} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </>
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={[styles.container, { minHeight: '100%' }]}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo_artizen.png')} style={styles.logo} resizeMode="contain" />
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('SettingsScreen')}
          >
            <Image source={require('../assets/icn_settings.png')} style={styles.settingsIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        {!imageUri ? (
          <TouchableOpacity style={styles.emptySquare} onPress={handlePickImage} activeOpacity={0.8}>
            <Image source={require('../assets/icn_add_light_blue.png')} style={styles.addIcon} resizeMode="contain" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.emptySquare} onPress={handlePickImage}>
            <Image source={{ uri: imageUri }} style={styles.profileImage} resizeMode="cover" />
          </TouchableOpacity>
        )}

        <View style={styles.followContainer}>
          <View style={styles.followItem}>
            <Text style={styles.followNumber}>{followingCount}</Text>
            <Text style={styles.followText}>Followings</Text>
          </View>
          <View style={styles.followItem}>
            <Text style={styles.followNumber}>{followerCount}</Text>
            <Text style={styles.followText}>Followers</Text>
          </View>
        </View>

        <View style={styles.profileTextContainer}>
          <Text style={styles.profileName}>{user?.fullName || 'Your Name Here'}</Text>
          {user?.bio && <Text style={styles.profileBio}>{user.bio}</Text>}
          {user?.link && <Text style={styles.profileBio}>{user.link}</Text>}

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfileScreen')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <View style={styles.divider} />
        </View>

        <FlatList
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'flex-start' }}
          data={[...posts.filter((p) => p.userEmail === user?.email)].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
          keyExtractor={(item) => item.id || item._id}
          renderItem={renderPost}
          ListEmptyComponent={
            <View style={styles.createPostContainer}>
              <Text style={styles.createPostText}>No Posts Yet</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 90 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
};

export default MyProfileScreen;

const postStyles = StyleSheet.create({
  postContainer: {
    marginTop: 20,
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#fafafa',
    borderColor: '#ccc',
    borderWidth: 1,
    position: 'relative',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  postContent: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  iconLabel: {
    fontSize: 14,
  },
  trashButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
  },
});
