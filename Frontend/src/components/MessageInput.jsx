import React, { useState, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { Image, Loader, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const { sendMessage, isSendingMessage } = useChatStore();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image to upload");
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Image size must be under 10MB. Current size: ${Math.round(file.size/1024/1024)}MB`);
      return;
    }

    // Create object URL for preview (more efficient)
    setImagePreview(URL.createObjectURL(file));
    
    // Read file as data URL for sending
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageData(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // Clean up object URL
      setImagePreview(null);
    }
    setImageData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imageData) return;
    if (isSubmitting || isSendingMessage) return;

    setIsSubmitting(true);
    
    try {
      const success = await sendMessage({
        text: text.trim(),
        image: imageData,
      });

      if (success) {
        setText("");
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview); // Clean up object URL
          setImagePreview(null);
        }
        setImageData(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = (!text.trim() && !imageData) || isSubmitting || isSendingMessage;

  return (
    <div className="p-4 w-full bg-[#1a1b26] border-t border-[#414868]">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-[#414868]"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#24283b]
              flex items-center justify-center hover:bg-[#414868] transition-colors"
              type="button"
              disabled={isSubmitting || isSendingMessage}
            >
              <X className="size-3 text-[#a9b1d6]" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md bg-[#24283b] text-[#a9b1d6] border-[#414868] focus:border-[#7aa2f7] transition-colors"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSubmitting || isSendingMessage}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={isSubmitting || isSendingMessage}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle bg-[#24283b] border-[#414868] hover:bg-[#414868] transition-colors
                     ${imagePreview ? "text-[#7aa2f7]" : "text-[#787c99] hover:text-[#a9b1d6]"}`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting || isSendingMessage}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle bg-[#7aa2f7] hover:bg-[#89b4fa] text-[#1a1b26] border-none"
          disabled={isDisabled}
        >
          {(isSubmitting || isSendingMessage) ? (
            <Loader size={22} className="animate-spin" />
          ) : (
            <Send size={22} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
