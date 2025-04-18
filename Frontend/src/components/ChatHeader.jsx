import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-[#414868] bg-[#1a1b26]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img 
                src={selectedUser.profilePic || "/avatar.png"} 
                alt={selectedUser.fullName}
                className="object-cover"
              />
              {onlineUsers.includes(selectedUser._id) && (
                <span className="absolute right-0 bottom-0 size-3 bg-green-500 border-2 border-[#1a1b26] rounded-full"></span>
              )}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium text-[#a9b1d6]">{selectedUser.fullName}</h3>
            <p className={`text-sm ${onlineUsers.includes(selectedUser._id) ? 'text-green-400' : 'text-[#787c99]'}`}>
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={() => setSelectedUser(null)} 
          className="p-2 rounded-full hover:bg-[#414868] transition-colors"
        >
          <X className="text-[#a9b1d6]" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;