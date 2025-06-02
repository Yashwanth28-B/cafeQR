// ✅ Clean and Functional App.js for QR Café
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import MenuEditor from "./pages/MenuEditor";
import OrderManager from "./pages/OrderManager";
import CustomerMenu from "./pages/CustomerMenu";
import CustomerCart from "./pages/CustomerCart";
import Navbar from "./components/Navbar";

function ProtectedRoute({ token, children }) {
  if (!token) return <Navigate to="/admin" replace />;
  return children;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <MainRoutes token={token} setToken={setToken} />
    </Router>
  );
}

function MainRoutes({ token, setToken }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const showNavbar = token && isAdminPath;

  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin setToken={setToken} />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute token={token}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute token={token}>
              <MenuEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/:tableId"
          element={
            <ProtectedRoute token={token}>
              <OrderManager />
            </ProtectedRoute>
          }
        />

        {/* Customer Routes */}
        <Route path="/menu/:tableId" element={<CustomerMenu />} />
        <Route path="/cart/:tableId" element={<CustomerCart />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
}

export default App;
