import { useRef, useState } from "react"
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import styles from "../styles/ChatUserStyles"

const ChatUserScreen = ({ route, navigation }) => {
  const { user } = route.params
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const flatListRef = useRef()

  const handleSend = () => {
    if (!message.trim()) return

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "me",
      time: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setMessage("")
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  const formatTimestamp = (date) => {
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
    return (
      <View style={styles.messageWrapper}>
        <Text style={styles.timestamp}>
          {formatTimestamp(item.time)}
        </Text>
        <View style={[styles.bubble, item.sender === "me" ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={[styles.bubbleText, item.sender === "me" ? styles.textMe : styles.textOther]}>
            {item.text}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require("../assets/icn_arrow_back.png")} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.fullName}</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

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
    </KeyboardAvoidingView>
  )
}

export default ChatUserScreen
