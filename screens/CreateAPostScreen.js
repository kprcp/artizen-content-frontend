"use client"
import { useEffect, useState } from "react";
import Modal from "react-modal"; // ✅ RE-ENABLED for date/time picker
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts1/AuthContext";
import { usePostContext } from "../contexts1/PostContext"; // ✅ Use PostContext
import { styles } from "../styles/CreateAPostStyles";

Modal.setAppElement("#root") // ✅ Required for react-modal (web)

// ✅ Date helpers
const today = new Date()
const currentYear = today.getFullYear()

const CreateAPostScreen = ({ navigation }) => {
  const { user: currentUser } = useAuth()
  const { createPost, currentApiUrl } = usePostContext() // ✅ Get createPost from context
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false) // ✅ Add loading state
  
  // ✅ Date/Time selection state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  // 🔥 AI engagement prediction state
const [predictedEngagement, setPredictedEngagement] = useState(null)
const [isPredicting, setIsPredicting] = useState(false)


  // 🔥 AGGRESSIVE TITLE SETTING - Same as other screens
  useEffect(() => {
    const setTitleTab = () => {
      if (typeof document !== "undefined") {
        document.title = "Artizen"
      }
    }
    // Set immediately
    setTitleTab()
    // Set after a small delay to override anything else
    const timer1 = setTimeout(setTitleTab, 100)
    const timer2 = setTimeout(setTitleTab, 500)
    const timer3 = setTimeout(setTitleTab, 1000)
    // Set on focus (when user clicks on tab)
    const handleFocus = () => setTitleTab()
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

 // Use current date/time for defaults
  const now = new Date()

  const [month, setMonth] = useState(now.getMonth())
  const [day, setDay] = useState(String(now.getDate()).padStart(2, "0"))
  const [year, setYear] = useState(now.getFullYear())

  // Convert 24h → 12h format automatically
  let currentHour = now.getHours()
  const defaultAmpm = currentHour >= 12 ? "PM" : "AM"
  currentHour = currentHour % 12
  if (currentHour === 0) currentHour = 12

  const [hour, setHour] = useState(String(currentHour).padStart(2, "0"))
  const [minute, setMinute] = useState(String(now.getMinutes()).padStart(2, "0"))
  const [ampm, setAmpm] = useState(defaultAmpm)

  // ✅ Date/Time helper arrays and functions (ENABLED)
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i)
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))
  const getDaysInMonth = (monthIndexOrName, y) => {
    const monthIndex =
      typeof monthIndexOrName === "string" ? months.indexOf(monthIndexOrName) : monthIndexOrName
    return new Date(y, monthIndex + 1, 0).getDate()
  }
  const days = Array.from({ length: getDaysInMonth(month, year) }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  )

  const handleConfirm = () => {
  let finalHour = parseInt(hour, 10)
  if (ampm === "PM" && finalHour !== 12) finalHour += 12
  if (ampm === "AM" && finalHour === 12) finalHour = 0

  const finalDate = new Date(
    year,
    typeof month === "string" ? months.indexOf(month) : month,
    parseInt(day, 10),
    finalHour,
    parseInt(minute, 10),
  )

  const now = new Date()

  // 🔒 Block past dates/times
  if (finalDate < now) {
    alert("Please choose a date and time in the future.")
    return // 🚫 Do NOT close modal or update selectedDate
  }

  setSelectedDate(finalDate)
  setIsModalOpen(false)
}


  useEffect(() => {
    const maxDay = getDaysInMonth(month, year)
    if (parseInt(day, 10) > maxDay) {
      setDay(String(maxDay).padStart(2, "0"))
    }
  }, [month, year])

  // 🔮 Run AI engagement prediction whenever date changes
