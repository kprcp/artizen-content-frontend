"use client"

import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useCallback, useEffect, useState } from "react"
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import io from "socket.io-client"
import { styles } from "../styles/ChatStyles"

const API_BASE = "http://localhost:5001"   // ← your backend base
const SOCKET_URL = API_BASE

const ChatScreen = () => {
  const navigation = useNavigation()
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchThreads = useCallback(async () => {
    try {
      setLoading(true)
      // if you use auth, include your Authorization header
      const res = await fetch(`${API_BASE}/api/chat/threads`, {
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      })
      const json = await res.json()
      setThreads(Array.isArray(json) ? json : [])
    } catch (e) {
      console.warn("threads error", e)
      setThreads([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Title keep-as-is
  useEffect(() => {
    const setTitle = () => {
      if (typeof document !== "undefined") document.title = "Chat - Artizen"
    }
    setTitle()
    const t1 = setTimeout(setTitle, 100)
    const t2 = setTimeout(setTitle, 500)
    const t3 = setTimeout(setTitle, 1000)
    const onFocusWin = () => setTitle()
    window.addEventListener?.("focus", onFocusWin)
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      window.removeEventListener?.("focus", onFocusWin)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchThreads()
  }, [fetchThreads])

  // Refetch whenever screen regains focus (e.g., after sending a message)
  useFocusEffect(
    useCallback(() => {
      fetchThreads()
    }, [fetchThreads])
  )

  // Socket: when any message is created (sent/received), refresh threads so the bar appears
  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] })
    socket.on("connect", () => {})
    socket.on("message:new", () => {
      // Any new message anywhere that involves me will be reflected by refetch
      fetchThreads()
    })
    return () => socket.disconnect()
  }, [fetchThreads])

  const formatTimestamp = (d) => {
    if (!d) return ""
    const date = typeof d === "string" ? new Date(d) : d
    if (isNaN(date?.getTime?.())) return ""
    const weekday = date.toLocaleString("en-US", { weekday: "short" })
    const day = date.toLocaleString("en-US", { day: "2-digit" })
    const month = date.toLocaleString("en-US", { month: "long" })
    const year = date.toLocaleString("en-US", { year: "numeric" })
    const time = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    return `${weekday} ${day} ${month} ${year} at ${time}`
  }

  // a thread “counts” if it has a real lastMessage (string or {text})
  const messageThreads = threads.filter((t) => {
    const lm = typeof t?.lastMessage === "string" ? t.lastMessage : t?.lastMessage?.text
    return !!(lm && lm.trim().length > 0)
  })

  const renderItem = ({ item }) => {
    const { user, lastMessage, updatedAt, id } = item
    const avatar = user?.profileImage
    const snippet = typeof lastMessage === "string" ? lastMessage : lastMessage?.text
    return (
      <TouchableOpacity
        style={styles.threadCard}
        activeOpacity={0.7}
        onPress={() => navigation.navigate("ChatUserScreen", { user, threadId: id })}
      >
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.threadImage} resizeMode="cover" />
        ) : (
          <View style={styles.noPicContainer}>
            <Text style={styles.noPicText}>No{"\n"}Profile{"\n"}Pic</Text>
          </View>
        )}

        <View style={styles.threadCenter}>
          <Text style={styles.threadName} numberOfLines={1}>
            {user?.fullName || user?.email}
          </Text>
          <Text style={styles.threadSnippet} numberOfLines={1}>
            {snippet}
          </Text>
        </View>

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo_artizen.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Placeholder when there are no threads with any messages */}
      {loading ? (
        <View style={styles.chatPlaceholder}>
          <Text style={styles.chatPlaceholderText}>Loading…</Text>
        </View>
      ) : messageThreads.length === 0 ? (
        <View style={styles.chatPlaceholder}>
          <Text style={styles.chatPlaceholderText}>No Chats Yet</Text>
        </View>
      ) : (
        <FlatList
          data={messageThreads}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.threadList}
        />
      )}
    </View>
  )
}

export default ChatScreen
