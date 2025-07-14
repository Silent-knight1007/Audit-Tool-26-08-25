import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }
    const res = await fetch("http://localhost:5000/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setMsg(data.message);
    if (res.ok) setTimeout(() => navigate("/"), 2000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
      {msg && <div>{msg}</div>}
    </form>
  );
}