import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeleton/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { MessageSquare, RefreshCw } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const [retryCount, setRetryCount] = useState(0);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser?._id) return;

    fetchMessages();
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser?._id, retryCount]);

  const fetchMessages = async () => {
    if (!selectedUser?._id) return;
    
    await getMessages(selectedUser._id);
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-[#1a1b26]">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-[#1a1b26]">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-[#787c99]">
            <MessageSquare className="size-12 mb-2 text-[#414868]" />
            <p>No messages yet</p>
            <p className="text-xs mt-1">Send your first message to start the conversation</p>
            
            <button 
              className="mt-4 btn btn-sm btn-outline text-[#7aa2f7] border-[#7aa2f7] hover:bg-[#7aa2f7] hover:text-[#1a1b26]"
              onClick={() => setRetryCount(prev => prev + 1)}
            >
              <RefreshCw className="size-4 mr-2" /> Refresh
            </button>
          </div>
        ) : (
          messages.map((message, index) => {
            const isLast = index === messages.length - 1;
            const isOwnMessage = message.senderId === authUser._id;

            return (
              <div
                key={message._id}
                className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
                ref={isLast ? messageEndRef : null}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border border-[#414868]">
                    <img
                      src={
                        isOwnMessage
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1 text-[#787c99]">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>

                <div className={`chat-bubble flex flex-col max-w-xs break-words ${
                  isOwnMessage ? "chat-bubble-accent bg-[#7aa2f7] text-[#1a1b26]" : "chat-bubble-dark bg-[#414868] text-[#a9b1d6]"
                }`}>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="sm:max-w-[200px] rounded-md mb-2 object-cover"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            );
          })
        )}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
