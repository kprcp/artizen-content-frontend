"use client"

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useCallback, useEffect, useRef, useState } from "react"
import { Animated, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import io from "socket.io-client"
import { useAuth } from "../contexts1/AuthContext"
import { navigate } from "../contexts1/NavigationService"



// Screens
import ChatScreen from "./ChatScreen"
import MyProfileScreen from "./MyProfileScreen"
import SearchStack from "./SearchStack"
import WorldStack from "./WorldStack"


// Icons
import icnAddBlue from "../assets/icn_add_blue.png"
import icnChatGray from "../assets/icn_chat_gray.png"
import icnDiaryBlue from "../assets/icn_diary_blue.png"
import icnSearchBlue from "../assets/icn_search_blue.png"
import icnSearchGray from "../assets/icn_search_gray.png"
import icnUserBlue from "../assets/icn_user_blue.png"
import icnUserGray from "../assets/icn_user_gray.png"
import icnWorldGray from "../assets/icn_world_gray.png"


// ✅ Smart API URL (same logic as Chat/ChatUserScreen)
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




const { height } = Dimensions.get("window")
const Tab = createBottomTabNavigator()

const BottomTabNavigator = () => {
  const { user: currentUser } = useAuth()

  const [modalVisible, setModalVisible] = useState(false)
  const slideAnim = useRef(new Animated.Value(height * 0.4)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  const [threads, setThreads] = useState([])

    // 🔁 Fetch threads for unread badge
  const fetchThreads = useCallback(async () => {
    try {
      if (!currentUser?.email) return

      const res = await fetch(
        `${API_BASE}/api/chat/threads?ts=${Date.now()}`,
        {
          headers: {
            "X-User-Email": currentUser.email,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      )

      const data = await res.json()
      setThreads(Array.isArray(data) ? data : [])
    } catch (e) {
      console.warn("BottomTabNavigator threads error", e)
      setThreads([])
    }
  }, [currentUser?.email])

  useEffect(() => {
    fetchThreads()
  }, [fetchThreads])


   // 🔔 Listen for global new-message events and refresh threads
    // 🔔 Listen for GLOBAL new-message events and refresh threads
  useEffect(() => {
    if (!currentUser?.email) return

    const socket = io(SOCKET_URL, { transports: ["websocket"] })

    socket.on("message:new-global", () => {
      fetchThreads()
    })

    return () => socket.disconnect()
  }, [fetchThreads, currentUser?.email])



  
    // 🧮 Compute unread count: number of DIFFERENT users
  // whose last message in their thread is from THEM (not me)
  const unreadSenders = new Set()

  threads.forEach((t) => {
    const lm = t.lastMessage
    if (!lm) return

    const text =
      (typeof lm === "string" && lm) ||
      lm?.text ||
      lm?.[0]?.text

    // ignore threads with no real last message text
    if (!text || !text.trim()) return

    const senderEmail =
      lm?.sender?.email ||
      lm?.senderEmail ||
      lm?.sender?.senderEmail

    const me = currentUser?.email?.toLowerCase()
    const s = senderEmail?.toLowerCase()

    // only count if last message is from someone else
    if (!me || !s) return
// remove the s === me check → every thread with a last message counts
unreadSenders.add(s)

    // add this sender to the “unread” set
    unreadSenders.add(s)
  })

  const unreadCount = unreadSenders.size

 // 👇 ADD THIS
  console.log("CHAT BADGE DEBUG", {
    currentUserEmail: currentUser?.email,
    unreadCount,
    threads,
  })
  const openModal = () => {
    setModalVisible(true)
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height * 0.4,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false))
  }

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="World"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#F7F7F7",
            height: height * 0.1,
            paddingBottom: height * 0.015,
            paddingTop: 5,
          },
        }}
      >
        <Tab.Screen
          name="World"
          component={WorldStack}
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={icnWorldGray}
                  style={{
                    width: 28,
                    height: 28,
                    tintColor: focused ? "#007AFF" : "#333",
                  }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: focused ? "#007AFF" : "#333",
                    marginTop: 2,
                  }}
                >
                  World
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Search"
          component={SearchStack}
          options={{
            tabBarLabel: "",
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={focused ? icnSearchBlue : icnSearchGray}
                  style={{
                    width: 28,
                    height: 28,
                    tintColor: focused ? "#007AFF" : "#333",
                  }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: focused ? "#007AFF" : "#333",
                    marginTop: 2,
                  }}
                >
                  Search
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="AddPost"
          component={View} // dummy screen to intercept tab press
          listeners={{
            tabPress: (e) => {
              e.preventDefault()
              openModal() // show modal instead of navigating
            },
          }}
          options={{
            tabBarLabel: "",
            tabBarIcon: () => <Image source={icnAddBlue} style={{ width: 50, height: 50, marginBottom: -10 }} />,
          }}
        />

        {/* Placeholder to preserve tab layout and keep AddPost icon centered 
        <Tab.Screen
          name="Placeholder"
          component={() => null}
          options={{
            tabBarLabel: "",
            tabBarIcon: () => null,
            tabBarButton: () => null,
          }}
        />
        */}

               <Tab.Screen
  name="Chat"
  component={ChatScreen}
  options={{
    tabBarLabel: "",
    tabBarIcon: ({ focused }) => {
      const hasUnread = unreadCount > 0
      const badgeText = unreadCount > 10 ? "10+" : String(unreadCount || "")

      const activeColor = "#007AFF"
      const inactiveColor = "#333"
      const tint = focused || hasUnread ? activeColor : inactiveColor

      return (
        <View style={{ alignItems: "center" }}>
          <View style={{ position: "relative" }}>
            <Image
              source={icnChatGray}
              style={{
                width: 28,
                height: 28,
                tintColor: tint,
              }}
            />
            {hasUnread && (
              <View style={styles.chatBadge}>
                <Text style={styles.chatBadgeText}>{badgeText}</Text>
              </View>
            )}
          </View>
          <Text
            style={{
              fontSize: 12,
              color: tint,
              marginTop: 2,
            }}
          >
            Chat
          </Text>
        </View>
      )
    },
  }}
/>


<Tab.Screen
  name="MyProfileScreen"
  component={MyProfileScreen}
  options={{
    tabBarLabel: "",
    tabBarIcon: ({ focused }) => (
      <View style={{ alignItems: "center" }}>
        <Image
          source={focused ? icnUserBlue : icnUserGray}
          style={{
            width: 28,
            height: 28,
            tintColor: focused ? "#007AFF" : "#333",
          }}
        />
        <Text
          style={{
            fontSize: 12,
            color: focused ? "#007AFF" : "#333",
            marginTop: 2,
          }}
        >
          Profile
        </Text>
      </View>
    ),
  }}
/>

      </Tab.Navigator>

      {/* Modal */}
      {modalVisible && <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />}
      <Modal transparent visible={modalVisible} animationType="none">
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.createPostText}>Create a post</Text>
            <TouchableOpacity
              style={styles.centeredBox}
              onPress={() => {
                closeModal()
                navigate("CreateAPostScreen") // ✅ uses global navigation
              }}
            >
              <Image source={icnDiaryBlue} style={styles.boxIcon} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  )
}

export default BottomTabNavigator

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomSheet: {
    width: "50%",
    alignSelf: "center",  
    height: height * 0.33,
    backgroundColor: "#F7F7F7",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    right: 15,
    top: 10,
    backgroundColor: "#eee",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#333",
  },
  createPostText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  centeredBox: {
    width: "20%",
    height: height * 0.12,
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  boxIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
    chatBadge: {
    position: "absolute",
    top: -4,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 3,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  chatBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },

})
