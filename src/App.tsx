import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

// Layouts
import AdminLayout from "./components/Layout/AdminLayout";
import CustomerLayout from "./components/Layout/CustomerLayout";

// Admin Pages
import LoginPage from "./pages/admin/LoginPage";
import RegisterPage from "./pages/admin/RegisterPage";
import DashboardPage from "./pages/admin/DashboardPage";
import MenuManagementPage from "./pages/admin/MenuManagementPage";
import OrdersPage from "./pages/admin/OrdersPage";
import TablesPage from "./pages/admin/TablesPage";

// Customer Pages
import MenuPage from "./pages/customer/MenuPage";
import OrderStatusPage from "./pages/customer/OrderStatusPage";

// Auth Guard
import ProtectedRoute from "./components/Auth/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/table/1" replace />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/register" element={<RegisterPage />} />

            {/* Customer Routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/table/:tableId" element={<MenuPage />} />
              <Route
                path="/table/:tableId/order"
                element={<OrderStatusPage />}
              />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="menu" element={<MenuManagementPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="tables" element={<TablesPage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
