"use client"

import { useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import { styles } from "../styles/ChatStyles"

const ChatScreen = () => {
  const navigation = useNavigation()
  const [threads, setThreads] = useState([])

  useEffect(() => {
    const setTitle = () => {
      if (typeof document !== "undefined") document.title = "Chat - Artizen"
    }
    setTitle()
    const t1 = setTimeout(setTitle, 100)
    const t2 = setTimeout(setTitle, 500)
    const t3 = setTimeout(setTitle, 1000)
    const onFocus = () => setTitle()
    window.addEventListener?.("focus", onFocus)
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      window.removeEventListener?.("focus", onFocus)
    }
  }, [])

  // TEMP: sample data — replace with your real inbox threads
  useEffect(() => {
    setThreads([
      {
        id: "1",
        user: {
          email: "bekir@example.com",
          fullName: "Bekir Sami Capar",
          profileImage:
            "https://placehold.co/100x100?text=B", // swap with real profileImage
        },
        lastMessage: "Hey! Are you free to chat later today?",
        updatedAt: new Date(), // last message time
      },
      {
        id: "2",
        user: {
          email: "jane@example.com",
          fullName: "Jane Doe",
          profileImage: "",
        },
        lastMessage: "Got it, thanks!",
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
      },
    ])
  }, [])

  const formatTimestamp = (d) => {
    const date = typeof d === "string" ? new Date(d) : d
    const weekday = date.toLocaleString("en-US", { weekday: "short" }) // Wed
    const day = date.toLocaleString("en-US", { day: "2-digit" })        // 06
    const month = date.toLocaleString("en-US", { month: "long" })       // August
    const year = date.toLocaleString("en-US", { year: "numeric" })      // 2025
    const time = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }) // 11:57 AM
    return `${weekday} ${day} ${month} ${year} at ${time}`
  }

  const renderItem = ({ item }) => {
    const { user, lastMessage, updatedAt } = item
    const avatar = user?.profileImage
    return (
      <TouchableOpacity
        style={styles.threadCard}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("ChatScreen", { user })}
      >
        {/* Left: avatar */}
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.threadImage} resizeMode="cover" />
        ) : (
          <View style={styles.noPicContainer}>
            <Text style={styles.noPicText}>No{"\n"}Profile{"\n"}Pic</Text>
          </View>
        )}

        {/* Middle: name + snippet */}
        <View style={styles.threadCenter}>
          <Text style={styles.threadName} numberOfLines={1}>
            {user?.fullName || user?.email}
          </Text>
          <Text style={styles.threadSnippet} numberOfLines={1}>
            {lastMessage}
          </Text>
        </View>

        {/* Right: timestamp */}
        <View style={styles.threadRight}>
          <Text style={styles.threadDate} numberOfLines={2}>
            {formatTimestamp(updatedAt)}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const keyExtractor = (item) => item.id

  return (
    <View style={styles.container}>
      {/* Header (kept same as before) */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo_artizen.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Chat list */}
      <FlatList
        data={threads}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.threadList}
      />
    </View>
  )
}

export default ChatScreen
