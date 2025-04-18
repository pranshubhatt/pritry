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
  'https://pritry-frontend.onrender.com',
  'https://pritry.onrender.com',
  'https://pritry-1.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log('Origin blocked:', origin);
    }
    // Allow all origins during development
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));

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
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Only try to serve static files if they exist
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../../Frontend/dist");
  
  try {
    // Using import.meta.url for ES modules
    if (import.meta.url.startsWith('file:')) {
      const { existsSync } = await import('fs');
      const distExists = existsSync(frontendDistPath);
      
      if (distExists) {
        console.log("Frontend dist directory found at:", frontendDistPath);
        app.use(express.static(frontendDistPath));
        app.get("*", (req, res) => {
          res.sendFile(path.join(frontendDistPath, "index.html"));
        });
      } else {
        console.log("Frontend dist directory not found at:", frontendDistPath);
      }
    }
  } catch (error) {
    console.log("Error checking frontend dist directory:", error.message);
  }
}

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`Server directory: ${__dirname}`);
  console.log('Allowed Origins:', allowedOrigins);
  connectDB();
});
