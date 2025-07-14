import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function validateOnextelEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@onextel\.com$/.test(email);
}

function validatePassword(password) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
}

export default function AuthPanel() {
  // State for toggling forms
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  // State for login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginEmailError, setLoginEmailError] = useState("");
  const [loginPasswordError, setLoginPasswordError] = useState("");

  // State for register
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerEmailError, setRegisterEmailError] = useState("");
  const [registerPasswordError, setRegisterPasswordError] = useState("");

  // State for forgot password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotEmailError, setForgotEmailError] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  // Ref for register heading
  const registerHeadingRef = useRef(null);

  // Scroll into view when switching to register
  useEffect(() => {
    if (showRegister && registerHeadingRef.current) {
      registerHeadingRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showRegister]);

  // --- Handlers ---

  // Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginEmailError("");
    setLoginPasswordError("");

    if (!validateOnextelEmail(loginEmail)) {
      setLoginEmailError("Only @onextel.com email addresses are allowed.");
      toast.error("Only @onextel.com email addresses are allowed!", { position: "top-center", autoClose: 2000 });
      return;
    }
    if (!validatePassword(loginPassword)) {
      setLoginPasswordError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      toast.error("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.", { position: "top-center", autoClose: 3000 });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        toast.success("Sign In Successful!", { position: "top-center", autoClose: 2000 });
        setTimeout(() => {
          navigate("/dashboard");
        }, 2100);
      } else if (data.message && data.message.toLowerCase().includes("not registered")) {
        toast.error("This email is not registered. Please register first.", { position: "top-center", autoClose: 2000 });
      } else {
        toast.error(data.message || "Sign In failed.", { position: "top-center", autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Network error. Please try again.", { position: "top-center", autoClose: 2000 });
    }
  };

  // Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterEmailError("");
    setRegisterPasswordError("");

    if (!validateOnextelEmail(registerEmail)) {
      setRegisterEmailError("Only @onextel.com email addresses are allowed.");
      toast.error("Only @onextel.com email addresses are allowed!", { position: "top-center", autoClose: 2000 });
      return;
    }
    if (!validatePassword(registerPassword)) {
      setRegisterPasswordError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      toast.error("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.", { position: "top-center", autoClose: 3000 });
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setRegisterPasswordError("Passwords do not match.");
      toast.error("Passwords do not match.", { position: "top-center", autoClose: 2000 });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registerEmail, password: registerPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Registration successful! You can now sign in.", { position: "top-center", autoClose: 2000 });
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterConfirmPassword("");
      } else if (data.message && data.message.toLowerCase().includes("already")) {
        toast.info('You are already registered. If you forgot your password, please use "Forgot Password".', { position: "top-center", autoClose: 3000 });
      } else {
        toast.error(data.message || "Registration failed.", { position: "top-center", autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Network error. Please try again.", { position: "top-center", autoClose: 2000 });
    }
  };

  // Forgot Password Submit
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotEmailError("");
    setForgotMsg("");

    if (!validateOnextelEmail(forgotEmail)) {
      setForgotEmailError("Only @onextel.com email addresses are allowed.");
      toast.error("Only @onextel.com email addresses are allowed!", { position: "top-center", autoClose: 2000 });
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "A password reset link has been sent to your email address.", { position: "top-center", autoClose: 2000 });
        setForgotEmail("");
      } else {
        toast.error(data.message || "Failed to send reset link.", { position: "top-center", autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Network error. Please try again.", { position: "top-center", autoClose: 2000 });
    }
  };

  // Handle re-registration attempt
  const handleRegisterEmailChange = (e) => {
    setRegisterEmail(e.target.value);
    setRegisterEmailError("");
  };

  // --- UI ---
  return (
    <div className="min-h-screen flex justify-center items-start bg-white p-4 pt-24">
      <div className="w-full max-w-md mx-auto">
        <div className="relative">
          {/* ----- Sign In Form ----- */}
          {!showRegister && !showForgot && (
            <form
              className="bg-white border-2 border-red-800 p-8 rounded-2xl shadow-xl w-full transition-all duration-500 animate-fade-in"
              onSubmit={handleLoginSubmit}
              autoComplete="off"
            >
              <h2 className="text-3xl font-bold text-center mb-6 text-red-700">Sign In</h2>
              <div className="mb-3">
                <label className="block text-red-700 mb-1 font-bold" htmlFor="login-email">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="off"
                  className={`w-full px-4 py-2 bg-white-700 rounded text-black font-bold border ${loginEmailError ? "border-red-700" : "border-red-700"} focus:outline-none focus:border-red-700 transition`}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
                {loginEmailError && (
                  <div className="text-red-600 text-sm mt-1">{loginEmailError}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-red-700 mb-1 font-bold" htmlFor="login-password">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-2 rounded bg-white-700 text-black font-bold border ${loginPasswordError ? "border-red-700" : "border-red-700"} focus:outline-none focus:border-red-700 transition`}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                {loginPasswordError && (
                  <div className="text-red-600 text-lg mt-1">{loginPasswordError}</div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-red-700 text-lg hover:bg-red-500 text-black font-bold py-2 rounded transition mb-2">
                Sign In 
              </button>
              <div className="flex justify-between items-center text-sm mt-2">
                <button
                  type="button"
                  className="text-red-700 hover:text-red-700 underline transition font-bold"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot Password?
                </button>
                <button
                  type="button"
                  className="text-red-700 hover:text-red-700 underline transition font-bold"
                  onClick={() => {
                    setShowRegister(true);
                  }}
                >
                  First Time Register?
                </button>
              </div>
            </form>
          )}

          {/* ----- Forgot Password Form ----- */}
          {showForgot && (
            <form
              className="bg-white border-2 border-red-600 p-8 rounded-2xl shadow-2xl w-full transition-all duration-500 animate-fade-in"
              onSubmit={handleForgotSubmit}
              autoComplete="off"
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-red-600">Forgot Password</h2>
              <div className="mb-3">
                <label className="block text-gray-900 mb-1" htmlFor="forgot-email">
                  Enter your @onextel.com email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="off"
                  className={`w-full px-4 py-2 rounded bg-[#1a1a40] text-white border ${forgotEmailError ? "border-red-700" : "border-gray-600"} focus:outline-none focus:border-red-700 transition`}
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
                {forgotEmailError && (
                  <div className="text-red-600 text-sm mt-1">{forgotEmailError}</div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-700 text-white font-semibold py-2 rounded transition mb-2"
              >
                Send Reset Link
              </button>
              <div className="text-center">
                <button
                  type="button"
                  className="text-red-600 hover:text-red-600 underline transition"
                  onClick={() => setShowForgot(false)}
                >
                  Back to Sign In
                </button>
              </div>
              {forgotMsg && (
                <div className="mt-4 text-center text-red-800 font-semibold animate-pulse">
                  {forgotMsg}
                </div>
              )}
            </form>
          )}

          {/* ----- Register Form ----- */}
          {showRegister && !showForgot && (
            <form
              className="bg-white border-2 border-red-700 p-8 rounded-2xl shadow-2xl w-full transition-all duration-500 animate-fade-in"
              onSubmit={handleRegisterSubmit}
              autoComplete="off"
            >
              <h2
                ref={registerHeadingRef}
                className="text-3xl font-bold text-center mb-6 text-red-700 cursor-pointer"
                tabIndex={0}
                onClick={() =>
                  registerHeadingRef.current &&
                  registerHeadingRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  })
                }
              >
                First Time Register
              </h2>
              <div className="mb-3">
                <label className="block text-red-700 font-bold mb-1" htmlFor="register-email">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  autoComplete="off"
                  className={`w-full px-4 py-2 rounded bg-white-700 text-black font-bold border ${registerEmailError ? "border-red-700" : "border-red-700"} focus:outline-none focus:border-red-700 transition`}
                  value={registerEmail}
                  onChange={handleRegisterEmailChange}
                  required
                />
                {registerEmailError && (
                  <div className="text-red-700 text-sm mt-1">{registerEmailError}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="block text-red-700 font-bold mb-1" htmlFor="register-password">
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-2 rounded bg-white-700 text-black font-bold border ${registerPasswordError ? "border-red-700" : "border-red-700"} focus:outline-none focus:border-red-700 transition`}
                  value={registerPassword}
                  onChange={(e) => {
                    setRegisterPassword(e.target.value);
                    setRegisterPasswordError("");
                  }}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-red-700 font-bold mb-1" htmlFor="register-confirm-password">
                  Confirm Password
                </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-2 rounded bg-white-700 text-black font-black border ${registerPasswordError ? "border-red-700" : "border-red-700"} focus:outline-none focus:border-red-700 transition`}
                  value={registerConfirmPassword}
                  onChange={(e) => {
                    setRegisterConfirmPassword(e.target.value);
                    setRegisterPasswordError("");
                  }}
                  required
                />
                {registerPasswordError && (
                  <div className="text-red-600 text-lg mt-1">{registerPasswordError}</div>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-500 text-lg text-black font-bold py-2 rounded transition mb-2"
              >
                Register
              </button>
              <div className="text-center">
                <button
                  type="button"
                  className="text-red-700 hover:text-red-500 font-bold underline transition"
                  onClick={() => {
                    setShowRegister(false);
                  }}
                >
                  Back To Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      {/* Animation */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.6s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}
