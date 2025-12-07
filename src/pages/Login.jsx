import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-gray-100 p-4">

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-200">

        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Login to your account
        </p>

        <form className="flex flex-col gap-6">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Email</label>
            <div className="flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50 focus-within:bg-white focus-within:border-blue-500 transition">
              <FaEnvelope className="text-gray-500 text-lg" />
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Password</label>
            <div className="flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50 focus-within:bg-white focus-within:border-blue-500 transition">
              <FaLock className="text-gray-500 text-lg" />
              
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none"
              />

              <span 
                className="cursor-pointer text-gray-500" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Login Button */}
          <button 
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md transition"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 font-semibold hover:underline">
            Register
          </a>
        </p>

      </div>
    </div>
  );
}

export default Login;