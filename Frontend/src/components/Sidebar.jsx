import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeleton/Sidebarskeleton";
import { Users, RefreshCw } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [retryCount]);

  const fetchUsers = async () => {
    const success = await getUsers();
    // If users are empty and this wasn't a success, we might need to retry
    if (!success && users.length === 0 && retryCount < 3) {
      console.log("Retrying user fetch in 2 seconds...");
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 2000);
    }
  };

  // Sort users: online users first
  const sortedUsers = [...users].sort((a, b) => {
    const aOnline = onlineUsers.includes(a._id);
    const bOnline = onlineUsers.includes(b._id);
    return aOnline === bOnline ? 0 : aOnline ? -1 : 1;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-[#414868] flex flex-col transition-all duration-200 bg-[#1a1b26] user-list-dark">
      <div className="border-b border-[#414868] w-full p-5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="size-6 text-[#7aa2f7]" />
          <span className="font-medium hidden lg:block text-[#a9b1d6]">Contacts</span>
        </div>
        
        {/* Refresh button */}
        {(retryCount > 0 || users.length === 0) && (
          <button 
            onClick={() => setRetryCount(prev => prev + 1)}
            className="btn btn-circle btn-xs"
            title="Refresh contacts"
          >
            <RefreshCw className="size-3 text-[#7aa2f7]" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {sortedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-[#787c99]">
            <Users className="size-12 mb-2 text-[#414868]" />
            <p>No contacts found</p>
            <p className="text-xs mt-1">Try refreshing or create a new account</p>
            <button 
              className="mt-4 btn btn-sm btn-outline text-[#7aa2f7] border-[#7aa2f7] hover:bg-[#7aa2f7] hover:text-[#1a1b26]"
              onClick={() => setRetryCount(prev => prev + 1)}
            >
              <RefreshCw className="size-4 mr-2" /> Refresh
            </button>
          </div>
        ) : (
          <ul className="overflow-auto">
            {sortedUsers.map((user) => {
              const isOnline = onlineUsers.includes(user._id);
              const isSelected = selectedUser?._id === user._id;
              
              return (
                <li key={user._id} className="px-2 py-1">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg transition-all user-card ${
                      isSelected ? 'active bg-[#414868]' : 'hover:bg-[#24283b]'
                    }`}
                  >
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full relative">
                        <img
                          src={user.profilePic || "/avatar.png"}
                          alt={user.fullName}
                          className="object-cover"
                        />
                        {isOnline && (
                          <span className="absolute right-0 bottom-0 size-3 bg-green-500 border-2 border-base-100 rounded-full"></span>
                        )}
                      </div>
                    </div>
                    <div className="hidden lg:block text-left">
                      <h3 className={`font-medium ${isSelected ? 'text-white' : 'text-[#a9b1d6]'}`}>
                        {user.fullName}
                      </h3>
                      <p className={`text-xs ${isOnline ? 'text-green-400' : 'text-[#787c99]'}`}>
                        {isOnline ? "Online" : "Offline"}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
