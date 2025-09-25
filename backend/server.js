const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatbot");
const projectRoutes = require("./routes/projectRoutes");
const aiMentorRoutes = require("./routes/aiMentorRoutes");
require('dotenv').config();

const app = express();
app.set('trust proxy', 1);

// CORS: allow Render or configured origin in production; allow localhost in dev
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser or same-origin requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // allow Render preview deploys wildcard e.g., https://*.onrender.com
    if (/^https?:\/\/[^\.]+\.onrender\.com$/.test(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

// connect to DB
require("./db");

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/ai-mentor", aiMentorRoutes);

// Healthcheck for Render
app.get('/healthz', (req, res) => {
  const state = mongoose.connection.readyState; // 1 connected, 2 connecting
  res.status(200).json({ status: 'ok', db: state });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Codexa API running' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', message);
  }
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
