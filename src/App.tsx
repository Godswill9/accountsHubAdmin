
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Admin Auth pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import ForgotPassword from "./pages/admin/ForgotPassword";
import ResetPassword from "./pages/admin/ResetPassword";
import ChangePassword from "./pages/admin/ChangePassword";
import NotFound from "./pages/NotFound";

// Admin Dashboard pages
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import UsersPage from "./pages/admin/UsersPage";
import ProductsPage from "./pages/admin/ProductsPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import OrdersPage from "./pages/admin/OrdersPage";
import PaymentsPage from "./pages/admin/PaymentsPage";
import CouponsPage from "./pages/admin/CouponsPage";
import TicketsPage from "./pages/admin/TicketsPage";
import TicketDetail from "./pages/admin/TicketDetail";
import WalletPage from "./pages/admin/WalletPage";
import ProfilePage from "./pages/admin/ProfilePage";
import DigitalProductsPage from "./pages/admin/DigitalProductsPage";
import HomepageManagementPage from "./pages/admin/HomepageManagementPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Set Admin Signup as the default route */}
            <Route path="/" element={<Navigate to="/admin/signup" replace />} />
            
            {/* Admin Auth Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/admin/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />
            <Route path="/admin/change-password" element={<ChangePassword />} />

            {/* Redirect /admin to login page */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/login" replace />}
            />

            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard/*" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route
                path="digital-products"
                element={<DigitalProductsPage />}
              />
              <Route
                path="homepage-management"
                element={<HomepageManagementPage />}
              />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="payments" element={<PaymentsPage />} />
              <Route path="coupons" element={<CouponsPage />} />
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="tickets/:ticketId" element={<TicketDetail />} />
              <Route path="wallet" element={<WalletPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
