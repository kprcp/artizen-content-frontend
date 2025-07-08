"use client"

import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useAuth } from "../contexts1/AuthContext"
import { styles as profileStyles } from "../styles/MyProfileStyles"

const { width } = Dimensions.get("window")

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const navigation = useNavigation()
  const { user } = useAuth() // ✅ Added to get current user data

  // ✅ Smart API URL detection
  const getApiUrl = () => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return "http://localhost:5001"
      }
    }
    return "https://api.artizen.world"
  }

  // 🔥 AGGRESSIVE TITLE SETTING - Same as other screens
  useEffect(() => {
    const setTitle = () => {
      if (typeof document !== "undefined") {
        document.title = "Artizen"
      }
    }

    // Set immediately
    setTitle()

    // Set after a small delay to override anything else
    const timer1 = setTimeout(setTitle, 100)
    const timer2 = setTimeout(setTitle, 500)
    const timer3 = setTimeout(setTitle, 1000)

    // Set on focus (when user clicks on tab)
    const handleFocus = () => setTitle()
    window.addEventListener?.("focus", handleFocus)

    // Cleanup
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      window.removeEventListener?.("focus", handleFocus)
    }
  }, [])

  // 🔄 Also set title whenever component re-renders
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "Artizen"
    }
  })

  const handleSearch = async () => {
    if (!searchText.trim()) return

    setLoading(true)
    setResults([])
    setHasSearched(true)

    try {
      const response = await fetch(`${getApiUrl()}/api/auth/search-users?q=${encodeURIComponent(searchText.trim())}`)
      const data = await response.json()

      if (response.ok) {
        setResults(data)
      } else {
        Alert.alert("Error", data.error || "Failed to fetch results.")
      }
    } catch (err) {
      console.error("Search error:", err)
      Alert.alert("Error", "Server error.")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Helper function to get the current profile image for any user
  const getCurrentProfileImage = (itemEmail) => {
    if (itemEmail === user?.email) {
      return user.profileImage
    }
    return null
  }

  const renderItem = ({ item }) => {
    const currentProfileImage = getCurrentProfileImage(item.email) || item.profileImage

    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("UserProfileScreen", { user: item })}>
        {currentProfileImage ? (
          <Image
            source={{ uri: currentProfileImage }}
            style={styles.cardImage}
            resizeMode="cover"
            key={`${item.email}-${currentProfileImage}`} // ✅ Force re-render when image changes
          />
        ) : (
          <View style={styles.noPicContainer}>
            <Text style={styles.noPicText}>
              No{"\n"}Profile{"\n"}Pic
            </Text>
          </View>
        )}
        <View style={styles.cardText}>
          <Text style={styles.fullName}>{item.fullName}</Text>
          {item.bio ? <Text style={styles.bio}>{item.bio}</Text> : null}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={profileStyles.header}>
        <View style={profileStyles.logoContainer}>
          <Image source={require("../assets/logo_artizen.png")} style={profileStyles.logo} resizeMode="contain" />
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
          hasSearched && !loading && results.length === 0 ? <Text style={styles.noResults}>No users found.</Text> : null
        }
      />
    </SafeAreaView>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchContainer: {
    width: "95%",
    maxWidth: 700,
    alignSelf: "center",
    marginTop: 20,
    alignItems: "center",
  },
  searchBar: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "black",
    paddingHorizontal: 15,
    fontSize: 18,
    color: "#333",
    marginBottom: 12,
  },
  searchButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultList: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#ffffff",
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#aaa",
    marginRight: 12,
  },
  cardText: {
    flex: 1,
  },
  fullName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  bio: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  noResults: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 40,
  },
  noPicContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#aaa",
    marginRight: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  noPicText: {
    textAlign: "center",
    color: "#444",
    fontSize: 10,
    lineHeight: 14,
  },
})
