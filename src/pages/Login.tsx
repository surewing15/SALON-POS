import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from "react-icons/fa";
import backgroundImage from "../assets/ww.jfif";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "admin" && password === "12345") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("role", "admin");
      alert("Welcome, Admin! You have successfully logged in.");
      navigate("/dashboard");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-center px-4"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Card Container - Fixed width and centered */}
      <div className="w-full max-w-md">
        {/* Login Box */}
        <div className="bg-white rounded shadow-md overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 text-center">
            <h1 className="text-xl font-medium text-gray-800">Welcome Back</h1>
            <p className="text-sm text-gray-600 mt-1">
              Please sign in to continue
            </p>
          </div>

          <div className="border-t border-gray-100"></div>

          {/* Form Section */}
          <div className="px-6 py-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaEnvelope className="text-gray-400 text-sm" />
                </div>
                <input
                  type="text"
                  placeholder="Email Address"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border-b border-gray-200 bg-transparent focus:outline-none focus:border-gray-400 text-gray-800 transition-colors"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLock className="text-gray-400 text-sm" />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border-b border-gray-200 bg-transparent focus:outline-none focus:border-gray-400 text-gray-800 transition-colors"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm pt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 text-gray-600 focus:ring-0 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-gray-600"
                  >
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gray-800 text-white font-medium hover:bg-gray-700 focus:outline-none transition-colors"
              >
                Sign In
              </button>
            </form>

            <div className="text-center text-sm text-gray-600 mt-4">
              <p>
                Not registered?{" "}
                <a
                  href="/register"
                  className="text-gray-800 font-medium hover:underline"
                >
                  Create an account
                </a>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-2"></div>

          {/* Social Login Section */}
          <div className="px-6 py-4">
            <p className="text-center text-sm text-gray-500 mb-4">
              Or continue with
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex justify-center py-2 px-4 border border-gray-200 rounded bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FaGoogle className="h-5 w-5 text-gray-500" />
              </button>
              <button
                type="button"
                className="flex justify-center py-2 px-4 border border-gray-200 rounded bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FaFacebook className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Zarlette Salon. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
