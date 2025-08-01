import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ✅ Only @onextel.com domain allowed
function validateOnextelEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@onextel\.com$/.test(email);
}

export default function AuthPanel() {
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginEmailError, setLoginEmailError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginEmailError("");

    // Check domain
    if (!validateOnextelEmail(loginEmail)) {
      setLoginEmailError("Only @onextel.com email addresses are allowed.");
      toast.error("Only @onextel.com email addresses are allowed!", { position: "top-center", autoClose: 2000 });
      return;
    }

    // Call backend
    try {
      const response = await fetch("http://localhost:5000/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Login successful
        localStorage.setItem("isAuthenticated", "true");
        toast.success("Access granted!", { position: "top-center", autoClose: 2000 });
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        toast.error(data.message || "Sign In failed.", { position: "top-center", autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Network error. Please try again.", { position: "top-center", autoClose: 2000 });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-white p-4 pt-24">
      <div className="w-full max-w-md mx-auto">
        <form
          className="bg-white border-2 border-red-800 p-8 rounded-2xl shadow-xl w-full animate-fade-in relative"
          onSubmit={handleLoginSubmit}
          autoComplete="off"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-red-700">Sign In</h2>
          <div className="mb-3">
            <label className="block text-red-700 mb-1 font-bold relative pointer-events-none" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="off"
              className={`w-full px-4 py-2 rounded text-black font-bold border border-red-700 focus:outline-none focus:border-red-700 transition bg-transparent placeholder-transparent`}
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            {loginEmailError && (
              <div className="text-red-600 text-sm mt-1">{loginEmailError}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 text-lg hover:bg-red-500 text-white font-bold py-2 rounded transition shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50">
            Sign In
          </button>
        </form>
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






