import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-[#1a1b26]">
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="size-20 rounded-full bg-[#24283b] flex items-center justify-center">
            <MessageSquare className="size-10 text-[#7aa2f7]" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-[#a9b1d6]">
          Welcome to ChatMate!
        </h1>
        <p className="text-[#787c99] mb-8">
          Select a conversation from the sidebar to start chatting with your contacts.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
