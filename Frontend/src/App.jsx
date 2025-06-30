import React, { useState } from "react";

// Simulated backend for demo purposes
const registeredEmails = ["john@onextel.com", "jane@onextel.com"];

export default function AuthPanel() {
  // State for toggling forms
  const [showRegister, setShowRegister] = useState(false);

  // State for sign in form
  const [signIn, setSignIn] = useState({ email: "", password: "" });

  // State for register form
  const [register, setRegister] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  // State for messages
  const [message, setMessage] = useState({ type: "", text: "" });

  // State for email validation message in register form
  const [emailError, setEmailError] = useState("");

  // State for other register form errors (password mismatch, policy)
  const [registerError, setRegisterError] = useState("");

  // Password validation: exactly 8 chars, uppercase, lowercase, digit, special char
  function validatePassword(password) {
  // At least 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special char
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
}


  // Handle sign in form change
  function handleSignInChange(e) {
    setSignIn({ ...signIn, [e.target.name]: e.target.value });
  }

  // Handle register form change
  function handleRegisterChange(e) {
    const { name, value } = e.target;
    setRegister({ ...register, [name]: value });

    if (name === "email") {
      setRegisterError("");
      if (!value.endsWith("@onextel.com")) {
        setEmailError("Enter onextel.com email");
      } else if (registeredEmails.includes(value.toLowerCase())) {
        setEmailError(
          "You are already registered. Please reset you password through Forgot password functionality"
        );
      } else {
        setEmailError("");
      }
    }
  }

  // Handle "First Time Login?" click
  function handleFirstTimeLoginClick() {
    setShowRegister(true);
    setMessage({ type: "", text: "" });
    setRegister({ email: "", password: "", confirm: "" });
    setEmailError("");
    setRegisterError("");
  }

  // Handle register form submit
  function handleRegisterSubmit(e) {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setRegisterError("");

    // Email domain validation
    if (!register.email.endsWith("@onextel.com")) {
      setEmailError("Enter onextel.com email");
      return;
    }

    // Already registered check
    if (registeredEmails.includes(register.email.toLowerCase())) {
      setEmailError(
        "You are already registered. Please reset you password through Forgot password functionality"
      );
      return;
    }

    // Passwords match
    if (register.password !== register.confirm) {
      setRegisterError("Passwords do not match.");
      return;
    }

    // Password policy validation
    if (!validatePassword(register.password)) {
      setRegisterError(
        "Password must be atleast 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    // Simulate successful registration
    registeredEmails.push(register.email.toLowerCase());
    setMessage({
      type: "success",
      text: `Hello "${register.email}", you are successfully registered at Onextel Audit Program Tool. Now you can move forward for sign in process to explore the tool.`,
    });
    setShowRegister(false);
    setRegister({ email: "", password: "", confirm: "" });
    setEmailError("");
    setRegisterError("");
  }

  // Handle closing the register form
  function handleBackToSignIn() {
    setShowRegister(false);
    setEmailError("");
    setRegisterError("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a23] to-[#1a1a40] p-4">
      <div className="relative w-full max-w-md">
        {/* Sign In Form */}
        <div
          className={`transition-all duration-500 bg-[#1a1a40] rounded-2xl shadow-2xl px-8 py-10 ${
            showRegister ? "blur-sm pointer-events-none" : ""
          }`}
        >
          <h2 className="text-2xl font-bold text-blue-400 text-center mb-6">
            Sign In
          </h2>
          <input
            type="email"
            name="email"
            value={signIn.email}
            onChange={handleSignInChange}
            placeholder="Email ID"
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[#22223b] border border-blue-600 text-white focus:outline-none focus:border-blue-400 transition"
            autoComplete="username"
          />
          <input
            type="password"
            name="password"
            value={signIn.password}
            onChange={handleSignInChange}
            placeholder="Password"
            className="w-full mb-4 px-4 py-3 rounded-lg bg-[#22223b] border border-blue-600 text-white focus:outline-none focus:border-blue-400 transition"
            autoComplete="current-password"
          />
          <div className="flex justify-between items-center mb-6">
            <button className="text-sm text-blue-300 hover:text-blue-400 underline transition">
              Forgot Password?
            </button>
            <button
              className="text-sm text-blue-300 hover:text-blue-400 underline transition"
              onClick={handleFirstTimeLoginClick}
              type="button"
            >
              First Time Login?
            </button>
          </div>
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-400 text-white font-semibold rounded-lg shadow-lg transition">
            Sign In
          </button>
        </div>

        {/* Register Form (Slide up) */}
        <div
          className={`absolute left-0 right-0 transition-all duration-500 ${
            showRegister
              ? "bottom-0 opacity-100 pointer-events-auto"
              : "-bottom-10 opacity-0 pointer-events-none"
          }`}
        >
          <form
            className="bg-[#22223b] rounded-2xl shadow-2xl px-8 py-10 flex flex-col gap-4 animate-slideup"
            onSubmit={handleRegisterSubmit}
            autoComplete="off"
          >
            <h2 className="text-2xl font-bold text-blue-400 text-center mb-4">
              First Time Login
            </h2>
            <div>
              <input
                type="email"
                name="email"
                value={register.email}
                onChange={handleRegisterChange}
                placeholder="Email ID (@onextel.com only)"
                className={`w-full px-4 py-3 rounded-lg bg-[#1a1a40] border ${
                  emailError
                    ? "border-red-500 focus:border-red-400"
                    : "border-blue-600 focus:border-blue-400"
                } text-white focus:outline-none transition`}
                required
                autoComplete="username"
              />
              {/* Email error */}
              <div className="min-h-[1.5em]">
                {emailError && (
                  <div className="text-red-400 text-xs mt-1">{emailError}</div>
                )}
              </div>
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={register.password}
                onChange={handleRegisterChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a40] border border-blue-600 text-white focus:outline-none focus:border-blue-400 transition"
                required
                autoComplete="new-password"
              />
              <div className="text-xs text-blue-300 mt-1">
                Must be at least 8 characters, include uppercase, lowercase,
                number, and special character.
              </div>

            </div>
            <input
              type="password"
              name="confirm"
              value={register.confirm}
              onChange={handleRegisterChange}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 rounded-lg bg-[#1a1a40] border border-blue-600 text-white focus:outline-none focus:border-blue-400 transition"
              required
              autoComplete="new-password"
            />
            {/* Password errors */}
            <div className="min-h-[1.5em]">
              {registerError && (
                <div className="text-red-400 text-xs mt-1">{registerError}</div>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-400 text-white font-semibold rounded-lg shadow-lg transition"
              disabled={!!emailError}
            >
              Submit
            </button>
            <button
              type="button"
              className="text-sm text-blue-300 hover:text-blue-400 underline transition mt-2"
              onClick={handleBackToSignIn}
            >
              Back to Sign In
            </button>
          </form>
        </div>

        {/* Success Message Display */}
        {message.text && message.type === "success" && (
          <div className="mt-4 text-center px-4 py-3 rounded-lg shadow bg-green-700 text-green-100">
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
