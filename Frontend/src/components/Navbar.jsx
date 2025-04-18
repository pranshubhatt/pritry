import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquare, Settings, User, LogOut } from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <div className="navbar navbar-dark bg-[#1a1b26] border-b border-[#414868] px-4">
      <div className="navbar-start">
        <Link to="/" className="text-lg font-semibold flex items-center text-[#7aa2f7]">
          <MessageSquare className="inline-block mr-2" size={24} />
          <span>ChatMate</span>
        </Link>
      </div>

      <div className="navbar-end">
        {authUser ? (
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="btn btn-ghost btn-circle text-[#a9b1d6] hover:bg-[#414868]"
            >
              <Settings size={20} />
            </Link>

            <Link
              to="/profile"
              className="btn btn-ghost btn-circle text-[#a9b1d6] hover:bg-[#414868]"
            >
              <User size={20} />
            </Link>

            <button
              onClick={logout}
              className="btn btn-ghost text-[#a9b1d6] hover:bg-[#414868]"
            >
              <LogOut size={20} className="mr-1" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="btn bg-transparent hover:bg-[#24283b] text-[#7aa2f7] border-[#7aa2f7] hover:border-[#7aa2f7]"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="btn bg-[#7aa2f7] hover:bg-[#89b4fa] text-[#1a1b26] border-none"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;