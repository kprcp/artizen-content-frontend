import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles as profileStyles } from '../styles/MyProfileStyles';

const { width } = Dimensions.get('window');

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    setLoading(true);
    setResults([]);
    setHasSearched(true);

    try {
      const response = await fetch(`https://artizen-backend.onrender.com/api/auth/search-users?q=${encodeURIComponent(searchText.trim())}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch results.');
      }
    } catch (err) {
      console.error('Search error:', err);
      Alert.alert('Error', 'Server error.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('UserProfileScreen', { user: item })}
    >
      {item.profileImage ? (
        <Image
          source={{ uri: item.profileImage }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noPicContainer}>
          <Text style={styles.noPicText}>No{'\n'}Profile{'\n'}Pic</Text>
        </View>
      )}
      <View style={styles.cardText}>
        <Text style={styles.fullName}>{item.fullName}</Text>
        {item.bio ? <Text style={styles.bio}>{item.bio}</Text> : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={profileStyles.header}>
        <View style={profileStyles.logoContainer}>
          <Image
            source={require('../assets/logo_artizen.png')}
            style={profileStyles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Search Input + Button */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.resultList}
        ListEmptyComponent={
          hasSearched && !loading && results.length === 0 ? (
            <Text style={styles.noResults}>No users found.</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    width: '95%',
    maxWidth: 700,
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center',
  },
  searchBar: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'black',
    paddingHorizontal: 15,
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
  },
  searchButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultList: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  fullName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bio: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 40,
  },
  noPicContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#aaa',
    marginRight: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPicText: {
    textAlign: 'center',
    color: '#444',
    fontSize: 10,
    lineHeight: 14,
  },
});
