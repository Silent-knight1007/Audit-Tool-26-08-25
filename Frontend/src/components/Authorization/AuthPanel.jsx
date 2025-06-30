import React, { useState } from 'react';

// Simulated backend for demo purposes
const registeredEmails = ["john@onextel.com", "jane@onextel.com"];

export default function AuthPanel() {
  // State for toggling forms
  const [showRegister, setShowRegister] = useState(false);

  // State for sign in form
  const [signIn, setSignIn] = useState({ username: "", password: "" });

  // State for register form
  const [register, setRegister] = useState({
    email: "",
    username: "",
    password: "",
    confirm: ""
  });

  // State for messages
  const [message, setMessage] = useState({ type: "", text: "" });

  // Handle sign in form change
  function handleSignInChange(e) {
    setSignIn({ ...signIn, [e.target.name]: e.target.value });
  }

  // Handle register form change
  function handleRegisterChange(e) {
    setRegister({ ...register, [e.target.name]: e.target.value });
  }

  // Handle "First Time Login?" click
  function handleFirstTimeLoginClick() {
    setShowRegister(true);
    setMessage({ type: "", text: "" });
  }

  // Handle register form submit
  function handleRegisterSubmit(e) {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // 1. Email domain validation
    if (!register.email.endsWith("@onextel.com")) {
      setMessage({ type: "error", text: "Email must be @onextel.com" });
      return;
    }
    // 2. Check if already registered
    if (registeredEmails.includes(register.email.toLowerCase())) {
      setMessage({
        type: "error",
        text: "You are already registered. Please use 'Forgot Password' if you don't remember your password."
      });
      return;
    }
    // 3. Passwords match
    if (register.password !== register.confirm) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    // 4. Password length
    if (register.password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    // Simulate successful registration
    registeredEmails.push(register.email.toLowerCase());
    setMessage({
      type: "success",
      text: `Hello "${register.username}", you are successfully registered at Onextel Audit Program Tool. Now you can move forward for sign in process to explore the tool.`
    });
    setShowRegister(false);
    setRegister({ email: "", username: "", password: "", confirm: "" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a23] to-[#1a1a40]">
      <div className="relative w-full max-w-md">
        {/* Sign In Form */}
        <div className={`transition-all duration-500 bg-[#1a1a40] rounded-2xl shadow-2xl px-8 py-10 ${showRegister ? "blur-sm pointer-events-none" : ""}`}>
          <h2 className="text-2xl font-bold text-blue-400 text-center mb-6">Sign In</h2>
          <input
            type="text"
            name="username"
            value={signIn.username}
            onChange={handleSignInChange}
            placeholder="Username"
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[#22223b] border border-blue-600 text-white focus:outline-none focus:border-blue-400 transition"
          />
          <input
            type="password"
            name="password"
            value={signIn.password}
            onChange={handleSignInChange}
            placeholder="Password"
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[#22223b] border border-blue-600 text-white focus:outline-none focus:border-blue-400 transition"
          />
          <div className="flex justify-between items-center mb-6">
            <button className="text-sm text-blue-300 hover:text-blue-400 underline transition">Forgot Password?</button>
            <button
              className="text-sm text-blue-300 hover:text-blue-400 underline transition"
              onClick={handleFirstTimeLoginClick}
              type="button"
            >
              First Time Login?
            </button>
          </div>
          <button
            className="w-full py-3 bg-blue-600 hover:bg-blue-400 text-white font-semibold rounded-lg shadow-lg transition"
          >
            Sign In
          </button>
        </div>

        {/* Register Form (Slide up) */}
        <div
          className={`absolute left-0 right-0 transition-all duration-500 ${
            showRegister ? "bottom-0 opacity-100 pointer-events-auto" : "-bottom-10 opacity-0 pointer-events-none"
          }`}
        >
          <form
            className="bg-[#22223b] rounded-2xl shadow-2xl px-8 py-10 flex flex-col gap-4 animate-slideup"
            onSubmit={handleRegisterSubmit}
          >
            <h2 className="text-2xl font-bold text-blue-400 text-center mb-4">First Time Login</h2>
            <input
              type="email"
              name="email"
              value={register.email}
              onChange={handleRegisterChange}
              placeholder="Email (@onextel.com only)"
              className="w-full px-4 py-3 rounded-lg bg-[#1a1a40] border border-blue-600 text-white focus:outline-none focus:border-blue-400 transition"
              required
            />
            <input
              type="text"
              name="username"
              value={register.username}
              onChange={handleRegisterChange}
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg bg-[#1a1a40] border border-blue-600 text-white focus:outline-none focus:border-blue-400 transition"
              required
            />
            <input
              type="password"
              name="password"
              value={register.password}
              onChange={handleRegisterChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-[#1a1a40] border border-blue-600 text-white focus:outline-none focus:border-blue-400 transition"
              required
            />
            <input
              type="password"
              name="confirm"
              value={register.confirm}
              onChange={handleRegisterChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 rounded-lg bg-[#1a1a40] border border-blue-600 text-white focus:outline-none focus:border-blue-400 transition"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-400 text-white font-semibold rounded-lg shadow-lg transition"
            >
              Submit
            </button>
            <button
              type="button"
              className="text-sm text-blue-300 hover:text-blue-400 underline transition mt-2"
              onClick={() => setShowRegister(false)}
            >
              Back to Sign In
            </button>
          </form>
        </div>

        {/* Message Display */}
        {message.text && (
          <div
            className={`mt-4 text-center px-4 py-3 rounded-lg shadow ${
              message.type === "success"
                ? "bg-green-700 text-green-100"
                : "bg-red-700 text-red-100"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
      {/* Tailwind custom animation */}
      <style>
        {`
          @keyframes slideup {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-slideup {
            animation: slideup 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
          }
        `}
      </style>
    </div>
  );
}
