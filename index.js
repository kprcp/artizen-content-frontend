const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Trust proxy if deployed (Heroku, Vercel, etc.)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ✅ Middleware
app.use(helmet());            // Adds security headers
app.use(morgan('dev'));       // Logs HTTP requests
app.use(express.json());      // Parses incoming JSON

// ✅ CORS Setup
const allowedOrigins = [
  'http://localhost:8081',
  'http://localhost:8082',
  'http://localhost:8083',
  'http://localhost:19006',
  'http://localhost:19000',
  'http://127.0.0.1:19006',
  'http://127.0.0.1:8081'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// ✅ Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // 👈 This is what enables /api/auth/login, etc.

// ✅ Post Routes
const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes); // 👈 Added to handle posts

// ✅ Notification Routes
const notificationRoutes = require('./routes/notification');
app.use('/api/notifications', notificationRoutes); // 👈 Enables /api/notifications/create, etc.


// ✅ Health Check
app.get('/', (req, res) => {
  res.send('🟢 Backend is running');
});

// ❌ Handle 404s
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ❌ Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err.message || err.stack);
  res.status(500).json({ error: 'Server error occurred' });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
