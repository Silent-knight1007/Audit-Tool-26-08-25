import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Simulated registered users (in a real app, use API/database)
const registeredUsers = new Set();

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
  const [loginMsg, setLoginMsg] = useState("");

  // State for register
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerEmailError, setRegisterEmailError] = useState("");
  const [registerPasswordError, setRegisterPasswordError] = useState("");
  const [registerMsg, setRegisterMsg] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

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
    setLoginMsg("");

    if (!validateOnextelEmail(loginEmail)) {
      setLoginEmailError("Only @onextel.com email addresses are allowed.");
      return;
    }
    if (!registeredUsers.has(loginEmail)) {
      setLoginMsg("This email is not registered. Please register first.");
      return;
    }
    if (!validatePassword(loginPassword)) {
      setLoginPasswordError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
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
        setLoginMsg(
          "You are successfully logged in to Onextel Audit Program Tool. Now you can start exploring the tool."
        );
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setLoginMsg(data.message || "Login failed.");
      }
    } catch (error) {
      setLoginMsg("Network error. Please try again.");
    }
    // Simulate successful login
    setLoginMsg("Login successful! (Simulated)");
  };

  

  // Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterEmailError("");
    setRegisterPasswordError("");
    setRegisterMsg("");
    setRegisterSuccess(false);

    if (!validateOnextelEmail(registerEmail)) {
      setRegisterEmailError("Only @onextel.com email addresses are allowed.");
      return;
    }
    if (registeredUsers.has(registerEmail)) {
      setRegisterMsg(
        'You are already registered. Please move forward towards sign in. If you forgot your password, please use "Forgot Password".'
      );
      return;
    }
    if (!validatePassword(registerPassword)) {
      setRegisterPasswordError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setRegisterPasswordError("Passwords do not match.");
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
      setRegisterSuccess(true);
      setRegisterMsg(data.message);
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterConfirmPassword("");
    } else {
      setRegisterMsg(data.message || "Registration failed.");
    }
  } catch (error) {
    setRegisterMsg("Network error. Please try again.");
  }

    // Simulate registration
    registeredUsers.add(registerEmail);
    setRegisterSuccess(true);
    setRegisterMsg(
      `Hello ${registerEmail}, you are successfully registered at Onextel Audit Program Tool. Now you can move forward for sign in process to explore the tool.`
    );
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
  };

  // Forgot Password Submit
 const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotEmailError("");
    setForgotMsg("");

    if (!validateOnextelEmail(forgotEmail)) {
      setForgotEmailError("Only @onextel.com email addresses are allowed.");
      return;
    }
    if (!registeredUsers.has(forgotEmail)) {
      setForgotMsg("This email is not registered. Please register first.");
      return;
    }
    setForgotMsg(
      "A password reset link has been sent to your email address. (Simulated)"
    );
    setForgotEmail("");

    try {
    const response = await fetch("http://localhost:4000/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: forgotEmail }),
    });
    const data = await response.json();
    if (response.ok) {
      setForgotMsg(data.message);
      setForgotEmail("");
    } else {
      setForgotMsg(data.message || "Failed to send reset link.");
    }
  } catch (error) {
    setForgotMsg("Network error. Please try again.");
  }

  };

  // Handle re-registration attempt
  const handleRegisterEmailChange = (e) => {
    setRegisterEmail(e.target.value);
    setRegisterEmailError("");
    setRegisterMsg("");
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
                Login
              </button>
              
              {/* Place the message display here */}
              {loginMsg && (
              <div className="mt-4 text-center text-green-400 font-semibold animate-pulse">
                {loginMsg}
              </div>
              )}

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
                    setLoginMsg("");
                  }}
                >
                  First Time Login?
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
                <div className="mt-4 text-center text-green-400 font-semibold animate-pulse">
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
                First Time Login
              </h2>
              <div className="mb-3">
                <label className="block text-red-700 font-bold mb-1" htmlFor="register-email">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
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
                    setRegisterMsg("");
                  }}
                >
                  Back To Sign In
                </button>
              </div>
              {registerMsg && (
                <div className={`mt-4 text-center font-semibold animate-pulse ${registerSuccess ? "text-green-400" : "text-yellow-400"}`}>
                  {registerMsg}
                </div>
              )}
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





//2nd
// import React, { useState, useRef, useEffect } from "react";
// export default function AuthPanel() {
//   const [showRegister, setShowRegister] = useState(false);
//   const [loginEmail, setLoginEmail] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   const [registerEmail, setRegisterEmail] = useState("");
//   const [registerPassword, setRegisterPassword] = useState("");
//   const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
//   const [registerSuccess, setRegisterSuccess] = useState(false);
//   const registerHeadingRef = useRef(null);

