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
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
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
    if (!authUser || get().socket?.connected) return;

    console.log("Attempting to connect socket for user:", authUser._id);
    
    try {
      const socket = io(BACKEND_URL, {
        query: {
          userId: authUser._id,
        },
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      socket.on("connect", () => {
        console.log("Socket connected successfully:", socket.id);
        set({ socket: socket });
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
        toast.error("Connection issue. Please refresh the page.");
      });

      socket.on("getOnlineUsers", (userIds) => {
        console.log("Online users received:", userIds);
        set({ onlineUsers: userIds });
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        if (reason === "io server disconnect") {
          // the disconnection was initiated by the server, reconnect manually
          socket.connect();
        }
      });

      socket.connect();
    } catch (error) {
      console.error("Error initializing socket:", error);
      toast.error("Connection issue. Please refresh the page.");
    }
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      console.log("Disconnecting socket");
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
