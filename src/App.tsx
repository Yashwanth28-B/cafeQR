import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/admin/LoginPage";
import RegisterPage from "./pages/admin/RegisterPage";
import DashboardPage from "./pages/admin/DashboardPage";
import MenuManagementPage from "./pages/admin/MenuManagementPage";
import OrdersPage from "./pages/admin/OrdersPage";
import TablesPage from "./pages/admin/TablesPage";
import MenuPage from "./pages/customer/MenuPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin/register" element={<RegisterPage />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/menu" element={<MenuManagementPage />} />
          <Route path="/admin/orders" element={<OrdersPage />} />
          <Route path="/admin/tables" element={<TablesPage />} />
          <Route path="/menu/:tableId" element={<MenuPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