//   // Scroll to register heading when switching forms
//   useEffect(() => {
//     if (showRegister && registerHeadingRef.current) {
//       registerHeadingRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
//     }
//   }, [showRegister]);

//   // Handlers (replace with your actual logic as needed)
//   const handleLoginSubmit = (e) => {
//     e.preventDefault();
//     // ...login logic
//     alert("Login submitted!");
//   };

//   const handleRegisterSubmit = (e) => {
//     e.preventDefault();
//     // ...register logic
//     setRegisterSuccess(true);
//     setTimeout(() => {
//       setRegisterSuccess(false);
//       setShowRegister(false);
//     }, 2000);
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-start bg-gradient-to-br from-[#0a0a23] to-[#1a1a40] p-4 pt-24">
//       <div className="w-full max-w-md mx-auto">
//         {/* Animated transition between forms */}
//         <div className="relative">
//           {/* Login Form */}
//           {!showRegister && (
//             <form
//               className="bg-[#23213a] p-8 rounded-2xl shadow-2xl w-full transition-all duration-500 animate-fade-in"
//               onSubmit={handleLoginSubmit}
//               autoComplete="off"
//             >
//               <h2 className="text-2xl font-bold text-center mb-6 text-blue-400">Sign In</h2>
//               <div className="mb-4">
//                 <label className="block text-gray-300 mb-1" htmlFor="login-email">
//                   Email
//                 </label>
//                 <input
//                   id="login-email"
//                   type="email"
//                   className="w-full px-4 py-2 rounded bg-[#1a1a40] text-white border border-gray-600 focus:outline-none focus:border-blue-400 transition"
//                   value={loginEmail}
//                   onChange={(e) => setLoginEmail(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-300 mb-1" htmlFor="login-password">
//                   Password
//                 </label>
//                 <input
//                   id="login-password"
//                   type="password"
//                   className="w-full px-4 py-2 rounded bg-[#1a1a40] text-white border border-gray-600 focus:outline-none focus:border-blue-400 transition"
//                   value={loginPassword}
//                   onChange={(e) => setLoginPassword(e.target.value)}
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition mb-2"
//               >
//                 Login
//               </button>
//               <div className="text-center">
//                 <button
//                   type="button"
//                   className="text-sm text-blue-300 hover:text-blue-400 underline transition"
//                   onClick={() => setShowRegister(true)}
//                 >
//                   First Time Login?
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* Register Form */}
//           {showRegister && (
//             <form
//               className="bg-[#23213a] p-10 rounded-2xl shadow-2xl w-full transition-all duration-500 animate-fade-in"
//               onSubmit={handleRegisterSubmit}
//               autoComplete="off"
//             >
//               <h2
//                 ref={registerHeadingRef}
//                 className="text-2xl font-bold text-center mb-6 text-pink-400 cursor-pointer"
//                 tabIndex={0}
//                 onClick={() => registerHeadingRef.current && registerHeadingRef.current.scrollIntoView({ behavior: "smooth", block: "center" })}
//               >
//                 First Time Login
//               </h2>
//               <div className="mb-4">
//                 <label className="block text-gray-300 mb-1" htmlFor="register-email">
//                   Email
//                 </label>
//                 <input
//                   id="register-email"
//                   type="email"
//                   className="w-full px-4 py-2 rounded bg-[#1a1a40] text-white border border-gray-600 focus:outline-none focus:border-pink-400 transition"
//                   value={registerEmail}
//                   onChange={(e) => setRegisterEmail(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-300 mb-1" htmlFor="register-password">
//                   Password
//                 </label>
//                 <input
//                   id="register-password"
//                   type="password"
//                   className="w-full px-4 py-2 rounded bg-[#1a1a40] text-white border border-gray-600 focus:outline-none focus:border-pink-400 transition"
//                   value={registerPassword}
//                   onChange={(e) => setRegisterPassword(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-gray-300 mb-1" htmlFor="register-confirm-password">
//                   Confirm Password
//                 </label>
//                 <input
//                   id="register-confirm-password"
//                   type="password"
//                   className="w-full px-4 py-2 rounded bg-[#1a1a40] text-white border border-gray-600 focus:outline-none focus:border-pink-400 transition"
//                   value={registerConfirmPassword}
//                   onChange={(e) => setRegisterConfirmPassword(e.target.value)}
//                   required
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded transition mb-2"
//               >
//                 Register
//               </button>
//               <div className="text-center">
//                 <button
//                   type="button"
//                   className="text-sm text-pink-300 hover:text-pink-400 underline transition"
//                   onClick={() => setShowRegister(false)}
//                 >
//                   Back to Login
//                 </button>
//               </div>
//               {registerSuccess && (
//                 <div className="mt-4 text-green-400 text-center font-semibold animate-pulse">
//                   Registration successful!
//                 </div>
//               )}
//             </form>
//           )}
//         </div>
//       </div>
//       {/* Optional: Add subtle fade-in animation */}
//       <style>{`
//         .animate-fade-in {
//           animation: fadeIn 0.6s;
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(30px);}
//           to { opacity: 1; transform: translateY(0);}
//         }
//       `}</style>
//     </div>
//   );
// }