useEffect(() => {
  const runPrediction = async () => {
    try {
      setIsPredicting(true)

      const targetDate = selectedDate || new Date()

      // 🔑 derive base /api URL from currentApiUrl
      // dev:  http://localhost:5001/api/posts -> http://localhost:5001/api
      // prod: https://api.artizen.world/api/posts -> https://api.artizen.world/api
      const baseApiUrl = currentApiUrl.replace(/\/posts$/, "")

      const response = await fetch(`${baseApiUrl}/engagement/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: "twitch",
          timestamp: targetDate.toISOString(),
        }),
      })

      console.log("Prediction response status:", response.status)

      if (!response.ok) {
        throw new Error("Prediction API error")
      }

      const data = await response.json()
      console.log("Prediction data:", data)

      const level = data.level || data.prediction || null
      setPredictedEngagement(level)
    } catch (err) {
      console.error("Engagement prediction error:", err)
      setPredictedEngagement(null)
    } finally {
      setIsPredicting(false)
    }
  }

  runPrediction()
}, [selectedDate, currentApiUrl])



  const formatDateTime = (date) => {
    if (!date) return "Now"
    const formattedMonth = months[date.getMonth()]
    const _day = date.getDate()
    const _year = date.getFullYear()
    let _hour = date.getHours()
    const _minute = date.getMinutes().toString().padStart(2, "0")
    const _ampm = _hour >= 12 ? "PM" : "AM"
    _hour = _hour % 12
    _hour = _hour ? _hour : 12
    return `${formattedMonth} ${_day}, ${_year}, ${_hour}:${_minute} ${_ampm}`
  }


  const getEngagementColor = (level) => {
  if (!level) return "gray"

  const normalized = level.toLowerCase()

  if (normalized === "high" || normalized === "high-medium") return "red"
  if (normalized === "medium") return "orange"
  if (normalized === "medium-low") return "green"
  if (normalized === "low") return "gray"

  return "gray"
}


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/icn_arrow_back.png")}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/logo_artizen.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.profileTextContainer}>
        <Text style={styles.profileName}>Create a New Post</Text>

        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.bigInput}
          placeholder="Write A Post..."
          placeholderTextColor="#999"
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={500}
        />

        {/* ✅ Date/Time selection UI (ENABLED) */}
        <View style={styles.dateTimeBox}>
          <Text style={styles.nowText}>{formatDateTime(selectedDate)}</Text>
          <TouchableOpacity onPress={() => setIsModalOpen(true)}>
            <Image
              source={require("../assets/icn_calender.png")}
              style={styles.calendarIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={async () => {
            if (!title.trim() || !content.trim()) {
              alert("Please enter both title and content")
              return
            }

            setIsLoading(true) // ✅ Set loading

            const now = new Date()

const postBody = {
  title,
  content,

  // 🔑 KEY PART: this is the “go live at” time
  timestamp: (selectedDate || now).toISOString(),

  userEmail: currentUser.email,
  fullName: currentUser.fullName,
  profileImage: currentUser.profileImage,
}



            try {
              console.log("🚀 Creating post with API URL:", currentApiUrl)
              // ✅ Use PostContext's createPost instead of direct fetch
              await createPost(postBody)

              // Clear form
              setTitle("")
              setContent("")
              // Optionally clear scheduled date as well
              setSelectedDate(null)

              navigation.navigate("PostPage", {
                title,
                content,
                fullName: currentUser.fullName,
                profileImage: currentUser.profileImage,
              })
            } catch (err) {
              console.error("Post creation error:", err)
              alert("Something went wrong.")
            } finally {
              setIsLoading(false) // ✅ Clear loading
            }
          }}
          disabled={isLoading} // ✅ Disable when loading
        >
          <Text style={styles.updateButtonText}>
            {isLoading ? "Creating..." : "Post"} {/* ✅ Show loading text */}
          </Text>
        </TouchableOpacity>
<View style={{ marginTop: 14, alignItems: "center" }}>
  <Text
    style={[
      styles.profileName,
      { fontSize: 16, lineHeight: 22 },
    ]}
  >
    Predicted Engagement on Twitch for{" "}
    <Text style={{ fontWeight: "600" }}>
      {formatDateTime(selectedDate)}
    </Text>
    :{" "}
    <Text
      style={[
        styles.profileName,
        {
          fontSize: 16,
          lineHeight: 22,
          color: getEngagementColor(predictedEngagement),
        },
      ]}
    >
      {isPredicting
        ? "Loading..."
        : predictedEngagement
        ? predictedEngagement
        : "Unknown"}
    </Text>
  </Text>
</View>

        {/* ✅ REMOVED: API indicator text */}
      </View>

      {/* ✅ Date/Time selection Modal (ENABLED for web) */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            maxWidth: 650,
            margin: "auto",
            borderRadius: 10,
            padding: 20,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            position: "relative",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        }}
      >
        <TouchableOpacity
          style={{ position: "absolute", top: 10, right: 15, zIndex: 10 }}
          onPress={() => setIsModalOpen(false)}
        >
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>×</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Select Date</Text>
        <View style={styles.row}>
          <select
            value={typeof month === "string" ? month : months[month]}
            onChange={(e) => setMonth(e.target.value)}
            style={styles.select}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <Text style={styles.separator}>/</Text>
          <select value={day} onChange={(e) => setDay(e.target.value)} style={styles.select}>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <Text style={styles.separator}>/</Text>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            style={styles.select}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </View>

        <Text style={styles.sectionTitle}>Select Time</Text>
        <View style={styles.row}>
          <select value={hour} onChange={(e) => setHour(e.target.value)} style={styles.select}>
            {hours.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <Text style={styles.separator}>:</Text>
          <select value={minute} onChange={(e) => setMinute(e.target.value)} style={styles.select}>
            {minutes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={ampm}
            onChange={(e) => setAmpm(e.target.value)}
            style={styles.select}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </View>

        <button onClick={handleConfirm} style={styles.confirmButton}>
          Select
        </button>
      </Modal>
    </View>
  )
}

export default CreateAPostScreen
