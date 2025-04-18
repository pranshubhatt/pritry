import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { BACKEND_URL, API_ENDPOINTS } from "../config/api.js";

// Helper function to safely extract error messages
const getErrorMessage = (error) =>
  error?.response?.data?.message || "Something went wrong. Please try again.";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  checkAuth: async () => {
    try {
      console.log("Checking authentication status...");
      const res = await axiosInstance.get("/auth/check");
      console.log("Auth check successful, user found");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      
      // Clear any existing auth state if unauthorized
      if (error?.response?.status === 401) {
        console.log("Unauthorized response, clearing auth state");
        set({ authUser: null });
      } else {
        console.error("Unexpected error during auth check:", error?.message || "Unknown error");
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(getErrorMessage(error));
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser) {
      console.log("No auth user found for socket connection");
      return;
    }
    
    // Don't reconnect if already connected
    if (get().socket?.connected) {
      console.log("Socket already connected, skipping connection");
      return;
    }

    console.log("Attempting to connect socket for user:", authUser._id);
    
    try {
      const socket = io(BACKEND_URL, {
        query: {
          userId: authUser._id,
        },
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000
      });

      socket.on("connect", () => {
        console.log("Socket connected successfully:", socket.id);
        set({ socket: socket });
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
        // Only show toast on first connection error to avoid spam
        if (!get().socket) {
          toast.error("Connection issue. Chat features may be limited.");
        }
      });

      socket.on("getOnlineUsers", (userIds) => {
        console.log("Online users received:", userIds.length);
        set({ onlineUsers: userIds });
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        if (reason === "io server disconnect" || reason === "transport close") {
          // The disconnection was initiated by the server or transport was closed, attempt to reconnect
          setTimeout(() => {
            console.log("Attempting to reconnect socket...");
            socket.connect();
          }, 3000);
        }
      });

      socket.on("reconnect", (attemptNumber) => {
        console.log("Socket reconnected after", attemptNumber, "attempts");
      });

      socket.on("reconnect_error", (error) => {
        console.error("Socket reconnection error:", error.message);
      });

      socket.on("reconnect_failed", () => {
        console.error("Socket reconnection failed after all attempts");
        toast.error("Failed to connect to chat server. Please refresh the page.");
      });

      socket.connect();
      return socket;
    } catch (error) {
      console.error("Error initializing socket:", error);
      return null;
    }
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      console.log("Disconnecting socket");
      if (socket.connected) {
        socket.disconnect();
      }
      set({ socket: null, onlineUsers: [] });
    }
  },
}));
