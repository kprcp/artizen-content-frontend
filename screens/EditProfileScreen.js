const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5001

// ✅ Trust proxy if deployed (Heroku, Vercel, AWS EB, etc.)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1)
}

// ✅ Middleware
app.use(helmet()) // Adds security headers
app.use(morgan("dev")) // Logs HTTP requests
app.use(express.json({ limit: "50mb" })) // ✅ Updated to handle base64 images

// ✅ UPDATED CORS SECTION - Added your actual domains
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://api.artizen.world", // Your backend domain
        "https://artizen.world", // Your main domain
        "https://www.artizen.world", // With www
        "https://your-frontend-domain.com", // Replace with actual frontend domain
        "https://your-app-name.vercel.app", // If using Vercel
      ]
    : [
        "http://localhost:8081", // Your local development
        "http://localhost:3000", // Alternative local port
        "http://localhost:5001", // Backend port for testing
      ]

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
  }),
)

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected")
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err)
  })

// ✅ Import existing User model (instead of creating duplicate)
const User = require("./models/User")

// ✅ Profile Image Update Endpoint
app.post("/api/auth/update-profile-image", async (req, res) => {
  try {
    const { email, profileImage } = req.body

    if (!email || !profileImage) {
      return res.status(400).json({
        message: "Email and profileImage are required",
      })
    }

    const user = await User.findOneAndUpdate(
      { email: email.trim() },
      {
        profileImage: profileImage,
        updatedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    )

    console.log(`[${new Date().toISOString()}] ✅ Profile image updated for:`, email)
    res.json({
      message: "Profile image updated successfully",
      user: user,
    })
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Error updating profile image:`, error)
    res.status(500).json({
      message: "Error updating profile image",
      error: error.message,
    })
  }
})

// ✅ Auth Routes
const authRoutes = require("./routes/auth")
app.use("/api/auth", authRoutes)

// ✅ Post Routes
const postRoutes = require("./routes/posts")
app.use("/api/posts", postRoutes)

// ✅ Notification Routes
const notificationRoutes = require("./routes/notification")
app.use("/api/notifications", notificationRoutes)

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("🟢 Backend is running")
})

// ❌ Handle 404s
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint not found" })
})

// ❌ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled Error:", err.message || err.stack)
  res.status(500).json({ error: "Server error occurred" })
})

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})