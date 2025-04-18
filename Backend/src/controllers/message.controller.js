import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.models.js";

export const getUsersForSidebars = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error getUserForSidebars:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    console.log(`Fetching messages between ${myId} and ${userToChatId}`);

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // Sort messages by creation time

    console.log(`Found ${messages.length} messages`);
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    console.log(`Sending message from ${senderId} to ${receiverId}`);

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required" });
    }

    let imageUrl;
    if (image) {
      try {
        console.log("Uploading image to Cloudinary...");
        const uploadResponse = await cloudinary.uploader.upload(image, {
          resource_type: 'auto',
          timeout: 120000, // Longer timeout for larger images
          transformation: [
            { quality: "auto" },
            { fetch_format: "auto" },
            { width: 1000, crop: "limit" } // Limit size for better performance
          ]
        });
        imageUrl = uploadResponse.secure_url;
        console.log("Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        // Continue without image if upload fails
        imageUrl = null;
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    console.log("Message saved to database:", newMessage._id);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      console.log(`Emitting message to receiver ${receiverId} with socket ${receiverSocketId}`);
      io.to(receiverSocketId).emit("newMessage", newMessage);
    } else {
      console.log(`Receiver ${receiverId} is not online. Message will be delivered when they connect.`);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in send message", error.message);
    res.status(500).json({ message: "Failed to send message. Please try again." });
  }
};
