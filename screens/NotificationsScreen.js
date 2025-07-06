"use client"

import { useEffect, useState } from "react"
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import { useAuth } from "../contexts1/AuthContext"
import NotificationStyles from "../styles/NotificationsStyles"
import SettingsStyle from "../styles/SettingsStyle"; // use the same header styles

const NotificationsScreen = ({ navigation }) => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    if (!user?.email) return

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`https://api.artizen.world/api/notifications/${user.email}`)
        const data = await res.json()
        if (data.success) {
          setNotifications(data.notifications)
        } else {
          console.error("Failed to load notifications")
        }
      } catch (err) {
        console.error("Error fetching notifications:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user])

  const renderItem = ({ item }) => {
    let message = ""
    if (item.type === "like") {
      message = `${item.senderName} liked your post.`
    } else if (item.type === "comment") {
      message = `${item.senderName} commented on your post.`
    } else if (item.type === "follow") {
      message = `${item.senderName} followed you.`
    }

    return (
      <View style={NotificationStyles.notificationItem}>
        <Text style={NotificationStyles.notificationText}>{message}</Text>
        <Text style={NotificationStyles.timeText}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
    )
  }

  return (
    <View style={NotificationStyles.container}>
      {/* ✅ Matching header to Settings screen */}
      <View style={SettingsStyle.header}>
        <TouchableOpacity style={SettingsStyle.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Image source={require("../assets/icn_arrow_back.png")} style={SettingsStyle.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <View style={SettingsStyle.logoContainer} pointerEvents="none">
          <Image source={require("../assets/logo_artizen.png")} style={SettingsStyle.logo} resizeMode="contain" />
        </View>
      </View>

      {/* Content */}
      <View style={NotificationStyles.content}>
        {loading ? (
          <Text style={NotificationStyles.text}>Loading...</Text>
        ) : notifications.length === 0 ? (
          <Text style={NotificationStyles.text}>No notifications yet.</Text>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  )
}

export default NotificationsScreen
