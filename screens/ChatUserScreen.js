"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  Alert,
  FlatList,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

import io from "socket.io-client"
import { useAuth } from "../contexts1/AuthContext"
import styles from "../styles/ChatUserStyles"

// ✅ Smart API URL
const getApiUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5001"
    }
  }
  return "https://api.artizen.world"
}


// Mark this thread as read on this device
const markThreadRead = (threadId) => {
  if (!threadId) return
  if (typeof window === "undefined") return

  try {
    const now = Date.now()
    const raw = window.localStorage.getItem("chatLastRead")
    const map = raw ? JSON.parse(raw) : {}
    map[threadId] = now
    window.localStorage.setItem("chatLastRead", JSON.stringify(map))

    // notify BottomTabNavigator
    window.dispatchEvent(
      new CustomEvent("chat-thread-read", { detail: { threadId, at: now } })
    )
  } catch (e) {
    console.warn("markThreadRead error:", e)
  }
}


const API_BASE = getApiUrl()
const SOCKET_URL = API_BASE

const INPUT_HEIGHT = 70
const HEADER_HEIGHT = 70

const ChatUserScreen = ({ route, navigation }) => {
  const { user, threadId } = route.params
  const { user: currentUser } = useAuth()


  // 🔵 when user opens this chat, mark it as read
  useEffect(() => {
    markThreadRead(threadId)
  }, [threadId])


  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  const flatListRef = useRef(null)
  const scrollViewRef = useRef(null)
  const localIdRef = useRef(0)

  // ✅ Load messages from backend
  const fetchMessages = useCallback(async () => {
    if (!threadId) return
    if (!currentUser?.email) return

    try {
      const res = await fetch(
        `${API_BASE}/api/chat/threads/${threadId}/messages?ts=${Date.now()}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-User-Email": currentUser.email,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      )

      const json = await res.json()
      setMessages(Array.isArray(json) ? json : [])

      setTimeout(() => {
        flatListRef.current?.scrollToEnd?.({ animated: true })
        scrollViewRef.current?.scrollToEnd?.({ animated: false })
      }, 50)
    } catch (e) {
      console.warn("fetchMessages error", e)
      setMessages([])
    }
  }, [threadId, currentUser?.email])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // ✅ Realtime updates
  useEffect(() => {
    if (!threadId) return
    if (!currentUser?.email) return

    const socket = io(SOCKET_URL, { transports: ["websocket"] })
    socket.emit("thread:join", threadId)

    socket.on("message:new", (msg) => {
      if (msg.thread === threadId || msg.thread?._id === threadId) {
        setMessages((prev) => {
          const incomingId = msg._id || msg.id

          // ✅ 1) Replace optimistic bubble if matches
          const optimisticIndex = prev.findIndex((m) => {
            if (!m.__optimistic) return false
            const mEmail = m.senderEmail?.toLowerCase()
            const meEmail = currentUser?.email?.toLowerCase()
            return mEmail && meEmail && mEmail === meEmail && m.text === msg.text
          })

          if (optimisticIndex !== -1) {
            const copy = [...prev]
            copy[optimisticIndex] = {
              ...msg,
              senderEmail: currentUser.email,
              __fromMe: true,
              __optimistic: false,
            }
            return copy
          }

          // ✅ 2) Dedupe by id
          if (incomingId) {
            const exists = prev.some((m) => (m._id || m.id) === incomingId)
            if (exists) return prev
          }

          // ✅ 3) Mark mine as blue
          const socketSenderEmail = msg.senderEmail || msg.sender?.email
          const isMine =
            socketSenderEmail &&
            currentUser?.email &&
            socketSenderEmail.toLowerCase() === currentUser.email.toLowerCase()

          return [
            ...prev,
            isMine
              ? { ...msg, senderEmail: currentUser.email, __fromMe: true }
              : msg,
          ]
        })

        setTimeout(() => {
          flatListRef.current?.scrollToEnd?.({ animated: true })
          scrollViewRef.current?.scrollToEnd?.({ animated: false })
        }, 50)
      }
    })

    return () => socket.disconnect()
  }, [threadId, currentUser?.email])

  // ✅ Send to backend (optimistic first)
  const handleSend = async () => {
    if (!message.trim()) return
    if (!currentUser?.email) return

    const textToSend = message.trim()
    const localId = `local-${localIdRef.current++}`

    // optimistic bubble
    setMessages((prev) => [
      ...prev,
      {
        localId,
        text: textToSend,
        createdAt: new Date().toISOString(),
        senderEmail: currentUser.email,
        __fromMe: true,
        __optimistic: true,
      },
    ])

    setMessage("")
    setTimeout(() => {
      flatListRef.current?.scrollToEnd?.({ animated: true })
      scrollViewRef.current?.scrollToEnd?.({ animated: false })
    }, 50)

    try {
      const res = await fetch(`${API_BASE}/api/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": currentUser.email,
        },
        body: JSON.stringify({
          threadId,
          text: textToSend,
        }),
      })

      const msg = await res.json()
      if (!res.ok) throw new Error(msg?.error || "Send failed")
    } catch (e) {
      console.error("send message error:", e)
      Alert.alert("Error", e.message || "Could not send message")
      setMessages((prev) => prev.filter((m) => m.localId !== localId))
    }
  }

  const formatTimestamp = (d) => {
    if (!d) return ""
    const date = typeof d === "string" ? new Date(d) : d
    if (isNaN(date?.getTime?.())) return ""
    return date.toLocaleString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const renderMessage = ({ item }) => {
    const senderEmail =
      item.senderEmail || item.sender?.email || item.sender?.senderEmail

    const meEmail = currentUser?.email?.toLowerCase()
    const msgEmail = senderEmail?.toLowerCase()

    const isMe =
      item.__fromMe === true || (meEmail && msgEmail && msgEmail === meEmail)

    return (
      <View
        style={[
          styles.messageWrapper,
          { alignItems: isMe ? "flex-end" : "flex-start" },
        ]}
      >
        <Text
          style={[
            styles.timestamp,
            { alignSelf: isMe ? "flex-end" : "flex-start" },
          ]}
        >
          {formatTimestamp(item.createdAt || item.time)}
        </Text>

        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={[styles.bubbleText, isMe ? styles.textMe : styles.textOther]}>
            {item.text}
          </Text>
        </View>
      </View>
    )
  }

  const MessagesArea = () => {
    if (Platform.OS === "web") {
      return (
        <View style={styles.listWrapper}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.webScroll}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: false })
            }
          >
            {messages.map((m) => (
              <View key={m._id || m.id || m.localId}>
                {renderMessage({ item: m })}
              </View>
            ))}
          </ScrollView>
        </View>
      )
    }

    return (
      <View style={styles.listWrapper}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id || item.id || item.localId}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header (ONLY ONCE) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image
            source={require("../assets/icn_arrow_back.png")}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.fullName}</Text>
      </View>

      {/* Messages */}
      <MessagesArea />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ChatUserScreen
