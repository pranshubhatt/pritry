import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4000',
  'https://pritry-frontend.onrender.com',
  'https://pritry.onrender.com',
  'https://pritry-1.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Origin blocked:', origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
};

app.use(cors(corsOptions));

// Socket.IO CORS configuration
if (server._opts) {
  server._opts.cors = {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
}

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Chat API is running',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      messages: '/api/messages/*'
    }
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    env: process.env.NODE_ENV,
    port: PORT
  });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../dist");
  
  try {
    const { existsSync } = await import('fs');
    if (existsSync(frontendDistPath)) {
      console.log("Frontend dist directory found at:", frontendDistPath);
      
      // Serve static files
      app.use(express.static(frontendDistPath));
      
      // Handle client-side routing - must be after API routes
      app.get("*", (req, res) => {
        res.sendFile(path.join(frontendDistPath, "index.html"));
      });
    } else {
      console.log("Frontend dist directory not found at:", frontendDistPath);
    }
  } catch (error) {
    console.error("Error serving static files:", error.message);
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`Server directory: ${__dirname}`);
  console.log('Allowed Origins:', allowedOrigins);
  connectDB();
});
