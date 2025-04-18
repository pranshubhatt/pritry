import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4000',
  'https://frontend-2c5v.onrender.com', 
  'https://backend-yzux.onrender.com',
  'https://pritry-frontend.onrender.com',
  'https://pritry.onrender.com',
  'https://pritry-1.onrender.com',
  '*' // Allow all origins during development and testing
];

const io = new Server(server, {
  pingTimeout: 60000,
  pingInterval: 25000,
  cors: {
    origin: function(origin, callback) {
      console.log("Socket connection attempt from origin:", origin);
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        console.log("Socket origin blocked:", origin);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
  },
  cookie: {
    name: "jwt",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production"
  }
});

export function getReceiverSocketId(userId){
  return userSocketMap[userId]
}

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user Connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    console.log(`User ${userId} connected with socket ${socket.id}`);
    userSocketMap[userId] = socket.id;
  }

  // Broadcast online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle specific socket errors
  socket.on("error", (error) => {
    console.error("Socket error for", socket.id, ":", error);
  });

  socket.on("disconnect", (reason) => {
    console.log("A User Disconnected", socket.id, "reason:", reason);

    // find and remove the userId associated with this socket.id
    for (const id in userSocketMap) {
      if (userSocketMap[id] === socket.id) {
        console.log(`User ${id} disconnected`);
        delete userSocketMap[id];
        break;
      }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));    
  });
});

// Handle global socket.io errors
io.engine.on("connection_error", (err) => {
  console.error("Connection error:", err.req, err.code, err.message, err.context);
});

export { io, app, server };
