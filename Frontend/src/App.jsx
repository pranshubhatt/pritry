import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";

import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";


const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUers} = useAuthStore()
    
  useEffect(()=>{
    checkAuth()
  }, []);

  if(isCheckingAuth && !authUser) return(
    <div className='flex items-center justify-center h-screen bg-[#1a1b26] text-[#a9b1d6]'>
      <Loader className="size-10 animate-spin text-[#7aa2f7]"/>
    </div>
  )

  return (
    <div data-theme="dark" className="bg-[#1a1b26] text-[#a9b1d6] min-h-screen">
      <Navbar /> 

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/"/>} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#24283b',
            color: '#a9b1d6',
          },
          success: {
            iconTheme: {
              primary: '#7aa2f7',
              secondary: '#1a1b26',
            },
          },
          error: {
            iconTheme: {
              primary: '#f7768e',
              secondary: '#1a1b26',
            },
          },
        }}
      />
    </div>
  )
}

export default App