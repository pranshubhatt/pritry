import { useChatStore } from "../store/useChatStore";   

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-[#1a1b26]">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-[#1a1b26] rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)] border border-[#414868]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
