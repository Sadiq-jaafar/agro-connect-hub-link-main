
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Livestock from "./pages/Livestock";
import Crops from "./pages/Crops";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Cart from "./pages/Cart";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import FarmerDashboard from "./pages/FarmerDashboard";
import Auth from "./pages/Auth";
import { UserProvider } from "./contexts/UserContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { PurchaseRequestProvider } from "./contexts/PurchaseRequestContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agro-green/10 to-agro-brown/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-agro-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
        <UserProvider>
          <CartProvider>
            <PurchaseRequestProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />
                    <Route path="/" element={user ? <Layout><Home /></Layout> : <Navigate to="/auth" replace />} />
                    <Route path="/products" element={user ? <Layout><Products /></Layout> : <Navigate to="/auth" replace />} />
                    <Route path="/livestock" element={user ? <Layout><Livestock /></Layout> : <Navigate to="/auth" replace />} />
                    <Route path="/crops" element={user ? <Layout><Crops /></Layout> : <Navigate to="/auth" replace />} />
                    <Route path="/services" element={user ? <Layout><Services /></Layout> : <Navigate to="/auth" replace />} />
                    <Route path="/services/:serviceId" element={user ? <Layout><ServiceDetail /></Layout> : <Navigate to="/auth" replace />} />
                    <Route path="/cart" element={user ? <Layout><Cart /></Layout> : <Navigate to="/auth" replace />} />
                    <Route path="/purchases" element={user ? <Layout><Purchases /></Layout> : <Navigate to="/auth" replace />} />
                    <Route path="/sales" element={user ? <Layout><Sales /></Layout> : <Navigate to="/auth" replace />} />
                    <Route path="/contact" element={user ? <Layout><Contact /></Layout> : <Navigate to="/auth" replace />} />
                    <Route path="/profile" element={user ? <Layout><Profile /></Layout> : <Navigate to="/auth" replace />} />
                    <Route path="/farmer-dashboard" element={user ? <FarmerDashboard /> : <Navigate to="/auth" replace />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </PurchaseRequestProvider>
          </CartProvider>
        </UserProvider>
      </ThemeProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