// 1st
// import React, { useState } from "react";

// // Simulated backend for demo purposes
// const registeredEmails = ["john@onextel.com", "jane@onextel.com"];

// export default function AuthPanel() {
//   // State for toggling forms
//   const [showRegister, setShowRegister] = useState(false);

//   // State for sign in form
//   const [signIn, setSignIn] = useState({ email: "", password: "" });

//   // State for register form
//   const [register, setRegister] = useState({  
//     email: "",
//     password: "",
//     confirm: "",
//   });

//   // State for messages
//   const [message, setMessage] = useState({ type: "", text: "" });

//   // State for email validation message in register form
//   const [emailError, setEmailError] = useState("");

//   // State for other register form errors (password mismatch, policy)
//   const [registerError, setRegisterError] = useState("");

//   // Password validation: exactly 8 chars, uppercase, lowercase, digit, special char
//   function validatePassword(password) {
//   // At least 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special char
//   const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
//   return regex.test(password);
// }


//   // Handle sign in form change
//   function handleSignInChange(e) {
//     setSignIn({ ...signIn, [e.target.name]: e.target.value });
//   }

//   // Handle register form change
//   function handleRegisterChange(e) {
//     const { name, value } = e.target;
//     setRegister({ ...register, [name]: value });

//     if (name === "email") {
//       setRegisterError("");
//       if (!value.endsWith("@onextel.com")) {
//         setEmailError("Enter onextel.com email");
//       } else if (registeredEmails.includes(value.toLowerCase())) {
//         setEmailError(
//           "You are already registered. Please reset you password through Forgot password functionality"
//         );
//       } else {
//         setEmailError("");
//       }
//     }
//   }

//   // Handle "First Time Login?" click
//   function handleFirstTimeLoginClick() {
//     setShowRegister(true);
//     setMessage({ type: "", text: "" });
//     setRegister({ email: "", password: "", confirm: "" });
//     setEmailError("");
//     setRegisterError("");
//   }

//   // Handle register form submit
//   function handleRegisterSubmit(e) {
//     e.preventDefault();
//     setMessage({ type: "", text: "" });
//     setRegisterError("");

//     // Email domain validation
//     if (!register.email.endsWith("@onextel.com")) {
//       setEmailError("Enter onextel.com email");
//       return;
//     }

//     // Already registered check
//     if (registeredEmails.includes(register.email.toLowerCase())) {
//       setEmailError(
//         "You are already registered. Please reset you password through Forgot password functionality"
//       );
//       return;
//     }

//     // Passwords match
//     if (register.password !== register.confirm) {
//       setRegisterError("Passwords do not match.");
//       return;
//     }

//     // Password policy validation
//     if (!validatePassword(register.password)) {
//       setRegisterError(
//         "Password must be atleast 8 characters and include uppercase, lowercase, number, and special character."
//       );
//       return;
//     }

//     // Simulate successful registration
//     registeredEmails.push(register.email.toLowerCase());
//     setMessage({
//       type: "success",
//       text: `Hello "${register.email}", you are successfully registered at Onextel Audit Program Tool. Now you can move forward for sign in process to explore the tool.`,
//     });
//     setShowRegister(false);
//     setRegister({ email: "", password: "", confirm: "" });
//     setEmailError("");
//     setRegisterError("");
//   }

