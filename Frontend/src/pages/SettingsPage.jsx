import { useState, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Camera, Loader2, User } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024 * 2) { // 2MB
      toast.error('Image size must be less than 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!previewImage) {
      toast.error('Please select an image');
      return;
    }

    await updateProfile({ profilePic: previewImage });
    setPreviewImage(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto bg-base-100 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Settings</h1>

        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="avatar relative">
            <div className="w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center bg-base-200 relative">
              {previewImage || authUser?.profilePic ? (
                <img
                  src={previewImage || authUser?.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-12 h-12 text-base-content/60" />
              )}
              <button 
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-primary text-primary-content p-1 rounded-full"
              >
                <Camera size={16} />
              </button>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold">{authUser?.fullName}</h2>
            <p className="text-sm text-base-content/60">{authUser?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <div className="form-control">
            <label className="label">
              <span className="label-text">Profile Picture</span>
            </label>
            <div 
              onClick={triggerFileInput}
              className="border-2 border-dashed border-base-content/20 rounded-lg p-4 text-center cursor-pointer hover:bg-base-200 transition-colors"
            >
              <p className="text-base-content/60">
                {previewImage ? 'Change selected image' : 'Click to upload an image'}
              </p>
            </div>
          </div>

          {previewImage && (
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
