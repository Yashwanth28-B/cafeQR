// ✅ Updated Navbar.js (src/components/Navbar.js)
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  return (
    <nav className="navbar">
      <h3>QR Café Admin</h3>
      <div className="links">
        <Link to="/admin/dashboard">Orders for Tables</Link>
        <Link to="/admin/menu">Edit Menu</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