//   // Handle closing the register form
//   function handleBackToSignIn() {
//     setShowRegister(false);
//     setEmailError("");
//     setRegisterError("");
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a23] to-[#1a1a40] p-4 pt-24">
//       <div className="relative max-w-sm w-full mx-auto bg-[#23213a] p-8 rounded-lg shadow-lg">
//         {/* Sign In Form */}
//         <div
//           className={`transition-all duration-500 bg-[#1a1a40] rounded-2xl shadow-2xl px-8 py-10 ${
//             showRegister ? "blur-sm pointer-events-none" : ""
//           }`}
//         >
//           <h2 className="text-2xl font-bold text-blue-400 text-center mb-6">
//             Sign In
//           </h2>
//           <input
//             type="email"
//             name="email"
//             value={signIn.email}
//             onChange={handleSignInChange}
//             placeholder="Email ID"
//             className="w-full mb-4 px-4 py-3 rounded-lg bg-[#22223b] border border-blue-600 text-white focus:outline-none focus:border-blue-400 transition"
//             autoComplete="username"
//           />
//           <input
//             type="password"
//             name="password"
//             value={signIn.password}
//             onChange={handleSignInChange}
//             placeholder="Password"
//             className="w-full mb-4 px-4 py-3 rounded-lg bg-[#22223b] border border-blue-600 text-white focus:outline-none focus:border-blue-400 transition"
//             autoComplete="current-password"
//           />
//           <div className="flex justify-between items-center mb-6">
//             <button className="text-sm text-blue-300 hover:text-blue-400 underline transition">
//               Forgot Password?
//             </button>
//             <button
//               className="text-sm text-blue-300 hover:text-blue-400 underline transition"
//               onClick={handleFirstTimeLoginClick}
//               type="button"
//             >
//               First Time Login?
//             </button>
//           </div>
//           <button className="w-full py-3 bg-blue-600 hover:bg-blue-400 text-white font-semibold rounded-lg shadow-lg transition">
//             Sign In
//           </button>
//         </div>

//         {/* Register Form (Slide up) */}
//         <div
//           className={`absolute left-0 right-0 transition-all duration-500 ${
//             showRegister
//               ? "bottom-0 opacity-100 pointer-events-auto"
//               : "-bottom-10 opacity-0 pointer-events-none"
//           }`}
//         >
//           <form
//             className="bg-[#22223b] rounded-2xl shadow-2xl px-8 py-10 flex flex-col gap-4 animate-slideup"
//             onSubmit={handleRegisterSubmit}
//             autoComplete="off"
//           >
//             <h2 className="text-2xl font-bold text-blue-400 text-center mb-4">
//               First Time Login
//             </h2>
//             <div>
//               <input
//                 type="email"
//                 name="email"
//                 value={register.email}
//                 onChange={handleRegisterChange}
//                 placeholder="Email ID (@onextel.com only)"
//                 className={`w-full px-4 py-3 rounded-lg bg-[#1a1a40] border ${
//                   emailError
//                     ? "border-red-500 focus:border-red-400"
//                     : "border-blue-600 focus:border-blue-400"
//                 } text-white focus:outline-none transition`}
//                 required
//                 autoComplete="username"
//               />
//               {/* Email error */}
//               <div className="min-h-[1.5em]">
//                 {emailError && (
//                   <div className="text-red-400 text-xs mt-1">{emailError}</div>
//                 )}
//               </div>
//             </div>
//             <div>
//               <input
//                 type="password"
//                 name="password"
//                 value={register.password}
//                 onChange={handleRegisterChange}
//                 placeholder="Password"
//                 className="w-full px-4 py-3 rounded-lg bg-[#1a1a40] border border-blue-600 text-white focus:outline-none focus:border-blue-400 transition"
//                 required
//                 autoComplete="new-password"
//               />
//               <div className="text-xs text-blue-300 mt-1">
//                 Must be at least 8 characters, include uppercase, lowercase,
//                 number, and special character.
//               </div>

//             </div>
//             <input
//               type="password"
//               name="confirm"
//               value={register.confirm}
//               onChange={handleRegisterChange}
//               placeholder="Confirm Password"
//               className="w-full px-4 py-3 rounded-lg bg-[#1a1a40] border border-blue-600 text-white focus:outline-none focus:border-blue-400 transition"
//               required
//               autoComplete="new-password"
//             />
//             {/* Password errors */}
//             <div className="min-h-[1.5em]">
//               {registerError && (
//                 <div className="text-red-400 text-xs mt-1">{registerError}</div>
//               )}
//             </div>
//             <button
//               type="submit"
//               className="w-full py-3 bg-blue-600 hover:bg-blue-400 text-white font-semibold rounded-lg shadow-lg transition"
//               disabled={!!emailError}
//             >
//               Submit
//             </button>
//             <button
//               type="button"
//               className="text-sm text-blue-300 hover:text-blue-400 underline transition mt-2"
//               onClick={handleBackToSignIn}
//             >
//               Back to Sign In
//             </button>
//           </form>
//         </div>

//         {/* Success Message Display */}
//         {message.text && message.type === "success" && (
//           <div className="mt-4 text-center px-4 py-3 rounded-lg shadow bg-green-700 text-green-100">
//             {message.text}
//           </div>
//         )}
//       </div>

//       {/* Tailwind custom animation */}
//       <style>
//         {`
//           @keyframes slideup {
//             from { transform: translateY(100%); opacity: 0; }
//             to { transform: translateY(0); opacity: 1; }
//           }
//           .animate-slideup {
//             animation: slideup 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
//           }
//         `}
//       </style>
//     </div>
//   );
// }
