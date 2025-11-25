"use client"

import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useCallback, useEffect, useState } from "react"
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import io from "socket.io-client"
import { useAuth } from "../contexts1/AuthContext"
import { styles } from "../styles/ChatStyles"



// ✅ Smart API URL function (same logic as other screens)
const getApiUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5001"
    }
  }
  return "https://api.artizen.world"
}

const API_BASE = getApiUrl()
const SOCKET_URL = API_BASE


const ChatScreen = () => {
  const navigation = useNavigation()
  const { user: currentUser } = useAuth()
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchThreads = useCallback(async () => {
  try {
    if (!currentUser?.email) {
      console.log("No currentUser.email yet — skipping threads fetch")
      return
    }

    setLoading(true)

    const res = await fetch(
      `${API_BASE}/api/chat/threads?ts=${Date.now()}`, // 🔥 prevents stale caching
      {
        headers: {
          "X-User-Email": currentUser.email,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    )

    const data = await res.json()
    console.log("🔥 THREADS RESPONSE FROM BACKEND:", data)

    setThreads(Array.isArray(data) ? data : [])
  } catch (e) {
    console.warn("threads error", e)
    setThreads([])
  } finally {
    setLoading(false)
  }
}, [currentUser?.email])




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

  socket.on("message:new", () => {
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

// ✅ Only keep threads that actually have at least one real message
const messageThreads = threads.filter((t) => {
  const lm = t.lastMessage
  const text =
    (typeof lm === "string" && lm) ||
    lm?.text ||
    lm?.[0]?.text // handles array form just in case

  return !!text && text.trim().length > 0
})


  const renderItem = ({ item }) => {
  const { user: otherUser, lastMessage, updatedAt, id } = item

  // Last message snippet
 const snippet =
  (typeof lastMessage === "string" && lastMessage) ||
  lastMessage?.text ||
  lastMessage?.[0]?.text ||     // handles array form
  "No messages yet"



  // ALWAYS show the OTHER USER's identity (your chat partner)
  const avatar = otherUser?.profileImage
  const name = otherUser?.fullName || otherUser?.email

  return (
    <TouchableOpacity
      style={styles.threadCard}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate("ChatUserScreen", { user: otherUser, threadId: id })
      }
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
          {name}
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


 const keyExtractor = (item) => String(item.id)



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
        <View style={styles.listWrapper}>
          <FlatList
            data={messageThreads}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            style={styles.list}
            contentContainerStyle={styles.threadList}
          />
        </View>
      )}

    </View>
  )
}

export default ChatScreen
