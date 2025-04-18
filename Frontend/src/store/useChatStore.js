import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      console.log("Fetching users...");
      const res = await axiosInstance.get("/messages/users");
      console.log("Users fetched successfully:", res.data.length);
      set({ users: res.data });
    } catch (error) {
      console.error("Error fetching users:", error);
      const errorMessage = error?.response?.data?.message || "Failed to load contacts";
      toast.error(errorMessage);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true, messages: [] });
    try {
      console.log("Fetching messages for user:", userId);
      const res = await axiosInstance.get(`/messages/${userId}`);
      console.log("Messages fetched successfully:", res.data.length);
      set({ messages: res.data });
    } catch (error) {
      console.error("Error fetching messages:", error);
      const errorMessage = error?.response?.data?.message || "Failed to load messages";
      toast.error(errorMessage);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (data) => {
    const { selectedUser, messages } = get();
    set({ isSendingMessage: true });
    try {
      console.log("Sending message to user:", selectedUser._id);
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, data);
      console.log("Message sent successfully");
      set({ messages: [...messages, res.data] });
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = error?.response?.data?.message || "Failed to send message";
      toast.error(errorMessage);
      return false;
    } finally {
      set({ isSendingMessage: false });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.warn("Socket not available for subscribing to messages");
      return;
    }

    console.log("Subscribing to messages for user:", selectedUser._id);
    
    socket.on("newMessage", (newMessage) => {
      console.log("New message received:", newMessage);
      if (newMessage.senderId !== selectedUser._id) return;
      
      set({
        messages: [...get().messages, newMessage]
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.warn("Socket not available for unsubscribing from messages");
      return;
    }
    
    console.log("Unsubscribing from messages");
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => {
    console.log("Setting selected user:", selectedUser?.fullName);
    set({ selectedUser });
  },
}));
