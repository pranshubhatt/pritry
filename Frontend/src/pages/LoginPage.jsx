import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react';
import AuthImagePattern from '../components/AuthImagePattern';
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { KeyRound } from "lucide-react";

const LoginPage = () => {
 const[showPassword,setShowPassword]= useState(false);
 const[formData,setFormData]=useState({
  email:"",
  password:"",
 })
 const{login, isLoggingIn} = useAuthStore();
 const [errors, setErrors] = useState({
  email: "",
  password: "",
 });

 const validateForm = () => {
  let isValid = true;
  const newErrors = { email: "", password: "" };

  if (!formData.email) {
    newErrors.email = "Email is required";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Please enter a valid email";
    isValid = false;
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
    isValid = false;
  } else if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
 };

 const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
  // Clear error when user starts typing
  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
 };

 const handleSubmit = async(e)=>{
  e.preventDefault();
  if (!validateForm()) return;
  await login(formData);
 }
  return (
    <div className="h-screen grid lg:grid-cols-2">
    {/* Left Side - Form */}
    <div className="flex flex-col justify-center items-center p-6 sm:p-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div
              className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
            transition-colors"
            >
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
            <p className="text-base-content/60">Sign in to your account</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-2 flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-2 flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-red-500" : ""}
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-base-content/60">
            Don&apos;t have an account?{" "}
            <Link  to="/signup" className="link link-primary">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>

    {/* Right Side - Image/Pattern */}
    <AuthImagePattern
      title={"Welcome back!"}
      subtitle={"Sign in to continue your conversations and catch up with your messages."}
    />
  </div>
);
};
export default LoginPage
