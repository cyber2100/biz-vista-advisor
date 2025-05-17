import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from './contexts/AuthContext';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import BusinessRegistrationPage from './pages/BusinessRegistrationPage';
import CurrencyExchangePage from './pages/CurrencyExchangePage';
import BusinessAnalyticsPage from './pages/BusinessAnalyticsPage';
import BusinessAdvicePage from './pages/BusinessAdvicePage';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes */}
              <Route path="/app" element={<Layout />}>
                <Route index element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="register" element={
                  <ProtectedRoute>
                    <BusinessRegistrationPage />
                  </ProtectedRoute>
                } />
                <Route path="currency" element={
                  <ProtectedRoute>
                    <CurrencyExchangePage />
                  </ProtectedRoute>
                } />
                <Route path="analytics" element={
                  <ProtectedRoute>
                    <BusinessAnalyticsPage />
                  </ProtectedRoute>
                } />
                <Route path="advice" element={
                  <ProtectedRoute>
                    <BusinessAdvicePage />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
