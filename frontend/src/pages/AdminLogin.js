// src/pages/AdminLogin.js
import React, { useState } from "react";
import axios from "axios";
import "./AdminLogin.css";

export default function AdminLogin({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const API_BASE = process.env.REACT_APP_API_BASE;

  fetch(`${API_BASE}/api/menu`)
    .then((res) => res.json())
    .then((data) => console.log(data));

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_BASE}/admin/login`, {
        username,
        password,
      });
      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
